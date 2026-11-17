"use client";

import { logoutFn } from "@/cms/functions";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="rounded-md px-2.5 py-1.5 text-sm font-medium text-brand-gray hover:bg-muted hover:text-foreground"
      onClick={() => {
        void logoutFn();
      }}
    >
      Sign out
    </button>
  );
}
