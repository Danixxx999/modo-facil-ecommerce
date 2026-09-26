import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "dist/**", "build/**", "vite.config.js"] },
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: { react, "react-hooks": reactHooks, import: importPlugin },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, React: "readonly", Intl: "readonly" },
    },
    settings: {
      react: { version: "detect" },
      "import/extensions": [".js", ".jsx"],
      "import/resolver": {
        node: { extensions: [".js", ".jsx"] },
        alias: { map: [["@", "./src"]], extensions: [".js", ".jsx"] },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "off",
      "react/jsx-no-comment-textnodes": "off",
      "no-unused-vars": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-cycle": "off",
      "no-undef": "error",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "import/no-self-import": "error",
    },
  },
  {
    files: ["tailwind.config.js"],
    languageOptions: { globals: globals.node },
  },
];
