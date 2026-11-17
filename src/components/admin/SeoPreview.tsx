export function SeoPreview({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const shownTitle = title.slice(0, 60) || "Untitled page";
  const shownDesc = description.slice(0, 160) || "Add a short description so this page is easy to find.";
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-gray">How it may look in Google</p>
      <p className="truncate text-sm text-brand-blue">{shownTitle}</p>
      <p className="truncate text-xs text-brand-green-dk">imperialsecurities.com.np{path}</p>
      <p className="mt-1 text-sm leading-snug text-brand-gray">{shownDesc}</p>
    </div>
  );
}
