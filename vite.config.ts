import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "#components": path.resolve(__dirname, "src/components"),
      "#context": path.resolve(__dirname, "src/context"),
      "#environments": path.resolve(__dirname, "src/environments"),
      "#hooks": path.resolve(__dirname, "src/hooks"),
      "#pages": path.resolve(__dirname, "src/pages"),
      "#router": path.resolve(__dirname, "src/router"),
      "#services": path.resolve(__dirname, "src/services"),
      "#types": path.resolve(__dirname, "src/types"),
      "#utils": path.resolve(__dirname, "src/utils"),
      "#": path.resolve(__dirname, "src"),
    },
  },
});
