import tseslint from "typescript-eslint";

/**
 * Native flat config via typescript-eslint. Avoids the eslint-config-next /
 * FlatCompat circular-reference bug under ESLint 9, and still enforces the
 * rule that matters most here: no `any`. Type safety proper comes from
 * `tsc --noEmit` (npm run typecheck); this catches style/quality issues.
 */
export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "**/*.config.mjs",
      "**/*.config.ts",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
