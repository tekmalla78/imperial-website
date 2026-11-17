import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { loginFn } from "@/cms/functions";
import logoUrl from "@/assets/logo.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/admin/login")({
  validateSearch: z.object({
    next: z.string().optional(),
  }),
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Imperial Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function LoginPage() {
  const { next } = Route.useSearch();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.97_0.005_260)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-7 shadow-sm">
        <img src={logoUrl} alt="Imperial Securities" className="mb-6 h-12 w-auto" />
        <h1 className="text-xl font-semibold tracking-tight">Sign in to edit the website</h1>
        <p className="mt-1 text-sm text-brand-gray">
          Only staff with an admin password can change public pages.
        </p>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            setPending(true);
            setError(null);
            void loginFn({
              data: {
                username: String(form.get("username") ?? ""),
                password: String(form.get("password") ?? ""),
                next,
              },
            })
              .then((result) => {
                if (result && "error" in result && result.error) {
                  setError(result.error);
                  setPending(false);
                  return;
                }
                if (result && "ok" in result && result.ok) {
                  window.location.assign(result.next);
                  return;
                }
                setPending(false);
                setError("Could not sign in. Try again.");
              })
              .catch((err: unknown) => {
                setPending(false);
                setError(err instanceof Error ? err.message : "Could not sign in.");
              });
          }}
        >
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <div className="grid gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" autoComplete="username" required className="h-11 bg-white" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-11 bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-brand-blue px-4 text-sm font-semibold text-white hover:bg-brand-blue-dk disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {import.meta.env.DEV ? (
          <p className="mt-5 text-xs leading-relaxed text-brand-gray">
            Local default: username <code className="font-medium">admin</code>, password{" "}
            <code className="font-medium">imperial-local</code>. Set ADMIN_USERNAME and ADMIN_PASSWORD in{" "}
            <code>.env</code> (or Docker Compose) before going live.
          </p>
        ) : null}
      </div>
    </div>
  );
}
