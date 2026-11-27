import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

const jsxInJsPlugin = {
  name: "jsx-in-js",
  enforce: "pre",
  async transform(code, id) {
    if (!/\/src\/.*\.js$/.test(id.replace(/\\/g, "/"))) return null;
    return transformWithOxc(code, id, {
      lang: "jsx",
      jsx: { runtime: "classic" },
    });
  },
};

export default defineConfig({
  base: "./",
  plugins: [
    jsxInJsPlugin,
    react({
      include: /\.(js|jsx|ts|tsx)$/,
    }),
  ],
  define: {
    "process.env.PUBLIC_URL": JSON.stringify("."),
  },
  build: {
    outDir: "build",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
