// config/vite.config.ts
import { defineConfig } from "file:///D:/Documentos/Santiago/Portafolio/Proyectos/Programacion%20basica/cUPido/cupido-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Documentos/Santiago/Portafolio/Proyectos/Programacion%20basica/cUPido/cupido-frontend/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/Documentos/Santiago/Portafolio/Proyectos/Programacion%20basica/cUPido/cupido-frontend/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\Documentos\\Santiago\\Portafolio\\Proyectos\\Programacion basica\\cUPido\\cupido-frontend\\config";
var vite_config_default = defineConfig(({ mode }) => {
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
          secure: !isDev
        }
      }
    },
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    envDir: "./config/env",
    root: path.resolve(__vite_injected_original_dirname, ".."),
    css: {
      postcss: path.resolve(__vite_injected_original_dirname, "./postcss.config.cjs")
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "../src"),
        "@ui": path.resolve(__vite_injected_original_dirname, "../src/shared/components/ui"),
        "@store": path.resolve(__vite_injected_original_dirname, "../src/shared/store"),
        "@hooks": path.resolve(__vite_injected_original_dirname, "../src/shared/hooks"),
        "@lib": path.resolve(__vite_injected_original_dirname, "../src/shared/lib"),
        "@types": path.resolve(__vite_injected_original_dirname, "../src/shared/types"),
        "@home": path.resolve(__vite_injected_original_dirname, "../src/features/home"),
        "@pages": path.resolve(__vite_injected_original_dirname, "../src/shared/pages"),
        "@profile": path.resolve(__vite_injected_original_dirname, "../src/features/profile"),
        "@filters": path.resolve(__vite_injected_original_dirname, "../src/features/filters"),
        "@preferences": path.resolve(__vite_injected_original_dirname, "../src/features/preferences"),
        "@assets": path.resolve(__vite_injected_original_dirname, "../src/assets"),
        "@test": path.resolve(__vite_injected_original_dirname, "../src/shared/test"),
        "@features": path.resolve(__vite_injected_original_dirname, "../src/features")
      }
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "../src/shared/test/setup.ts"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29uZmlnL3ZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcRG9jdW1lbnRvc1xcXFxTYW50aWFnb1xcXFxQb3J0YWZvbGlvXFxcXFByb3llY3Rvc1xcXFxQcm9ncmFtYWNpb24gYmFzaWNhXFxcXGNVUGlkb1xcXFxjdXBpZG8tZnJvbnRlbmRcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEb2N1bWVudG9zXFxcXFNhbnRpYWdvXFxcXFBvcnRhZm9saW9cXFxcUHJveWVjdG9zXFxcXFByb2dyYW1hY2lvbiBiYXNpY2FcXFxcY1VQaWRvXFxcXGN1cGlkby1mcm9udGVuZFxcXFxjb25maWdcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0RvY3VtZW50b3MvU2FudGlhZ28vUG9ydGFmb2xpby9Qcm95ZWN0b3MvUHJvZ3JhbWFjaW9uJTIwYmFzaWNhL2NVUGlkby9jdXBpZG8tZnJvbnRlbmQvY29uZmlnL3ZpdGUuY29uZmlnLnRzXCI7Ly8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XHJcbi8vWWEgc2UgZXN0YWJsZWNlbiBsb3MgdHlwZXMgZW4gbG9zIHRzY29uZmlnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGlzRGV2ID0gbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiO1xyXG4gIHJldHVybiB7XHJcbiAgICAvL2VzYnVpbGQ6IHsgdHNjb25maWdSYXc6IHJlcXVpcmUoXCIuL3RzY29uZmlnL3RzY29uZmlnLmpzb25cIikgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiBpc0RldiA/IFwiOjpcIiA6IFwiMTI3LjAuMC4xXCIsXHJcbiAgICAgIHBvcnQ6IDgwODAsXHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICAgIHRhcmdldDogcHJvY2Vzcy5lbnYuVklURV9BUElfQkFTRV9VUkwsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICBzZWN1cmU6ICFpc0RldixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBpc0RldiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gICAgZW52RGlyOiAnLi9jb25maWcvZW52JyxcclxuICAgIHJvb3Q6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi5cIiksXHJcbiAgICBjc3M6IHtcclxuICAgICAgcG9zdGNzczogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3Bvc3Rjc3MuY29uZmlnLmNqc1wiKSxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vc3JjXCIpLFxyXG4gICAgICAgIFwiQHVpXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vc3JjL3NoYXJlZC9jb21wb25lbnRzL3VpXCIpLFxyXG4gICAgICAgIFwiQHN0b3JlXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vc3JjL3NoYXJlZC9zdG9yZVwiKSxcclxuICAgICAgICBcIkBob29rc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL3NyYy9zaGFyZWQvaG9va3NcIiksXHJcbiAgICAgICAgXCJAbGliXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vc3JjL3NoYXJlZC9saWJcIiksXHJcbiAgICAgICAgXCJAdHlwZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9zcmMvc2hhcmVkL3R5cGVzXCIpLFxyXG4gICAgICAgIFwiQGhvbWVcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9zcmMvZmVhdHVyZXMvaG9tZVwiKSxcclxuICAgICAgICBcIkBwYWdlc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL3NyYy9zaGFyZWQvcGFnZXNcIiksXHJcbiAgICAgICAgXCJAcHJvZmlsZVwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL3NyYy9mZWF0dXJlcy9wcm9maWxlXCIpLFxyXG4gICAgICAgIFwiQGZpbHRlcnNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9zcmMvZmVhdHVyZXMvZmlsdGVyc1wiKSxcclxuICAgICAgICBcIkBwcmVmZXJlbmNlc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL3NyYy9mZWF0dXJlcy9wcmVmZXJlbmNlc1wiKSxcclxuICAgICAgICBcIkBhc3NldHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9zcmMvYXNzZXRzXCIpLFxyXG4gICAgICAgIFwiQHRlc3RcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9zcmMvc2hhcmVkL3Rlc3RcIiksXHJcbiAgICAgICAgXCJAZmVhdHVyZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9zcmMvZmVhdHVyZXNcIilcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB0ZXN0OiB7XHJcbiAgICAgIGdsb2JhbHM6IHRydWUsXHJcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgICBzZXR1cEZpbGVzOiAnLi4vc3JjL3NoYXJlZC90ZXN0L3NldHVwLnRzJyxcclxuICAgIH0sXHJcbiAgfTtcclxufSk7XHJcblxyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFMaEMsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxRQUFRLFNBQVM7QUFDdkIsU0FBTztBQUFBO0FBQUEsSUFFTCxRQUFRO0FBQUEsTUFDTixNQUFNLFFBQVEsT0FBTztBQUFBLE1BQ3JCLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVEsUUFBUSxJQUFJO0FBQUEsVUFDcEIsY0FBYztBQUFBLFVBQ2QsUUFBUSxDQUFDO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUM3RCxRQUFRO0FBQUEsSUFDUixNQUFNLEtBQUssUUFBUSxrQ0FBVyxJQUFJO0FBQUEsSUFDbEMsS0FBSztBQUFBLE1BQ0gsU0FBUyxLQUFLLFFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsSUFDekQ7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLFFBQVE7QUFBQSxRQUNyQyxPQUFPLEtBQUssUUFBUSxrQ0FBVyw2QkFBNkI7QUFBQSxRQUM1RCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxRQUN2RCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxRQUN2RCxRQUFRLEtBQUssUUFBUSxrQ0FBVyxtQkFBbUI7QUFBQSxRQUNuRCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxRQUN2RCxTQUFTLEtBQUssUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxRQUN2RCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxRQUN2RCxZQUFZLEtBQUssUUFBUSxrQ0FBVyx5QkFBeUI7QUFBQSxRQUM3RCxZQUFZLEtBQUssUUFBUSxrQ0FBVyx5QkFBeUI7QUFBQSxRQUM3RCxnQkFBZ0IsS0FBSyxRQUFRLGtDQUFXLDZCQUE2QjtBQUFBLFFBQ3JFLFdBQVcsS0FBSyxRQUFRLGtDQUFXLGVBQWU7QUFBQSxRQUNsRCxTQUFTLEtBQUssUUFBUSxrQ0FBVyxvQkFBb0I7QUFBQSxRQUNyRCxhQUFhLEtBQUssUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxNQUN4RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxNQUNiLFlBQVk7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
