// <reference types="vitest" />
//Ya se establecen los types en los tsconfig
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    //esbuild: { tsconfigRaw: require("./tsconfig/tsconfig.json") },
    server: {
      host: isDev ? "::" : "127.0.0.1",
      port: 8080,
      proxy: {
        "/api": {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: !isDev,
        },
      },
    },
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    envDir: path.resolve(__dirname, 'env'),
    root: path.resolve(__dirname, ".."),
    css: {
      postcss: path.resolve(__dirname, "./postcss.config.cjs"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../src"),
        "@assets": path.resolve(__dirname, "../src/assets"),
        //Shared
        "@layout": path.resolve(__dirname, "../src/shared/components/layout"),
        "@modals": path.resolve(__dirname, "../src/shared/components/modals"),
        "@ui": path.resolve(__dirname, "../src/shared/components/ui"),
        "@hooks": path.resolve(__dirname, "../src/shared/hooks"),
        "@lib": path.resolve(__dirname, "../src/shared/lib"),
        "@pages": path.resolve(__dirname, "../src/shared/pages"),
        "@store": path.resolve(__dirname, "../src/shared/store"),
        //Features
        "@admin": path.resolve(__dirname, "../src/features/admin"),
        "@auth": path.resolve(__dirname, "../src/features/auth"),
        "@chat": path.resolve(__dirname, "../src/features/chat"),
        "@dashboard": path.resolve(__dirname, "../src/features/dashboard"),
        "@filters": path.resolve(__dirname, "../src/features/filters"),
        "@home": path.resolve(__dirname, "../src/features/home"),
        "@matching": path.resolve(__dirname, "../src/features/matching"),
        "@notifications": path.resolve(__dirname, "../src/features/notifications"),
        "@photos": path.resolve(__dirname, "../src/features/photos"),
        "@preferences": path.resolve(__dirname, "../src/features/preferences"),
        "@profile": path.resolve(__dirname, "../src/features/profile"),
        "@sidebar": path.resolve(__dirname, "../src/features/sidebar"),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: '../src/shared/lib/test/setup.ts',
    },
  };
});


