import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Search,
  Eye,
  Trash2,
  RefreshCw,
  PackageCheck,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  Undo2,
  AlertTriangle,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  CalendarDays,
  WalletCards,
  Filter,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";

import AdminLayout from "@/components/AdminLayout.jsx";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal.jsx";
import pb from "@/lib/pocketbaseClient.js";

const STATUS_OPTIONS = [
  "Nuevo",
  "Confirmado",
  "En preparación",
  "Despachado",
  "Entregado",
  "Cancelado",
  "Devuelto",
];

const statusConfig = {
  Nuevo: {
    icon: Clock3,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  Confirmado: {
    icon: PackageCheck,
    className:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  "En preparación": {
    icon: AlertTriangle,
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  Despachado: {
    icon: Truck,
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  Entregado: {
    icon: CheckCircle2,
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  Cancelado: {
    icon: XCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  Devuelto: {
    icon: Undo2,
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
};

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
    return format(parseISO(value), "dd MMM yyyy · h:mm a", { locale: es });
  } catch {
    return "-";
  }
};

const getStatusBadge = (status) => {
  const config = statusConfig[status] || statusConfig.Nuevo;
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black whitespace-nowrap",
        config.className,
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" />
      {status || "Nuevo"}
    </span>
  );
};

const getPaymentBadge = (paymentMethod) => {
  const isPrepaid = paymentMethod === "Pago anticipado";
  const Icon = isPrepaid ? CreditCard : Banknote;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black whitespace-nowrap",
        isPrepaid
          ? "bg-secondary-soft text-secondary-deep"
          : "bg-primary-soft text-primary",
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" />
      {paymentMethod || "Sin método"}
    </span>
  );
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const filters = [];

      if (search) {
        const safeSearch = search.replaceAll('"', '\\"');
        filters.push(
          `(orderNumber~"${safeSearch}" || customerName~"${safeSearch}" || customerPhone~"${safeSearch}" || city~"${safeSearch}")`
        );
      }

      if (statusFilter && statusFilter !== "all") {
        filters.push(`status="${statusFilter}"`);
      }

      if (paymentFilter && paymentFilter !== "all") {
        filters.push(`paymentMethod="${paymentFilter}"`);
      }

      const response = await pb.collection("orders").getList(page, 15, {
        filter: filters.join(" && "),
        sort: "-created",
        expand: "products,combos",
        $autoCancel: false,
      });

      setOrders(response.items);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter, paymentFilter]);

  const stats = useMemo(() => {
    const pageTotal = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const newOrders = orders.filter((order) => order.status === "Nuevo").length;
    const delivered = orders.filter((order) => order.status === "Entregado").length;
    const cod = orders.filter(
      (order) => order.paymentMethod === "Pago contra entrega"
    ).length;

    return {
      pageTotal,
      newOrders,
      delivered,
      cod,
    };
  }, [orders]);

  const handleDelete = async (order) => {
    const confirmation = window.confirm(
      `¿Seguro que deseas eliminar el pedido #${order.orderNumber}? Esta acción no se puede deshacer.`
    );

    if (!confirmation) return;

    try {
      await pb.collection("orders").delete(order.id, {
        $autoCancel: false,
      });

      toast.success("Pedido eliminado");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar pedido");
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      await pb.collection("orders").update(
        order.id,
        {
          status: newStatus,
        },
        {
          $autoCancel: false,
        }
      );

      toast.success(`Pedido #${order.orderNumber} actualizado`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setPage(1);
  };

  const hasFilters = search || statusFilter !== "all" || paymentFilter !== "all";

  return (
    <AdminLayout>
      <Helmet>
        <title>Pedidos | Admin Modo Fácil</title>
      </Helmet>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary">
            <PackageCheck className="h-4 w-4" />
            Operación de ventas
          </div>

          <h1 className="font-display text-4xl font-black tracking-[-0.06em] text-foreground">
            Pedidos
          </h1>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Gestiona ventas, pagos, estados, ciudades y seguimiento de tus
            clientes.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchOrders}
          className="w-fit rounded-full"
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <WalletCards className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                Ventas página
              </p>
              <p className="text-xl font-black">{formatCurrency(stats.pageTotal)}</p>
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                Nuevos página
              </p>
              <p className="text-2xl font-black">{stats.newOrders}</p>
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                Entregados página
              </p>
              <p className="text-2xl font-black">{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Banknote className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                Contra entrega
              </p>
              <p className="text-2xl font-black">{stats.cod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6 p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por orden, cliente, teléfono o ciudad..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl pl-9"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-xl lg:w-[220px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paymentFilter}
            onValueChange={(value) => {
              setPaymentFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-xl lg:w-[240px]">
              <SelectValue placeholder="Método de pago" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos los pagos</SelectItem>
              <SelectItem value="Pago anticipado">Pago anticipado</SelectItem>
              <SelectItem value="Pago contra entrega">
                Pago contra entrega
              </SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-11 rounded-xl"
            >
              <Filter className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className="admin-table-container hidden overflow-hidden md:block">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Pago</th>
              <th className="text-right">Total</th>
              <th className="text-center">Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-12 text-center font-semibold text-muted-foreground"
                >
                  Cargando pedidos...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-12 text-center font-semibold text-muted-foreground"
                >
                  No se encontraron pedidos.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <button
                      type="button"
                      onClick={() => openDetails(order)}
                      className="font-black text-primary hover:underline"
                    >
                      #{order.orderNumber}
                    </button>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      {order.expand?.products?.length || 0} producto(s) ·{" "}
                      {order.expand?.combos?.length || 0} combo(s)
                    </p>
                  </td>

                  <td>
                    <p className="font-black text-foreground">
                      {order.customerName || "Sin nombre"}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                      {order.customerPhone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {order.customerPhone}
                        </span>
                      )}

                      {order.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {order.city}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(order.created)}
                    </span>
                  </td>

                  <td>{getPaymentBadge(order.paymentMethod)}</td>

                  <td className="text-right">
                    <p className="font-black text-primary">
                      {formatCurrency(order.total)}
                    </p>
                    {Number(order.shippingCost || 0) === 0 ? (
                      <p className="text-xs font-black text-secondary-deep">
                        Envío gratis
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-muted-foreground">
                        Envío {formatCurrency(order.shippingCost)}
                      </p>
                    )}
                  </td>

                  <td className="text-center">
                    <Select
                      value={order.status || "Nuevo"}
                      onValueChange={(value) => handleStatusChange(order, value)}
                    >
                      <SelectTrigger className="mx-auto h-9 w-[165px] rounded-full border-border bg-background text-xs font-black">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetails(order)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(order)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border bg-muted/20 p-4">
            <span className="text-sm font-semibold text-muted-foreground">
              Página {page} de {totalPages} · {totalItems} pedidos
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="admin-card p-8 text-center font-semibold text-muted-foreground">
            Cargando pedidos...
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-card p-8 text-center font-semibold text-muted-foreground">
            No se encontraron pedidos.
          </div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="admin-card p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <button
                    type="button"
                    onClick={() => openDetails(order)}
                    className="text-lg font-black text-primary"
                  >
                    #{order.orderNumber}
                  </button>

                  <p className="text-sm font-black text-foreground">
                    {order.customerName || "Sin nombre"}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {formatDate(order.created)}
                  </p>
                </div>

                {getStatusBadge(order.status)}
              </div>

              <div className="mb-4 grid gap-2 rounded-2xl bg-muted/35 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-muted-foreground">
                    Ciudad
                  </span>
                  <span className="font-black">{order.city || "-"}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-muted-foreground">
                    Pago
                  </span>
                  {getPaymentBadge(order.paymentMethod)}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-muted-foreground">
                    Total
                  </span>
                  <span className="font-black text-primary">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              <Select
                value={order.status || "Nuevo"}
                onValueChange={(value) => handleStatusChange(order, value)}
              >
                <SelectTrigger className="mb-3 h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDetails(order)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  Ver
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(order)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Borrar
                </Button>
              </div>
            </article>
          ))
        )}

        {totalPages > 1 && (
          <div className="admin-card flex items-center justify-between p-4">
            <span className="text-sm font-semibold text-muted-foreground">
              Página {page} de {totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page === 1}
              >
                Ant.
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                disabled={page === totalPages}
              >
                Sig.
              </Button>
            </div>
          </div>
        )}
      </div>

      <OrderDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        onUpdate={fetchOrders}
      />
    </AdminLayout>
  );
};

export default AdminOrdersPage;
