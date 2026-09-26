import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  TrendingUp,
  Clock,
  AlertCircle,
  PackageCheck,
  Truck,
  Banknote,
  Boxes,
  RefreshCw,
  BadgePercent,
  CheckCircle2,
  Sparkles,
  Store,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import AdminLayout from "@/components/AdminLayout.jsx";
import pb from "@/lib/pocketbaseClient.js";
import { getTiersArray } from "@/hooks/useProductPricing.js";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const formatDate = (value) => {
  try {
    if (!value) return "-";
    return format(parseISO(value), "dd MMM · h:mm a", { locale: es });
  } catch {
    return "-";
  }
};

const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [partialErrors, setPartialErrors] = useState([]);
  const [criticalError, setCriticalError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setCriticalError(null);
      setPartialErrors([]);

      const results = await Promise.allSettled([
        pb.collection("orders").getFullList({
          sort: "-created",
          expand: "products,combos",
          $autoCancel: false,
        }),
        pb.collection("products").getFullList({
          sort: "-created",
          $autoCancel: false,
        }),
        pb.collection("clients").getFullList({
          sort: "-created",
          $autoCancel: false,
        }),
      ]);

      const nextErrors = [];

      const ordersData =
        results[0].status === "fulfilled" ? results[0].value : [];
      const productsData =
        results[1].status === "fulfilled" ? results[1].value : [];
      const clientsData =
        results[2].status === "fulfilled" ? results[2].value : [];

      if (results[0].status === "rejected") {
        console.error("Error cargando pedidos:", results[0].reason);
        nextErrors.push("No se pudieron cargar los pedidos.");
      }

      if (results[1].status === "rejected") {
        console.error("Error cargando productos:", results[1].reason);
        nextErrors.push("No se pudieron cargar los productos.");
      }

      if (results[2].status === "rejected") {
        console.error("Error cargando clientes:", results[2].reason);
        nextErrors.push("No se pudieron cargar los clientes.");
      }

      setOrders(ordersData);
      setProducts(productsData);
      setClients(clientsData);
      setPartialErrors(nextErrors);

      const deliveredOrders = ordersData.filter(
        (order) => order.status === "Entregado"
      );

      const chartData = [];

      for (let index = 6; index >= 0; index -= 1) {
        const day = subDays(new Date(), index);
        const dateString = day.toISOString().split("T")[0];

        const dayOrders = deliveredOrders.filter((order) =>
          order.created?.startsWith(dateString)
        );

        const dayTotal = dayOrders.reduce(
          (sum, order) => sum + Number(order.total || 0),
          0
        );

        chartData.push({
          name: format(day, "EEE", { locale: es }),
          total: dayTotal,
          pedidos: dayOrders.length,
        });
      }

      setSalesData(chartData);
    } catch (error) {
      console.error("Error crítico dashboard:", error);
      setCriticalError(
        "No se pudo cargar la información del dashboard. Verifica conexión, permisos o colecciones de PocketBase."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const todayString = getTodayString();

    const todayOrders = orders.filter((order) =>
      order.created?.startsWith(todayString)
    );

    const deliveredOrders = orders.filter(
      (order) => order.status === "Entregado"
    );

    const newOrders = orders.filter((order) => order.status === "Nuevo");
    const confirmedOrders = orders.filter(
      (order) => order.status === "Confirmado"
    );
    const preparingOrders = orders.filter(
      (order) => order.status === "En preparación"
    );
    const shippedOrders = orders.filter(
      (order) => order.status === "Despachado"
    );

    const codOrders = orders.filter(
      (order) => order.paymentMethod === "Pago contra entrega"
    );

    const prepaidOrders = orders.filter(
      (order) => order.paymentMethod === "Pago anticipado"
    );

    const revenue = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const activeProducts = products.filter((product) => product.active);
    const lowStockProducts = products.filter(
      (product) =>
        Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
    );

    const productsWithPackages = products.filter(
      (product) => getTiersArray(product).length > 1
    );

    const operationalOrders =
      newOrders.length +
      confirmedOrders.length +
      preparingOrders.length +
      shippedOrders.length;

    return {
      revenue,
      todayRevenue,
      todayOrders: todayOrders.length,
      totalOrders: orders.length,
      newOrders: newOrders.length,
      deliveredOrders: deliveredOrders.length,
      operationalOrders,
      codOrders: codOrders.length,
      prepaidOrders: prepaidOrders.length,
      activeProducts: activeProducts.length,
      lowStockProducts: lowStockProducts.length,
      productsWithPackages: productsWithPackages.length,
      clients: clients.length,
    };
  }, [orders, products, clients]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 6);
  }, [orders]);

  const statusRows = useMemo(() => {
    const total = orders.length || 1;

    return [
      {
        label: "Nuevos",
        value: orders.filter((order) => order.status === "Nuevo").length,
        className: "bg-blue-500",
      },
      {
        label: "Confirmados",
        value: orders.filter((order) => order.status === "Confirmado").length,
        className: "bg-indigo-500",
      },
      {
        label: "En preparación",
        value: orders.filter((order) => order.status === "En preparación")
          .length,
        className: "bg-yellow-500",
      },
      {
        label: "Despachados",
        value: orders.filter((order) => order.status === "Despachado").length,
        className: "bg-purple-500",
      },
      {
        label: "Entregados",
        value: orders.filter((order) => order.status === "Entregado").length,
        className: "bg-green-500",
      },
      {
        label: "Cancelados",
        value: orders.filter((order) => order.status === "Cancelado").length,
        className: "bg-red-500",
      },
    ].map((item) => ({
      ...item,
      percent: Math.round((item.value / total) * 100),
    }));
  }, [orders]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    subtitle,
    tone = "primary",
  }) => {
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

            {loading ? (
              <Skeleton className="mt-3 h-8 w-28" />
            ) : (
              <h3 className="mt-2 font-display text-3xl font-black tracking-[-0.055em] text-foreground">
                {value}
              </h3>
            )}

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

  if (criticalError) {
  return (
    <AdminLayout>
      <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-5 text-destructive">
        <div className="mb-2 flex items-center gap-2 font-black">
          <AlertCircle className="h-5 w-5" />
          Error
        </div>
        <p className="text-sm font-semibold">{criticalError}</p>
      </div>
    </AdminLayout>
  );
}

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard | Admin Modo Fácil</title>
      </Helmet>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary">
            <Sparkles className="h-4 w-4" />
            Centro de control
          </div>

          <h1 className="font-display text-4xl font-black tracking-[-0.06em] text-foreground">
            Resumen general
          </h1>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Mira ventas, pedidos, productos, clientes y alertas rápidas de tu
            tienda.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            className="rounded-full"
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>

          <Button asChild className="mf-btn mf-btn-primary rounded-full">
            <Link to="/admin/orders">
              Ver pedidos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {partialErrors.length > 0 && (
  <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-300">
    <div className="mb-2 flex items-center gap-2 font-black">
      <AlertCircle className="h-5 w-5" />
      Dashboard cargado parcialmente
    </div>
    <p className="text-sm font-semibold">{partialErrors.join(" ")}</p>
  </div>
)}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ingresos entregados"
          value={formatCurrency(stats.revenue)}
          subtitle="Solo pedidos entregados"
          icon={CreditCard}
          tone="secondary"
        />

        <StatCard
          title="Pedidos hoy"
          value={stats.todayOrders}
          subtitle={`${formatCurrency(stats.todayRevenue)} en pedidos de hoy`}
          icon={ShoppingCart}
          tone="primary"
        />

        <StatCard
          title="Productos activos"
          value={stats.activeProducts}
          subtitle={`${stats.productsWithPackages} con paquetes`}
          icon={Package}
          tone="accent"
        />

        <StatCard
          title="Clientes"
          value={stats.clients}
          subtitle="Registros actuales"
          icon={Users}
          tone="neutral"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pedidos nuevos"
          value={stats.newOrders}
          subtitle="Pendientes de confirmar"
          icon={Clock}
          tone="primary"
        />

        <StatCard
          title="En operación"
          value={stats.operationalOrders}
          subtitle="Nuevo, confirmado, preparación o despacho"
          icon={Truck}
          tone="accent"
        />

        <StatCard
          title="Contra entrega"
          value={stats.codOrders}
          subtitle={`${stats.prepaidOrders} anticipados`}
          icon={Banknote}
          tone="primary"
        />

        <StatCard
          title="Stock bajo"
          value={stats.lowStockProducts}
          subtitle="Productos con 5 unidades o menos"
          icon={AlertCircle}
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <div className="admin-card p-5 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
                Ventas últimos 7 días
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                Basado en pedidos entregados.
              </p>
            </div>

            <div className="rounded-full bg-secondary-soft px-3 py-1.5 text-xs font-black text-secondary-deep">
              Entregados
            </div>
          </div>

          <div className="h-[320px] w-full">
            {loading ? (
              <Skeleton className="h-full w-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--admin-border))"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--admin-card))",
                      borderRadius: "16px",
                      border: "1px solid hsl(var(--admin-border))",
                      boxShadow: "0 16px 40px rgb(15 23 42 / 0.14)",
                    }}
                    formatter={(value, name) => {
                      if (name === "total") {
                        return [formatCurrency(value), "Ventas"];
                      }

                      return [value, "Pedidos"];
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.15)"
                    strokeWidth={3}
                  />

                  <Line
                    type="monotone"
                    dataKey="pedidos"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="admin-card p-5">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
                Pedidos recientes
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                Últimos movimientos.
              </p>
            </div>

            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 font-black text-primary"
              asChild
            >
              <Link to="/admin/orders">
                Ver todos
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-2xl" />
              ))
            ) : recentOrders.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center text-muted-foreground">
                <Package className="mb-3 h-10 w-10 opacity-30" />
                <p className="font-semibold">No hay pedidos recientes</p>
              </div>
            ) : (
              recentOrders.map((order) => {
                const isPrepaid = order.paymentMethod === "Pago anticipado";

                return (
                  <Link
                    key={order.id}
                    to="/admin/orders"
                    className="block rounded-2xl border border-border/65 bg-muted/25 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                          <ShoppingCart className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">
                            #{order.orderNumber} · {order.customerName}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(order.created)}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-black text-primary">
                          {formatCurrency(order.total)}
                        </p>

                        <span
                          className={[
                            "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black",
                            isPrepaid
                              ? "bg-secondary-soft text-secondary-deep"
                              : "bg-primary-soft text-primary",
                          ].join(" ")}
                        >
                          {isPrepaid ? "Anticipado" : "Contra entrega"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status */}
        <div className="admin-card p-5">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <PackageCheck className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
                Estado de pedidos
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                Distribución general de la operación.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-xl" />
              ))
            ) : (
              statusRows.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-black">{item.label}</span>
                    <span className="font-black text-muted-foreground">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.className}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="admin-card p-5">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-soft text-secondary-deep">
              <Store className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
                Acciones rápidas
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                Atajos para operar la tienda.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Ver pedidos",
                text: "Gestiona ventas y estados",
                icon: ShoppingCart,
                to: "/admin/orders",
              },
              {
                title: "Crear producto",
                text: "Agrega nuevos ganadores",
                icon: Package,
                to: "/admin/products",
              },
              {
                title: "Gestionar combos",
                text: "Arma ofertas con ahorro",
                icon: BadgePercent,
                to: "/admin/combos",
              },
              {
                title: "Ver tienda",
                text: "Revisa experiencia cliente",
                icon: Store,
                to: "/store",
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

          {stats.lowStockProducts > 0 && (
            <div className="mt-4 rounded-2xl border border-destructive/15 bg-destructive/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <p className="font-black text-destructive">
                    Ojo con el inventario
                  </p>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    Tienes {stats.lowStockProducts} producto(s) con stock bajo.
                    Revísalos antes de seguir corriendo anuncios.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
