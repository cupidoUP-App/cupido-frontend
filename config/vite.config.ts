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
    envDir: '.',
    root: path.resolve(__dirname, ".."),
    css: {
      postcss: path.resolve(__dirname, "./postcss.config.cjs"),
    },
    // --------------------------------------------------------
    // Configuración de build optimizada para mejor performance
    // Divide el bundle en chunks más pequeños y paralelos
    // --------------------------------------------------------
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Chunk principal de React y ReactDOM
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Librerías de UI y componentes
            'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast', '@radix-ui/react-tooltip', '@radix-ui/react-popover', '@radix-ui/react-tabs'],
            // Librerías de data fetching y estado
            'vendor-data': ['axios', '@tanstack/react-query', 'zustand'],
            // Librerías de animación y efectos
            'vendor-motion': ['framer-motion'],
            // Librerías de formularios y validación
            'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          },
        },
      },
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


