"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { uploadMediaFn } from "@/cms/functions";
import { ImageIcon, FileUp, Loader2, X } from "lucide-react";

export function MediaUploadField({
  name,
  label,
  value,
  kind = "image",
  hint,
  required,
  accept,
  onChange,
}: {
  name?: string;
  label: string;
  value?: string;
  kind?: "image" | "file";
  hint?: string;
  required?: boolean;
  accept?: string;
  onChange?: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(value ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultAccept =
    kind === "image"
      ? "image/jpeg,image/png,image/webp,image/gif"
      : "application/pdf,image/*,.doc,.docx,.xls,.xlsx";

  function setAndNotify(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  async function onPick(file: File | undefined) {
    if (!file) return;
    setPending(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const result = await uploadMediaFn({ data: fd });
      setAndNotify(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {name ? <input type="hidden" name={name} value={url} required={required && !url} /> : null}
      <div className="rounded-xl border border-border bg-white p-3">
        {kind === "image" && url ? (
          <div className="mb-3 overflow-hidden rounded-lg border border-border bg-[oklch(0.97_0.005_260)]">
            <img src={url} alt="" className="mx-auto max-h-48 object-contain" />
          </div>
        ) : null}
        {kind === "file" && url ? (
          <p className="mb-3 truncate text-sm text-brand-blue">
            <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
              {url}
            </a>
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-foreground hover:border-brand-blue disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : kind === "image" ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <FileUp className="h-4 w-4" />
            )}
            {pending ? "Uploading…" : url ? "Replace file" : "Upload file"}
          </button>
          {url ? (
            <button
              type="button"
              onClick={() => setAndNotify("")}
              className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm text-brand-gray hover:text-foreground"
            >
              <X className="h-4 w-4" /> Remove
            </button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept ?? defaultAccept}
          onChange={(event) => void onPick(event.target.files?.[0])}
        />
      </div>
      {hint ? <p className="text-xs text-brand-gray">{hint}</p> : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
