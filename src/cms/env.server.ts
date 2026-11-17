export type CmsEnv = {
  databaseUrl: string | null;
  adminUsername: string;
  adminPassword: string;
  sessionSecret: string;
  isDev: boolean;
};

function padSecret(value: string) {
  const base = value.length >= 32 ? value : `${value}${"0".repeat(32)}`;
  return base.slice(0, 64);
}

function readEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (typeof fromProcess === "string" && fromProcess.length > 0) return fromProcess;
  const meta = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[name];
  if (typeof meta === "string" && meta.length > 0) return meta;
  return undefined;
}

export async function getCmsEnv(): Promise<CmsEnv> {
  const isDev =
    Boolean(import.meta.env.DEV) ||
    import.meta.env.MODE === "development" ||
    import.meta.env.MODE === "dev" ||
    process.env.NODE_ENV !== "production";

  let adminUsername = readEnv("ADMIN_USERNAME")?.trim() || "admin";
  let adminPassword = readEnv("ADMIN_PASSWORD") || "";
  let sessionSecret = readEnv("SESSION_SECRET") || "";
  const databaseUrl = readEnv("DATABASE_URL") || null;

  if (!adminPassword && isDev) adminPassword = "imperial-local";
  if (!sessionSecret && isDev) sessionSecret = "imperial-local-session-secret-change-me";

  return {
    databaseUrl,
    adminUsername,
    adminPassword,
    sessionSecret: padSecret(sessionSecret || "imperial-fallback-session-secret"),
    isDev,
  };
}
