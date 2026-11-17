export function seoMeta(title: string, description: string) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
  ];
}

export function str(value: unknown, fallback = "") {
  return value == null ? fallback : String(value);
}

export function asBool(value: unknown) {
  return value !== false && value !== "false" && value !== "";
}
