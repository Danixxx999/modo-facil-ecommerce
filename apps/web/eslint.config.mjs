import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const aliasMap = [
  ["@/contexts/AuthContext.jsx", "./src/contexts/AppSession.jsx"],
  ["@/services/whatsappService.js", "./src/services/orderMessaging.js"],
  ["@/services/whatsappService", "./src/services/orderMessaging.js"],
  ["@/hooks/useSettings.js", "./src/hooks/useStoreSettings.js"],
  ["@/hooks/useSettings", "./src/hooks/useStoreSettings.js"],
  ["@/pages/CartPage.jsx", "./src/pages/ShoppingCartPage.jsx"],
  ["@/pages/LoginPage.jsx", "./src/pages/AdminSignInPage.jsx"],
  ["@/pages/admin/AdminProductsPage.jsx", "./src/components/AdminCatalogPlaceholder.jsx"],
  ["@/pages/admin/AdminCategoriesPage.jsx", "./src/components/AdminCatalogPlaceholder.jsx"],
  ["@/pages/admin/AdminCombosPage.jsx", "./src/components/AdminCatalogPlaceholder.jsx"],
  ["@/pages/admin/AboutUsSettingsPanel.jsx", "./src/pages/admin/StoreSettingsPanel.jsx"],
  ["@", "./src"],
];

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
        alias: { map: aliasMap, extensions: [".js", ".jsx"] },
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
