import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, perfectionist },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
    rules: {
      "perfectionist/sort-imports": [
        "warn",
        {
          type: "line-length",
          order: "desc",
        },
      ],
      "perfectionist/sort-named-imports": [
        "warn",
        {
          type: "line-length",
          order: "desc",
        },
      ],
    },
  },
  {
    ignores: ["jest.config.ts", "dist"],
  },
  tseslint.configs.recommended,
]);
