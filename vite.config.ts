import { defineConfig, loadEnv, type PluginOption } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { serveUploadsPlugin } from "./vite.uploads-plugin";

export default defineConfig(({ mode, command }) => {
  // Load all env keys so Node SSR can read DATABASE_URL / ADMIN_* in Vite + Nitro.
  const env = loadEnv(mode, process.cwd(), "");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("VITE_")) {
      envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }

  const plugins: PluginOption[] = [
    serveUploadsPlugin(),
    tanstackStart(),
    // Nitro is required for production Node output. In `vite dev` it can leak
    // non-serializable config (e.g. publicPath fn) into Start's SSR dehydrate.
    ...(command === "build" ? [nitro()] : []),
    viteReact(),
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
  ];

  return {
    define: envDefine,
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: {
      host: "::",
      port: Number(process.env.PORT || 8080),
    },
    plugins,
  };
});
