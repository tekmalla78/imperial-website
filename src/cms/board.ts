export type BoardMember = {
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
  bio: string;
  photo: string;
};

export function parseBoardMembers(value: unknown): BoardMember[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as BoardMember[];
      if (Array.isArray(parsed)) {
        return parsed.map((row) => ({
          name: String(row.name ?? ""),
          role: String(row.role ?? ""),
          email: String(row.email ?? ""),
          phone: String(row.phone ?? ""),
          linkedin: String(row.linkedin ?? ""),
          bio: String(row.bio ?? ""),
          photo: String(row.photo ?? ""),
        }));
      }
    } catch {
      /* fall through */
    }
  }
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", role = "", email = "", ...rest] = line.split("|");
      return {
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        phone: "",
        linkedin: "",
        bio: rest.join("|").trim(),
        photo: "",
      };
    });
}
