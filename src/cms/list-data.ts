/** JSON-first list helpers with legacy pipe-text fallback for older CMS rows. */

function tryParseJsonArray(value: unknown): unknown[] | null {
  const raw = String(value ?? "").trim();
  if (!raw.startsWith("[")) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function parseLineList(value: unknown): string[] {
  const json = tryParseJsonArray(value);
  if (json) {
    return json.map((row) => String(row ?? "").trim()).filter(Boolean);
  }
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function serializeLineList(rows: string[]): string {
  return JSON.stringify(rows.map((row) => row.trim()).filter(Boolean));
}

export type PairRow = { title: string; desc: string };

export function parsePairList(value: unknown): PairRow[] {
  const json = tryParseJsonArray(value);
  if (json) {
    return json.map((row) => {
      if (row && typeof row === "object") {
        const item = row as Record<string, unknown>;
        return {
          title: String(item.title ?? item.label ?? item.value ?? ""),
          desc: String(item.desc ?? item.description ?? item.href ?? item.path ?? ""),
        };
      }
      return { title: String(row ?? ""), desc: "" };
    });
  }
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: (title ?? "").trim(), desc: rest.join("|").trim() };
    });
}

export function serializePairList(rows: PairRow[]): string {
  return JSON.stringify(
    rows
      .map((row) => ({ title: row.title.trim(), desc: row.desc.trim() }))
      .filter((row) => row.title || row.desc),
  );
}

export type TripleRow = { a: string; b: string; c: string };

export function parseTripleList(value: unknown): TripleRow[] {
  const json = tryParseJsonArray(value);
  if (json) {
    return json.map((row) => {
      if (row && typeof row === "object") {
        const item = row as Record<string, unknown>;
        return {
          a: String(item.a ?? item.group ?? item.year ?? ""),
          b: String(item.b ?? item.label ?? item.title ?? ""),
          c: String(item.c ?? item.path ?? item.href ?? item.desc ?? item.description ?? ""),
        };
      }
      return { a: String(row ?? ""), b: "", c: "" };
    });
  }
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [a, b, ...rest] = line.split("|");
      return {
        a: (a ?? "").trim(),
        b: (b ?? "").trim(),
        c: rest.join("|").trim(),
      };
    });
}

export function serializeTripleList(rows: TripleRow[]): string {
  return JSON.stringify(
    rows
      .map((row) => ({ a: row.a.trim(), b: row.b.trim(), c: row.c.trim() }))
      .filter((row) => row.a || row.b || row.c),
  );
}

export type TimelineRow = {
  year: string;
  title: string;
  desc: string;
  icon: string;
};

export function parseTimelineList(value: unknown): TimelineRow[] {
  const json = tryParseJsonArray(value);
  if (json) {
    return json.map((row) => {
      if (row && typeof row === "object") {
        const item = row as Record<string, unknown>;
        return {
          year: String(item.year ?? item.a ?? ""),
          title: String(item.title ?? item.b ?? ""),
          desc: String(item.desc ?? item.description ?? item.c ?? ""),
          icon: String(item.icon ?? ""),
        };
      }
      return { year: "", title: "", desc: "", icon: "" };
    });
  }
  return parseTripleList(value).map((row) => ({
    year: row.a,
    title: row.b,
    desc: row.c,
    icon: "",
  }));
}

export function serializeTimelineList(rows: TimelineRow[]): string {
  return JSON.stringify(
    rows
      .map((row) => ({
        year: row.year.trim(),
        title: row.title.trim(),
        desc: row.desc.trim(),
        icon: row.icon.trim(),
      }))
      .filter((row) => row.year || row.title || row.desc),
  );
}
