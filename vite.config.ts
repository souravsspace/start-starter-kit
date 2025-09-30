import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import path from "path";

import { polarPolyfillPlugin } from "./src/scripts/vite-polar-polyfill-plugin.ts";

dotenv.config({ path: "./.env.local" });

const config = defineConfig({
  plugins: [
    polarPolyfillPlugin(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@convex-dev/polar/client/polyfill": path.resolve(
        __dirname,
        "src/scripts/polar-polyfill.ts",
      ),
      "@convex-dev/polar/dist/esm/client/polyfill": path.resolve(
        __dirname,
        "src/scripts/polar-polyfill.ts",
      ),
    },
  },
  optimizeDeps: {
    include: ["@convex-dev/polar"],
    exclude: [],
  },
  ssr: {
    noExternal: ["@convex-dev/polar", "posthog-js", "posthog-js/react"],
  },
  server: {
    proxy: {
      "/api/auth": {
        target: process.env.VITE_CONVEX_SITE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

export default config;
