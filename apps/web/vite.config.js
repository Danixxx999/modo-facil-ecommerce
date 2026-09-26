import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const src = (file) => path.resolve(__dirname, "./src", file);

export default defineConfig({
  plugins: [react()],
  server: { host: "0.0.0.0", port: 3000 },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
    alias: [
      { find: "@/contexts/AuthContext.jsx", replacement: src("contexts/AppSession.jsx") },
      { find: "@/services/whatsappService.js", replacement: src("services/orderMessaging.js") },
      { find: "@/hooks/useSettings.js", replacement: src("hooks/useStoreSettings.js") },
      { find: "@/pages/CartPage.jsx", replacement: src("pages/ShoppingCartPage.jsx") },
      { find: "@/pages/LoginPage.jsx", replacement: src("pages/AdminSignInPage.jsx") },
      { find: "@/pages/admin/AdminProductsPage.jsx", replacement: src("components/AdminCatalogPlaceholder.jsx") },
      { find: "@/pages/admin/AdminCategoriesPage.jsx", replacement: src("components/AdminCatalogPlaceholder.jsx") },
      { find: "@/pages/admin/AdminCombosPage.jsx", replacement: src("components/AdminCatalogPlaceholder.jsx") },
      { find: "@/pages/admin/AboutUsSettingsPanel.jsx", replacement: src("pages/admin/StoreSettingsPanel.jsx") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});
