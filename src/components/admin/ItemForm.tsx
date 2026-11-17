"use client";

import { useMemo, useState } from "react";
import { saveItemFn } from "@/cms/functions";
import type { CmsData } from "@/cms/types";
import type { FieldDef } from "@/cms/collections";
import { AdminField } from "./AdminField";
import { SeoPreview } from "./SeoPreview";

export function ItemForm({
  collection,
  id,
  fields,
  initial,
  redirectTo,
  publicPath,
}: {
  collection: string;
  id?: string;
  fields: FieldDef[];
  initial: CmsData;
  redirectTo: string;
  publicPath?: string | null;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState(String(initial.seoTitle ?? initial.title ?? ""));
  const [seoDescription, setSeoDescription] = useState(
    String(initial.seoDescription ?? initial.excerpt ?? initial.subtitle ?? ""),
  );

  const previewPath = publicPath ?? "/";
  const seoFields = useMemo(
    () => new Set(["seoTitle", "seoDescription", "title", "excerpt", "subtitle"]),
    [],
  );

  return (
    <form
      className="grid max-w-4xl gap-5"
      onInput={(event) => {
        const form = event.currentTarget;
        const read = (name: string) =>
          (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "";
        setSeoTitle(read("seoTitle") || read("title"));
        setSeoDescription(read("seoDescription") || read("excerpt") || read("subtitle"));
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const fd = new FormData(form);
        const data: CmsData = { ...initial };
        for (const [key, value] of fd.entries()) {
          data[key] = String(value);
        }
        for (const field of fields) {
          if (field.type === "toggle") {
            const checkbox = form.elements.namedItem(field.name) as HTMLInputElement | null;
            data[field.name] = Boolean(checkbox?.checked);
          }
        }
        setPending(true);
        setError(null);
        void saveItemFn({ data: { collection, id, data } })
          .then(() => {
            window.location.assign(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}saved=1`);
          })
          .catch((err: unknown) => {
            setPending(false);
            setError(err instanceof Error ? err.message : "Could not save. Try again.");
          });
      }}
    >
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      ) : null}

      {fields.map((field) => (
        <AdminField
          key={field.name}
          field={field}
          value={initial[field.name]}
        />
      ))}

      {fields.some((field) => seoFields.has(field.name)) ? (
        <SeoPreview title={seoTitle} description={seoDescription} path={previewPath} />
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-brand-green px-5 text-sm font-semibold text-white hover:bg-brand-green-dk disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {publicPath ? (
          <a
            href={publicPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-brand-blue hover:border-brand-blue"
          >
            Preview on site
          </a>
        ) : null}
        <a href={redirectTo.split("?")[0]} className="inline-flex min-h-11 items-center px-2 text-sm text-brand-gray hover:text-foreground">
          Cancel
        </a>
      </div>
    </form>
  );
}
