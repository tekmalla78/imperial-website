import { getCookie, useSession, getRequestIP } from "@tanstack/react-start/server";
import { getCmsEnv } from "./env.server";

export type AdminSessionData = {
  user?: string;
};

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function adminSession() {
  const env = await getCmsEnv();
  return useSession<AdminSessionData>({
    name: "imperial_admin",
    password: env.sessionSecret,
    maxAge: 60 * 60 * 12,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: !env.isDev,
      path: "/",
    },
  });
}

export async function getAdminUser() {
  const session = await adminSession();
  return session.data.user ?? null;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

function timingSafeEqual(a: string, b: string) {
  const enc = new TextEncoder();
  const aBuf = enc.encode(a);
  const bBuf = enc.encode(b);
  const len = Math.max(aBuf.length, bBuf.length);
  const aa = new Uint8Array(len);
  const bb = new Uint8Array(len);
  aa.set(aBuf);
  bb.set(bBuf);
  let diff = aBuf.length === bBuf.length ? 0 : 1;
  for (let i = 0; i < len; i += 1) diff |= aa[i] ^ bb[i];
  return diff === 0;
}

export function checkLoginRateLimit() {
  const ip = getRequestIP({ xForwardedFor: true }) ?? "local";
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { ok: true };
  }
  if (current.count >= 8) {
    return { ok: false, retryMin: Math.ceil((current.resetAt - now) / 60000) };
  }
  current.count += 1;
  return { ok: true };
}

export async function verifyCredentials(username: string, password: string) {
  const env = await getCmsEnv();
  if (!env.adminPassword) return false;
  const userOk = timingSafeEqual(username.trim(), env.adminUsername);
  const passOk = timingSafeEqual(password, env.adminPassword);
  return userOk && passOk;
}

export async function createLoginSession(username: string) {
  const session = await adminSession();
  await session.update({ user: username });
}

export async function destroyLoginSession() {
  const session = await adminSession();
  await session.clear();
}

export function getCsrfHint() {
  return getCookie("imperial_admin") ? "1" : "";
}
