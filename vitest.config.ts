import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setup-tests.ts"],
  },
  resolve: {
    alias: {
      "#components": path.resolve(__dirname, "src/components"),
      "#constants": path.resolve(__dirname, "src/constants"),
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
