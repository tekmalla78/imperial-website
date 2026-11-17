/** Render CMS rich text or plain paragraphs on public pages. */
export function CmsHtml({
  value,
  className = "prose prose-sm max-w-none text-brand-gray [&_a]:text-brand-blue [&_img]:rounded-xl [&_table]:w-full [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border [&_th]:bg-muted/40 [&_th]:px-2 [&_th]:py-1",
}: {
  value: unknown;
  className?: string;
}) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  if (raw.startsWith("<")) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: raw }} />;
  }

  const paragraphs = raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}

export function looksLikeHtml(value: unknown) {
  return String(value ?? "").trim().startsWith("<");
}
