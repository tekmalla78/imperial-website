import { createFileRoute } from "@tanstack/react-router";
import { createUploadResponse } from "@/cms/media.server";

export const Route = createFileRoute("/uploads/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const name = params._splat ?? "";
        return createUploadResponse(name);
      },
    },
  },
});
