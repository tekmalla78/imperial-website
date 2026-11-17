"use client";

import { useState } from "react";
import { deleteItemFn } from "@/cms/functions";

export function DeleteItemButton({
  collection,
  id,
  redirectTo,
}: {
  collection: string;
  id: string;
  redirectTo: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      className="text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
      onClick={() => {
        if (!window.confirm("Remove this from the website? You can add it again later.")) return;
        setPending(true);
        void deleteItemFn({ data: { collection, id } })
          .then(() => {
            window.location.assign(`${redirectTo}?saved=1`);
          })
          .catch(() => setPending(false));
      }}
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
