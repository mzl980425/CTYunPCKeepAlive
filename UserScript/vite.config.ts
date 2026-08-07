import react from "@vitejs/plugin-react-swc";
import monkey from "vite-plugin-monkey";
import { defineConfig } from "vite";
import { pageUrl } from "./package.json" with { type: "json" };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: "src/main.tsx",
      userscript: {
        icon: "https://pc.ctyun.cn/static/common/favicon.ico",
        name: "天翼云电脑续命工具",
        match: ["https://pc.ctyun.cn/"],
        "run-at": "document-body",
        updateURL: `${pageUrl}/user-script.user.js`,
        downloadURL: `${pageUrl}/user-script.user.js`,
      },
    }),
  ],

  build: {
    minify: true,
    cssMinify: true,
  },
});
