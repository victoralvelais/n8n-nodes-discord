import path from "node:path"
import { fileURLToPath } from "node:url"

import { includeIgnoreFile } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import n8nNodesBase from "eslint-plugin-n8n-nodes-base"
import prettier from "eslint-plugin-prettier"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  includeIgnoreFile(gitignorePath),
  {
    // your overrides
  },
  
  {
    ignores: [
      "**/.gitignore",
      "**/.eslintignore",
      "**/node_modules",
      "**/.DS_Store",
      "**/dist",
      "**/dist-ssr",
      "**/*.local",
      "**/lib",
      "**/tsconfig.json",
    ],
  },

  {
    files: ["**/*.ts", "**/*.tsx"]

    // any additional configuration for these file types here
  },

  ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "simple-import-sort": simpleImportSort,
      prettier,
      "n8n-nodes-base": n8nNodesBase,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",
    },

    settings: {
      "import/resolver": {
        node: {
          paths: ["'src'"],
          extensions: [".js", ".ts"],
        },
      },
    },

    rules: {
      "prettier/prettier": [
        "error",
        {},
        {
          usePrettierrc: true,
        },
      ],

      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "n8n-nodes-base/node-param-array-type-assertion": "warn",
      "n8n-nodes-base/node-param-default-wrong-for-collection": "error",
    },
},
]
