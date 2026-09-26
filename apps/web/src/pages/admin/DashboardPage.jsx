import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  Banknote,
  CreditCard,
  AlertTriangle,
  Store,
  BadgePercent,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import AdminLayout from "@/components/AdminLayout.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useOrders } from "@/hooks/useOrders.js";
import { useProducts } from "@/hooks/useProducts.js";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const formatDate = (value) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

const DashboardPage = () => {
  const { orders = [] } = useOrders();
  const { products = [] } = useProducts();

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const stats = useMemo(() => {
    const today = getTodayString();

    const todayOrders = safeOrders.filter((order) =>
      order.created?.startsWith(today)
    );

    const deliveredOrders = safeOrders.filter(
      (order) => order.status === "Entregado"
    );

    const newOrders = safeOrders.filter((order) => order.status === "Nuevo");

    const confirmedOrders = safeOrders.filter(
      (order) => order.status === "Confirmado"
    );

    const preparingOrders = safeOrders.filter(
      (order) => order.status === "En preparación"
    );

    const dispatchedOrders = safeOrders.filter(
      (order) => order.status === "Despachado"
    );

    const cancelledOrders = safeOrders.filter(
      (order) => order.status === "Cancelado"
    );

    const codOrders = safeOrders.filter(
      (order) => order.paymentMethod === "Pago contra entrega"
    );

    const prepaidOrders = safeOrders.filter(
      (order) => order.paymentMethod === "Pago anticipado"
    );

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const activeProducts = safeProducts.filter((product) => product.active);

    const lowStockProducts = safeProducts.filter(
      (product) =>
        Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
    );

    const operationOrders =
      newOrders.length +
      confirmedOrders.length +
      preparingOrders.length +
      dispatchedOrders.length;

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      totalRevenue,
      totalOrders: safeOrders.length,
      newOrders: newOrders.length,
      deliveredOrders: deliveredOrders.length,
      dispatchedOrders: dispatchedOrders.length,
      cancelledOrders: cancelledOrders.length,
      codOrders: codOrders.length,
      prepaidOrders: prepaidOrders.length,
      operationOrders,
      activeProducts: activeProducts.length,
      lowStockProducts: lowStockProducts.length,
      totalProducts: safeProducts.length,
    };
  }, [safeOrders, safeProducts]);

  const recentOrders = useMemo(() => {
    return safeOrders.slice(0, 6);
  }, [safeOrders]);

  const statusRows = useMemo(() => {
    const total = safeOrders.length || 1;

    return [
      {
        label: "Nuevos",
        value: stats.newOrders,
        icon: Clock3,
        bar: "bg-blue-500",
      },
      {
        label: "Despachados",
        value: stats.dispatchedOrders,
        icon: Truck,
        bar: "bg-purple-500",
      },
      {
        label: "Entregados",
        value: stats.deliveredOrders,
        icon: CheckCircle2,
        bar: "bg-green-500",
      },
      {
        label: "Cancelados",
        value: stats.cancelledOrders,
        icon: XCircle,
        bar: "bg-red-500",
      },
    ].map((item) => ({
      ...item,
      percent: Math.round((item.value / total) * 100),
    }));
  }, [safeOrders.length, stats]);

  const StatCard = ({ title, value, subtitle, icon: Icon, tone = "primary" }) => {
    const toneClass = {
      primary: "bg-primary-soft text-primary",
      secondary: "bg-secondary-soft text-secondary-deep",
      accent: "bg-accent/20 text-accent-foreground",
      danger: "bg-destructive/10 text-destructive",
      neutral: "bg-muted text-foreground",
    }[tone];

    return (
      <div className="admin-card group relative overflow-hidden p-5">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
              {title}
            </p>

            <h3 className="mt-2 font-display text-3xl font-black tracking-[-0.055em] text-foreground">
              {value}
            </h3>

            {subtitle && (
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}
          >
            <Icon className="h-6 w-6" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin - Dashboard - Modo Fácil</title>
      </Helmet>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary">
            <Sparkles className="h-4 w-4" />
            Centro de control
          </div>

          <h1 className="font-display text-4xl font-black tracking-[-0.06em] text-foreground">
            Dashboard
          </h1>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Mira pedidos, ventas, productos, pagos y alertas rápidas de tu tienda.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/store" target="_blank">
              <Store className="mr-2 h-4 w-4" />
              Ver tienda
            </Link>
          </Button>

          <Button asChild className="mf-btn mf-btn-primary rounded-full">
            <Link to="/admin/orders">
              Ver pedidos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pedidos hoy"
          value={stats.todayOrders}
          subtitle={`${formatCurrency(stats.todayRevenue)} en pedidos de hoy`}
          icon={ShoppingCart}
          tone="primary"
        />

        <StatCard
          title="Ingresos entregados"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Solo pedidos marcados como entregados"
          icon={TrendingUp}
          tone="secondary"
        />

        <StatCard
          title="Productos activos"
          value={stats.activeProducts}
          subtitle={`${stats.totalProducts} productos en total`}
          icon={Package}
          tone="accent"
        />

        <StatCard
          title="En operación"
          value={stats.operationOrders}
          subtitle="Nuevos, confirmados, preparación o despacho"
          icon={Truck}
          tone="neutral"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pedidos nuevos"
          value={stats.newOrders}
          subtitle="Pendientes por confirmar"
          icon={Clock3}
          tone="primary"
        />

        <StatCard
          title="Contra entrega"
          value={stats.codOrders}
          subtitle={`${stats.prepaidOrders} con pago anticipado`}
          icon={Banknote}
          tone="primary"
        />

        <StatCard
          title="Entregados"
          value={stats.deliveredOrders}
          subtitle="Ventas finalizadas"
          icon={CheckCircle2}
          tone="secondary"
        />

        <StatCard
          title="Stock bajo"
          value={stats.lowStockProducts}
          subtitle="Productos con 5 unidades o menos"
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="admin-card p-5 xl:col-span-2">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
                Pedidos recientes
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                Últimos movimientos de la tienda.
              </p>
            </div>

            <Button
              asChild
              variant="link"
              className="h-auto w-fit p-0 font-black text-primary"
            >
              <Link to="/admin/orders">
                Ver todos
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center text-muted-foreground">
              <ShoppingCart className="mb-3 h-10 w-10 opacity-30" />
              <p className="font-semibold">No hay pedidos aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const isPrepaid = order.paymentMethod === "Pago anticipado";

                return (
                  <Link
                    key={order.id}
                    to="/admin/orders"
                    className="block rounded-2xl border border-border/65 bg-muted/25 p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                          <ShoppingCart className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-black text-foreground">
                            #{order.orderNumber} ·{" "}
                            {order.customerName || "Cliente sin nombre"}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {formatDate(order.created)} · {order.city || "Sin ciudad"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-black",
                            isPrepaid
                              ? "bg-secondary-soft text-secondary-deep"
                              : "bg-primary-soft text-primary",
                          ].join(" ")}
                        >
                          {isPrepaid ? (
                            <>
                              <CreditCard className="mr-1 h-3.5 w-3.5" />
                              Anticipado
                            </>
                          ) : (
                            <>
                              <Banknote className="mr-1 h-3.5 w-3.5" />
                              Contra entrega
                            </>
                          )}
                        </span>

                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-black text-muted-foreground">
                          {order.status || "Nuevo"}
                        </span>

                        <span className="font-black text-primary">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-card p-5">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
              Estado de pedidos
            </h2>
            <p className="text-sm font-semibold text-muted-foreground">
              Así está la operación general.
            </p>
          </div>

          <div className="space-y-5">
            {statusRows.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-black">
                      <Icon className="h-4 w-4 text-primary" />
                      {item.label}
                    </span>

                    <span className="text-sm font-black text-muted-foreground">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.bar}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-primary-soft/60 p-4">
            <div className="mb-2 flex items-center gap-2 font-black text-primary">
              <BadgePercent className="h-5 w-5" />
              Tip de operación
            </div>

            <p className="text-sm font-semibold leading-6 text-muted-foreground">
              Antes de correr anuncios fuerte, revisa que los productos ganadores
              tengan stock, precio correcto y paquetes listos.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            title: "Gestionar pedidos",
            text: "Confirmar, despachar y controlar estados",
            icon: ShoppingCart,
            to: "/admin/orders",
          },
          {
            title: "Crear productos",
            text: "Subir nuevos productos ganadores",
            icon: Package,
            to: "/admin/products",
          },
          {
            title: "Armar combos",
            text: "Crear ofertas para subir ticket promedio",
            icon: BadgePercent,
            to: "/admin/combos",
          },
          {
            title: "Ver clientes",
            text: "Revisar compradores y contactos",
            icon: Users,
            to: "/admin/customers",
          },
        ].map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.title}
              asChild
              variant="outline"
              className="h-auto justify-start rounded-2xl p-4 text-left"
            >
              <Link to={action.to}>
                <span className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </span>

                <span>
                  <span className="block font-black">{action.title}</span>
                  <span className="block text-xs font-semibold text-muted-foreground">
                    {action.text}
                  </span>
                </span>
              </Link>
            </Button>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
