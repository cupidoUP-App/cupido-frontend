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
    envDir: '.env',
    root: path.resolve(__dirname, ".."),
    css: {
      postcss: path.resolve(__dirname, "./postcss.config.cjs"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../src"),
        "@ui": path.resolve(__dirname, "../src/shared/components/ui"),
        "@store": path.resolve(__dirname, "../src/shared/store"),
        "@hooks": path.resolve(__dirname, "../src/shared/hooks"),
        "@lib": path.resolve(__dirname, "../src/shared/lib"),
        "@types": path.resolve(__dirname, "../src/shared/types"),
        "@home": path.resolve(__dirname, "../src/features/home"),
        "@pages": path.resolve(__dirname, "../src/shared/pages"),
        "@profile": path.resolve(__dirname, "../src/features/profile"),
        "@filters": path.resolve(__dirname, "../src/features/filters"),
        "@preferences": path.resolve(__dirname, "../src/features/preferences"),
        "@assets": path.resolve(__dirname, "../src/assets"),
        "@test": path.resolve(__dirname, "../src/shared/test"),
        "@features": path.resolve(__dirname, "../src/features"),
        "@components": path.resolve(__dirname, "../src/shared/components"),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: '../src/shared/test/setup.ts',
    },
  };
});


