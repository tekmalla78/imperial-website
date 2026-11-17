import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import {
  mimeForUpload,
  resolveUploadAbsolutePath,
} from "./src/cms/media.server";

/**
 * Vite keeps a snapshot of public/ files and 404s brand-new uploads until the
 * watcher catches up (~1–2s). Serve uploads from disk before that middleware.
 */
export function serveUploadsPlugin(): Plugin {
  return {
    name: "serve-cms-uploads",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          const pathname = decodeURIComponent((req.url ?? "").split("?")[0] ?? "");
          if (!pathname.startsWith("/uploads/")) {
            next();
            return;
          }
          const absolute = resolveUploadAbsolutePath(pathname.slice("/uploads/".length));
          if (!absolute || !existsSync(absolute)) {
            next();
            return;
          }
          const filename = path.basename(absolute);
          const stats = statSync(absolute);
          res.statusCode = 200;
          res.setHeader("Content-Type", mimeForUpload(filename));
          res.setHeader("Content-Length", String(stats.size));
          res.setHeader("Cache-Control", "no-cache");
          createReadStream(absolute).pipe(res);
        } catch {
          next();
        }
      });
    },
  };
}
