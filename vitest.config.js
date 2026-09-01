import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

/**
 * Custom plugin that teaches Vite/Rollup to treat .js files under src/ as JSX
 * when they contain JSX syntax. This resolves the ssrTransformScript parse error
 * that occurs because Rollup's native parser doesn't support JSX in .js files.
 */
function jsxInJs() {
  return {
    name: "jsx-in-js",
    enforce: "pre",
    async transform(code, id) {
      // Only transform .js files in src/ that likely contain JSX
      if (!/src[/\\].*\.js$/.test(id)) return null;
      if (!code.includes("<") || !code.includes("/>") && !code.includes("</")) return null;

      // Use esbuild to strip JSX before Rollup sees it
      const { transformSync } = await import("esbuild");
      const result = transformSync(code, {
        loader: "jsx",
        jsx: "automatic",
        sourcefile: id,
        sourcemap: true,
      });
      return { code: result.code, map: result.map };
    },
  };
}

/**
 * Vitest configuration for the Dev Learning Platform.
 *
 * - `@vitejs/plugin-react` enables the JSX transform for component tests.
 * - `jsdom` provides a browser-like DOM for React Testing Library.
 * - `setupFiles` registers jest-dom matchers (e.g. `toBeInTheDocument`).
 * - The `@/*` alias mirrors `jsconfig.json` (`@/* -> ./src/*`).
 * - The custom `jsxInJs` plugin ensures .js files with JSX in src/ are
 *   pre-transformed before Rollup's SSR parser sees them.
 */
export default defineConfig({
  plugins: [jsxInJs(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    include: ["src/**/*.{test,spec}.{js,jsx}", "tests/**/*.{test,spec}.{js,jsx}"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
