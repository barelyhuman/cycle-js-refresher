import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import babel from "vite-plugin-babel";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  esbuild:{
    jsx:"automatic",
    jsxImportSource:"local-shared"
  },
  plugins: [
    // babel(),
  ],
});
