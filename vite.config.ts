import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import path from "path";
import { polarPolyfillPlugin } from "./src/scripts/vite-polar-polyfill-plugin.ts";

dotenv.config({ path: "./.env.local" });

const config = defineConfig({
  plugins: [
    // Fix for @convex-dev/polar polyfill module resolution
    polarPolyfillPlugin(),
    // this is the plugin that enables path aliases
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
      // Fix for @convex-dev/polar polyfill module resolution issue
      "@convex-dev/polar/client/polyfill": path.resolve(
        __dirname,
        "src/scripts/polar-polyfill.ts",
      ),
      // Additional aliases for different import patterns
      "@convex-dev/polar/dist/esm/client/polyfill": path.resolve(
        __dirname,
        "src/scripts/polar-polyfill.ts",
      ),
    },
  },
  optimizeDeps: {
    // Force pre-bundling of @convex-dev/polar to handle module resolution
    include: ["@convex-dev/polar"],
    // Exclude problematic modules from optimization
    exclude: [],
  },
  ssr: {
    // Handle SSR module resolution for @convex-dev/polar
    noExternal: ["@convex-dev/polar", "posthog-js", "posthog-js/react"],
  },
  server: {
    proxy: {
      "/api/auth": {
        target: "https://wooden-lemur-583.convex.site",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

export default config;
