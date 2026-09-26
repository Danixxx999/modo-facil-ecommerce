import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Banknote,
  Package,
  Layers,
  RefreshCw,
  BadgePercent,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { subDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

import AdminLayout from "@/components/AdminLayout.jsx";
import { Button } from "@/components/ui/button.jsx";
import pb from "@/lib/pocketbaseClient.js";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const downloadCSV = (filename, rows) => {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "").replaceAll('"', '""');
          return `"${value}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AdminReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchReports = async () => {
    setLoading(true);

    try {
      const records = await pb.collection("orders").getFullList({
        expand: "products,combos",
        sort: "-created",
        $autoCancel: false,
      });

      setOrders(Array.isArray(records) ? records : []);
    } catch (error) {
      console.error("Error cargando reportes:", error);
      toast.error("Error al cargar reportes");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const reportData = useMemo(() => {
    const deliveredOrders = orders.filter((order) => order.status === "Entregado");
    const activeOrders = orders.filter((order) => order.status !== "Cancelado");

    const revenue = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const activeRevenue = activeOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const averageTicket =
      deliveredOrders.length > 0 ? revenue / deliveredOrders.length : 0;

    const codOrders = orders.filter(
      (order) => order.paymentMethod === "Pago contra entrega"
    );

    const prepaidOrders = orders.filter(
      (order) => order.paymentMethod === "Pago anticipado"
    );

    const productCounts = {};
    const comboCounts = {};

    deliveredOrders.forEach((order) => {
      order.expand?.products?.forEach((product) => {
        productCounts[product.name] = (productCounts[product.name] || 0) + 1;
      });

      order.expand?.combos?.forEach((combo) => {
        comboCounts[combo.name] = (comboCounts[combo.name] || 0) + 1;
      });
    });

    const topProducts = Object.entries(productCounts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topCombos = Object.entries(comboCounts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const salesByDay = [];

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

      salesByDay.push({
        name: format(day, "EEE", { locale: es }),
        ventas: dayTotal,
        pedidos: dayOrders.length,
      });
    }

    return {
      totalOrders: orders.length,
      deliveredOrders: deliveredOrders.length,
      cancelledOrders: orders.filter((order) => order.status === "Cancelado").length,
      activeRevenue,
      revenue,
      averageTicket,
      codOrders: codOrders.length,
      prepaidOrders: prepaidOrders.length,
      topProducts,
      topCombos,
      salesByDay,
    };
  }, [orders]);

  const handleExport = () => {
    const rows = [
      [
        "Orden",
        "Cliente",
        "Telefono",
        "Ciudad",
        "Estado",
        "Metodo de pago",
        "Subtotal",
        "Envio",
        "Total",
        "Fecha",
      ],
      ...orders.map((order) => [
        order.orderNumber || "",
        order.customerName || "",
        order.customerPhone || "",
        order.city || "",
        order.status || "",
        order.paymentMethod || "",
        order.subtotal || 0,
        order.shippingCost || 0,
        order.total || 0,
        order.created || "",
      ]),
    ];

    downloadCSV("reporte-pedidos-modo-facil.csv", rows);
    toast.success("Reporte exportado");
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, tone = "primary" }) => {
    const toneClass = {
      primary: "bg-primary-soft text-primary",
      secondary: "bg-secondary-soft text-secondary-deep",
      neutral: "bg-muted text-foreground",
      danger: "bg-destructive/10 text-destructive",
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
              {loading ? "..." : value}
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
        <title>Reportes | Admin Modo Fácil</title>
      </Helmet>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary">
            <TrendingUp className="h-4 w-4" />
            Inteligencia del negocio
          </div>

          <h1 className="font-display text-4xl font-black tracking-[-0.06em] text-foreground">
            Reportes
          </h1>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Analiza ventas, pedidos, métodos de pago, productos y combos más
            vendidos.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={fetchReports}
            className="rounded-full"
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-full"
            disabled={loading || orders.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ventas entregadas"
          value={formatCurrency(reportData.revenue)}
          subtitle="Solo pedidos entregados"
          icon={TrendingUp}
          tone="secondary"
        />

        <StatCard
          title="Pedidos totales"
          value={reportData.totalOrders}
          subtitle={`${reportData.deliveredOrders} entregados`}
          icon={ShoppingCart}
          tone="primary"
        />

        <StatCard
          title="Ticket promedio"
          value={formatCurrency(reportData.averageTicket)}
          subtitle="Promedio de pedidos entregados"
          icon={BadgePercent}
          tone="primary"
        />

        <StatCard
          title="Ventas activas"
          value={formatCurrency(reportData.activeRevenue)}
          subtitle="Sin contar cancelados"
          icon={CreditCard}
          tone="neutral"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Pago anticipado"
          value={reportData.prepaidOrders}
          subtitle="Pedidos con envío gratis"
          icon={CreditCard}
          tone="secondary"
        />

        <StatCard
          title="Contra entrega"
          value={reportData.codOrders}
          subtitle="Pago al recibir"
          icon={Banknote}
          tone="primary"
        />

        <StatCard
          title="Cancelados"
          value={reportData.cancelledOrders}
          subtitle="Pedidos no efectivos"
          icon={CalendarDays}
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="admin-card p-5 xl:col-span-2">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
              Ventas últimos 7 días
            </h2>
            <p className="text-sm font-semibold text-muted-foreground">
              Basado únicamente en pedidos entregados.
            </p>
          </div>

          <div className="h-[320px]">
            {loading ? (
              <div className="h-full w-full animate-pulse rounded-2xl bg-muted" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={reportData.salesByDay}
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
                      if (name === "ventas") return [formatCurrency(value), "Ventas"];
                      return [value, "Pedidos"];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ventas"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.15)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
              Resumen operativo
            </h2>
            <p className="text-sm font-semibold text-muted-foreground">
              Lectura rápida para tomar decisiones.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-secondary-soft p-4 text-secondary-deep">
              <div className="mb-1 flex items-center gap-2 font-black">
                <Sparkles className="h-5 w-5" />
                Mejor foco
              </div>
              <p className="text-sm font-semibold leading-6">
                Revisa los productos más vendidos y crea combos alrededor de
                ellos para subir el ticket promedio.
              </p>
            </div>

            <div className="rounded-2xl bg-primary-soft p-4 text-primary">
              <div className="mb-1 flex items-center gap-2 font-black">
                <Banknote className="h-5 w-5" />
                Contra entrega
              </div>
              <p className="text-sm font-semibold leading-6">
                Si hay muchos pedidos contra entrega, confirma por WhatsApp antes
                de despachar para reducir devoluciones.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <div className="mb-6 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
              Top 10 productos vendidos
            </h2>
          </div>

          <div className="h-[330px]">
            {loading ? (
              <div className="h-full w-full animate-pulse rounded-2xl bg-muted" />
            ) : reportData.topProducts.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border text-center text-sm font-semibold text-muted-foreground">
                Aún no hay productos vendidos entregados.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.topProducts}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 40, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal
                    vertical={false}
                    stroke="hsl(var(--admin-border))"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    width={130}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--admin-border))",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 8, 8, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
              Top combos vendidos
            </h2>
          </div>

          <div className="h-[330px]">
            {loading ? (
              <div className="h-full w-full animate-pulse rounded-2xl bg-muted" />
            ) : reportData.topCombos.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border text-center text-sm font-semibold text-muted-foreground">
                Aún no hay combos vendidos entregados.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.topCombos}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 40, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal
                    vertical={false}
                    stroke="hsl(var(--admin-border))"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    width={130}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--admin-border))",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--secondary))"
                    radius={[0, 8, 8, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
