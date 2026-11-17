import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { Readable } from "node:stream";

export const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 12 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const FILE_TYPES = new Set([
  ...IMAGE_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function safeExt(name: string, mime: string) {
  const fromName = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, "");
  if (fromName && fromName.length <= 8) return fromName;
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  if (mime === "application/pdf") return ".pdf";
  return ".bin";
}

/** Only allow flat filenames written by saveUploadedFile (no path traversal). */
export function sanitizeUploadFilename(raw: string): string | null {
  const name = path.basename(String(raw ?? "").replace(/\\/g, "/"));
  if (!name || name === "." || name === ".." || !/^[a-zA-Z0-9._-]+$/.test(name)) {
    return null;
  }
  return name;
}

export function resolveUploadAbsolutePath(raw: string): string | null {
  const name = sanitizeUploadFilename(raw);
  if (!name) return null;
  const root = path.resolve(UPLOAD_ROOT);
  const absolute = path.resolve(UPLOAD_ROOT, name);
  if (!absolute.startsWith(root + path.sep)) {
    return null;
  }
  return absolute;
}

export function mimeForUpload(filename: string): string {
  return MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
}

export async function saveUploadedFile(
  file: File,
  kind: "image" | "file" = "file",
): Promise<{ url: string; name: string; size: number; mime: string }> {
  if (!(file instanceof File) || file.size <= 0) {
    throw new Error("Choose a file to upload.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File is too large (max 12 MB).");
  }
  const mime = file.type || "application/octet-stream";
  const allowed = kind === "image" ? IMAGE_TYPES : FILE_TYPES;
  if (!allowed.has(mime)) {
    throw new Error(kind === "image" ? "Upload a JPG, PNG, WebP, or GIF image." : "That file type is not allowed.");
  }

  await mkdir(UPLOAD_ROOT, { recursive: true });
  const stamp = `${Date.now()}-${randomBytes(4).toString("hex")}`;
  const filename = `${stamp}${safeExt(file.name, mime)}`;
  const absolute = path.join(UPLOAD_ROOT, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolute, buffer);

  return {
    url: `/uploads/${filename}`,
    name: file.name,
    size: file.size,
    mime,
  };
}

export async function createUploadResponse(rawName: string): Promise<Response> {
  const absolute = resolveUploadAbsolutePath(rawName);
  if (!absolute || !existsSync(absolute)) {
    return new Response("Not found", { status: 404 });
  }
  const filename = path.basename(absolute);
  const stats = statSync(absolute);
  const body = Readable.toWeb(createReadStream(absolute)) as ReadableStream;
  return new Response(body, {
    headers: {
      "Content-Type": mimeForUpload(filename),
      "Content-Length": String(stats.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
