import postgres from "postgres";
import { buildSeed, CMS_SEED_VERSION } from "./seed";
import { getCmsEnv } from "./env.server";
import type { CmsData, CmsRecord } from "./types";

type Sql = ReturnType<typeof postgres>;

type MemoryStore = {
  kv: Map<string, CmsRecord>;
  version: number;
};

const g = globalThis as typeof globalThis & {
  __imperialCms?: MemoryStore;
  __imperialPg?: Sql;
  __imperialPgFailed?: boolean;
};

function memory(): MemoryStore {
  if (!g.__imperialCms) {
    g.__imperialCms = { kv: new Map(), version: 0 };
  }
  return g.__imperialCms;
}

function key(collection: string, id: string) {
  return `${collection}:${id}`;
}

function parseSeedVersion(raw: unknown) {
  if (raw == null) return 0;
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Number((data as { version?: number }).version) || 0;
  } catch {
    return 0;
  }
}

async function getSql(): Promise<Sql | null> {
  const env = await getCmsEnv();
  if (!env.databaseUrl || g.__imperialPgFailed) return null;
  try {
    if (!g.__imperialPg) {
      g.__imperialPg = postgres(env.databaseUrl, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 5,
      });
      await g.__imperialPg`select 1 as ok`;
    }
    return g.__imperialPg;
  } catch (error) {
    console.warn(
      "[cms] Postgres unavailable — falling back to in-memory store. Start Docker with `npm run db:up`.",
      error instanceof Error ? error.message : error,
    );
    g.__imperialPgFailed = true;
    if (g.__imperialPg) {
      try {
        await g.__imperialPg.end({ timeout: 0 });
      } catch {
        /* ignore */
      }
      g.__imperialPg = undefined;
    }
    return null;
  }
}

async function insertSeed(sql: Sql) {
  const seed = buildSeed();
  await sql.begin(async (tx) => {
    for (const item of seed) {
      await tx`
        INSERT INTO kv (collection, id, data, updated_at)
        VALUES (${item.collection}, ${item.id}, ${sql.json(item.data)}, ${item.updatedAt})
        ON CONFLICT (collection, id) DO UPDATE
        SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
      `;
    }
  });
}

export async function ensureSeeded() {
  const sql = await getSql();
  if (sql) {
    await sql`
      CREATE TABLE IF NOT EXISTS kv (
        collection TEXT NOT NULL,
        id TEXT NOT NULL,
        data JSONB NOT NULL,
        updated_at BIGINT NOT NULL,
        PRIMARY KEY (collection, id)
      )
    `;
    const rows = await sql<{ data: unknown }[]>`
      SELECT data FROM kv WHERE collection = ${"_meta"} AND id = ${"seed"} LIMIT 1
    `;
    if (parseSeedVersion(rows[0]?.data) !== CMS_SEED_VERSION) {
      await sql`DELETE FROM kv`;
      await insertSeed(sql);
    }
    return;
  }

  const mem = memory();
  if (mem.version !== CMS_SEED_VERSION) {
    mem.kv.clear();
    for (const item of buildSeed()) {
      mem.kv.set(key(item.collection, item.id), item);
    }
    mem.version = CMS_SEED_VERSION;
  }
}

export async function listRecords(collection: string): Promise<CmsRecord[]> {
  await ensureSeeded();
  const sql = await getSql();
  if (sql) {
    const rows = await sql<{ collection: string; id: string; data: CmsData; updated_at: string | number }[]>`
      SELECT collection, id, data, updated_at
      FROM kv
      WHERE collection = ${collection}
      ORDER BY updated_at DESC
    `;
    return rows.map((row) => ({
      id: row.id,
      collection: row.collection,
      data: row.data,
      updatedAt: Number(row.updated_at),
    }));
  }
  return [...memory().kv.values()]
    .filter((item) => item.collection === collection)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getRecord(collection: string, id: string): Promise<CmsRecord | null> {
  await ensureSeeded();
  const sql = await getSql();
  if (sql) {
    const rows = await sql<{ collection: string; id: string; data: CmsData; updated_at: string | number }[]>`
      SELECT collection, id, data, updated_at
      FROM kv
      WHERE collection = ${collection} AND id = ${id}
      LIMIT 1
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      collection: row.collection,
      data: row.data,
      updatedAt: Number(row.updated_at),
    };
  }
  return memory().kv.get(key(collection, id)) ?? null;
}

export async function upsertRecord(record: CmsRecord) {
  await ensureSeeded();
  const next = { ...record, updatedAt: Date.now() };
  const sql = await getSql();
  if (sql) {
    await sql`
      INSERT INTO kv (collection, id, data, updated_at)
      VALUES (${next.collection}, ${next.id}, ${sql.json(next.data)}, ${next.updatedAt})
      ON CONFLICT (collection, id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
    `;
    return next;
  }
  memory().kv.set(key(next.collection, next.id), next);
  return next;
}

export async function deleteRecord(collection: string, id: string) {
  await ensureSeeded();
  const sql = await getSql();
  if (sql) {
    await sql`DELETE FROM kv WHERE collection = ${collection} AND id = ${id}`;
    return;
  }
  memory().kv.delete(key(collection, id));
}

export function isPublished(data: CmsData) {
  return data.published !== false && data.published !== "false" && data.published !== "";
}

export async function listPublished(collection: string) {
  const items = await listRecords(collection);
  return items.filter((item) => isPublished(item.data));
}

export async function collectionCounts() {
  await ensureSeeded();
  const sql = await getSql();
  if (sql) {
    const rows = await sql<{ collection: string; c: string | number }[]>`
      SELECT collection, COUNT(*)::int AS c FROM kv GROUP BY collection
    `;
    return Object.fromEntries(rows.map((row) => [row.collection, Number(row.c)]));
  }
  const counts: Record<string, number> = {};
  for (const item of memory().kv.values()) {
    counts[item.collection] = (counts[item.collection] ?? 0) + 1;
  }
  return counts;
}
