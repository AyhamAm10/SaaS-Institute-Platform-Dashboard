import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Design-system guards for page code (src/app).
 * Pages compose controllers from src/components/controllers; colors, weights and
 * tab systems come from the theme, so a redesign stays a controller/theme change.
 */
const designSystemSyntax = [
  {
    selector: "Literal[value=/^#([0-9a-fA-F]{3}){1,2}$/]",
    message: "Hardcoded hex color. Use a theme token (var(--app-*)) or a controller tone instead.",
  },
  {
    selector: "JSXAttribute[name.name='fw'] > JSXExpressionContainer > Literal[value>600]",
    message: "Font weights above 600 are not part of the design system (use 300 / 400 / 500 / 600).",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...designSystemSyntax],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@mantine/core",
              importNames: ["Tabs"],
              message: "Use AppTabs from @/src/components/controllers/tabs.",
            },
          ],
        },
      ],
    },
  },
  {
    // Migration backlog: prefer the design-system controllers over raw Mantine primitives.
    files: ["src/app/**/*.{ts,tsx}"],
    // Separate rule name so it does not override the error-level Tabs restriction above.
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "warn",
        {
          paths: [
            {
              name: "@mantine/core",
              importNames: ["Button", "ActionIcon"],
              message: "Use AppButton / AppIconButton from @/src/components/controllers/button.",
            },
            {
              name: "@mantine/core",
              importNames: ["Badge"],
              message: "Use StatusBadge (tone=...) from @/src/components/controllers/badge.",
            },
            {
              name: "@mantine/core",
              importNames: ["SegmentedControl"],
              message: "Use AppTabs for tab switching (SegmentedControl is fine for form choices).",
            },
          ],
        },
      ],
    },
  },
  {
    // Institute white-label colors are tenant data (defaults for a color picker), not styling.
    files: ["src/app/(dashboard)/institutes/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
