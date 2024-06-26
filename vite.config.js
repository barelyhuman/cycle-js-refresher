import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "local-shared",
  },
  plugins: [],
});
