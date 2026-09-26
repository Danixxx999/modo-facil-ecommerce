import React from "react";
import { Route, Routes, BrowserRouter as Router, Navigate, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner.jsx";
import { Button } from "@/components/ui/button.jsx";
import ScrollToTop from "@/components/ScrollToTop.jsx";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { CartProvider } from "@/contexts/CartContext.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AdminLayout from "@/components/AdminLayout.jsx";

// Public Pages
import HomePage from "@/pages/HomePage.jsx";
import StorePage from "@/pages/StorePage.jsx";
import ProductPage from "@/pages/ProductPage.jsx";
import CategoryPage from "@/pages/CategoryPage.jsx";
import CartPage from "@/pages/CartPage.jsx";
import CheckoutPage from "@/pages/CheckoutPage.jsx";
import OrderTrackingPage from "@/pages/OrderTrackingPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import AboutPage from "@/pages/AboutPage.jsx";

// Admin Pages
import AdminDashboard from "@/pages/admin/DashboardPage.jsx";
import AdminProductsPage from "@/pages/admin/AdminProductsPage.jsx";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage.jsx";
import AdminCombosPage from "@/pages/admin/AdminCombosPage.jsx";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage.jsx";
import AdminCustomersPage from "@/pages/admin/AdminCustomersPage.jsx";
import AdminReportsPage from "@/pages/admin/AdminReportsPage.jsx";
import AdminUsersPage from "@/pages/admin/AdminUsersPage.jsx";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage.jsx";

const AdminRoute = ({ children }) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

const AdminComingSoon = ({ title, description }) => {
  return (
    <AdminLayout>
      <div className="admin-card mx-auto max-w-2xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-3xl text-primary">
          ✨
        </div>

        <h1 className="font-display text-4xl font-black tracking-[-0.06em]">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-muted-foreground">
          {description ||
            "Esta sección ya está conectada en rutas. La podemos construir cuando sigamos puliendo el panel."}
        </p>

        <Button asChild className="mf-btn mf-btn-primary mt-6">
          <Link to="/admin">Volver al dashboard</Link>
        </Button>
      </div>
    </AdminLayout>
  );
};

const NotFoundPage = () => {
  return (
    <main className="mf-page">
      <div className="mf-container flex min-h-screen items-center justify-center py-16">
        <div className="mf-card max-w-xl p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-3xl text-primary">
            🛒
          </div>

          <h1 className="font-display text-5xl font-black tracking-[-0.07em]">
            Página no encontrada
          </h1>

          <p className="mt-3 font-semibold leading-7 text-muted-foreground">
            Parece que esta ruta no existe o fue movida. Puedes volver a la
            tienda y seguir explorando.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="mf-btn mf-btn-primary">
              <Link to="/store">Ver tienda</Link>
            </Button>

            <Button asChild variant="outline" className="mf-btn">
              <Link to="/">Ir al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/about" element={<AboutPage />} />

            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Tracking aliases */}
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/rastrear-pedido" element={<OrderTrackingPage />} />

            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProductsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategoriesPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/combos"
              element={
                <AdminRoute>
                  <AdminCombosPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrdersPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <AdminCustomersPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <AdminReportsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettingsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/testimonials"
              element={
                <AdminRoute>
                  <AdminComingSoon
                    title="Testimonios"
                    description="Aquí podremos crear, editar y activar testimonios para mostrarlos en el home."
                  />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/faq"
              element={
                <AdminRoute>
                  <AdminComingSoon
                    title="Preguntas frecuentes"
                    description="Aquí podremos administrar preguntas y respuestas para resolver dudas antes de comprar."
                  />
                </AdminRoute>
              }
            />

            {/* Optional redirects */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/shop" element={<Navigate to="/store" replace />} />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Toaster position="top-center" richColors />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
