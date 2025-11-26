import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import path from "path";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    settings: {
      "import/resolver": {
        alias: {
          map: [
            ["@", path.resolve(__dirname, "src")],
            ["@ui", path.resolve(__dirname, "src/shared/components/ui")],
            ["@store", path.resolve(__dirname, "src/shared/store")],
            ["@hooks", path.resolve(__dirname, "src/shared/hooks")],
            ["@lib", path.resolve(__dirname, "src/shared/lib")],
            ["@types", path.resolve(__dirname, "src/shared/types")],
            ["@home", path.resolve(__dirname, "src/features/home")],
            ["@pages", path.resolve(__dirname, "src/pages")],
            ["@profile", path.resolve(__dirname, "src/features/profile")],
            ["@filters", path.resolve(__dirname, "src/features/filters")],
            ["@preferences", path.resolve(__dirname, "src/features/preferences")],
            ["@assets", path.resolve(__dirname, "src/assets")],
            ["@test", path.resolve(__dirname, "src/shared/test")],
            ["@features", path.resolve(__dirname, "src/features")],
            ["@components", path.resolve(__dirname, "src/shared/components")]
          ],
          extensions: [".ts", ".tsx", ".js", ".jsx"]
        }
      }
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.strict,
    ],
    files: ["**/*.{ts,tsx,js jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
);


