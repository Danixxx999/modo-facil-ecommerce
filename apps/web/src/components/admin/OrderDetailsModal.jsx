import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import pb from "@/lib/pocketbaseClient.js";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  CreditCard,
  Home,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
  User,
  WalletCards,
  XCircle,
  Undo2,
  Clock3,
  AlertTriangle,
  Sparkles,
  BadgePercent,
} from "lucide-react";

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

const normalizePhone = (value) => {
  if (!value) return "";
  return String(value).replace(/[^\d]/g, "");
};

const getStatusBadge = (status) => {
  const config = statusConfig[status] || statusConfig.Nuevo;
  const Icon = config.icon;

  return (
    <Badge
      className={[
        "inline-flex items-center gap-1.5 rounded-full border-0 px-3 py-1.5 text-xs font-black shadow-none",
        config.className,
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" />
      {status || "Nuevo"}
    </Badge>
  );
};

const OrderDetailsModal = ({ isOpen, onClose, order, onUpdate }) => {
  const [status, setStatus] = useState(order?.status || "Nuevo");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(order?.status || "Nuevo");
  }, [order]);

  const products = order?.expand?.products || [];
  const combos = order?.expand?.combos || [];
  const paymentMethod = order?.paymentMethod || "Sin método";
  const isPrepaid = paymentMethod === "Pago anticipado";
  const whatsappNumber = normalizePhone(
    order?.customerWhatsApp || order?.customerPhone
  );

  const customerAddress = useMemo(() => {
    if (!order) return "";

    const parts = [
      order.address,
      order.neighborhood ? `Barrio: ${order.neighborhood}` : "",
      `${order.city || ""}${order.department ? `, ${order.department}` : ""}`,
      order.deliveryNotes ? `Notas: ${order.deliveryNotes}` : "",
    ].filter(Boolean);

    return parts.join("\n");
  }, [order]);

  const orderCopyText = useMemo(() => {
    if (!order) return "";

    let text = `PEDIDO #${order.orderNumber}\n\n`;
    text += `Cliente: ${order.customerName || "-"}\n`;
    text += `Teléfono: ${order.customerPhone || "-"}\n`;

    if (order.customerWhatsApp) {
      text += `WhatsApp: ${order.customerWhatsApp}\n`;
    }

    text += `\nDirección:\n${customerAddress || "-"}\n\n`;
    text += `Pago: ${paymentMethod}\n`;
    text += `Subtotal: ${formatCurrency(order.subtotal)}\n`;
    text += `Envío: ${
      Number(order.shippingCost || 0) === 0
        ? "GRATIS"
        : formatCurrency(order.shippingCost)
    }\n`;
    text += `Total: ${formatCurrency(order.total)}\n`;
    text += `Estado: ${order.status || "Nuevo"}\n`;

    if (order.observations) {
      text += `\nObservaciones:\n${order.observations}\n`;
    }

    return text;
  }, [order, customerAddress, paymentMethod]);

  if (!order) return null;

  const handleUpdateStatus = async () => {
    setSaving(true);

    try {
      await pb.collection("orders").update(
        order.id,
        {
          status,
        },
        {
          $autoCancel: false,
        }
      );

      toast.success("Estado actualizado");
      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar estado");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderCopyText);
      toast.success("Información del pedido copiada");
    } catch {
      toast.error("No se pudo copiar la información");
    }
  };

  const handleOpenWhatsApp = () => {
    if (!whatsappNumber) {
      toast.error("Este pedido no tiene teléfono o WhatsApp");
      return;
    }

    const message = `Hola ${order.customerName || ""} 👋\n\nTe saluda Modo Fácil. Queremos ayudarte con tu pedido *#${order.orderNumber}*.\n\nEstado actual: *${status}*`;

    window.open(
      `https://wa.me/57${whatsappNumber.replace(/^57/, "")}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto rounded-[1.8rem]">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-display text-3xl font-black tracking-[-0.055em]">
                Pedido #{order.orderNumber}
              </span>

              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {formatDate(order.created)}
              </p>
            </div>

            {getStatusBadge(order.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr]">
          {/* Columna izquierda */}
          <div className="space-y-5">
            {/* Cliente */}
            <section className="rounded-[1.5rem] border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <User className="h-5 w-5" />
                </span>

                <div>
                  <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                    Cliente
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Información para confirmar el pedido.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="rounded-2xl bg-muted/35 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                    Nombre
                  </p>
                  <p className="mt-1 font-black text-foreground">
                    {order.customerName || "-"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-muted/35 p-3">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                      Cédula
                    </p>
                    <p className="mt-1 font-black text-foreground">
                      {order.customerId || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted/35 p-3">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                      Teléfono
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-black text-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      {order.customerPhone || "-"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-muted/35 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                    WhatsApp
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 font-black text-foreground">
                    <MessageCircle className="h-4 w-4 text-secondary" />
                    {order.customerWhatsApp || order.customerPhone || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="mf-btn mf-btn-whatsapp rounded-full"
                >
                  <MessageCircle className="h-4 w-4" />
                  Escribir por WhatsApp
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyOrder}
                  className="rounded-full"
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copiar datos
                </Button>
              </div>
            </section>

            {/* Dirección */}
            <section className="rounded-[1.5rem] border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-soft text-secondary-deep">
                  <Home className="h-5 w-5" />
                </span>

                <div>
                  <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                    Dirección de envío
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Datos para despacho y guía.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-muted/35 p-4">
                <p className="font-black text-foreground">
                  {order.address || "-"}
                </p>

                {order.neighborhood && (
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    Barrio: {order.neighborhood}
                  </p>
                )}

                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-black text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {order.city || "-"}, {order.department || "-"}
                </p>

                {order.deliveryNotes && (
                  <div className="mt-3 rounded-xl border border-primary/15 bg-primary-soft/45 p-3 text-sm font-semibold leading-6 text-muted-foreground">
                    “{order.deliveryNotes}”
                  </div>
                )}
              </div>
            </section>

            {/* Estado */}
            <section className="rounded-[1.5rem] border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <PackageCheck className="h-5 w-5" />
                </span>

                <div>
                  <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                    Estado del pedido
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Cambia el estado según avance la operación.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-black">
                    Cambiar estado
                  </label>

                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {STATUS_OPTIONS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleUpdateStatus}
                  disabled={saving || status === order.status}
                  className="mf-btn mf-btn-primary min-h-[48px] rounded-xl"
                >
                  {saving ? "Guardando..." : "Actualizar estado"}
                </Button>
              </div>
            </section>
          </div>

          {/* Columna derecha */}
          <div className="space-y-5">
            {/* Resumen */}
            <section className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
              <div className="border-b border-border bg-muted/35 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <WalletCards className="h-5 w-5" />
                  </span>

                  <div>
                    <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                      Resumen del pedido
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Productos, pago y total.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-3">
                  {products.length === 0 && combos.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-4 text-sm font-semibold text-muted-foreground">
                      No hay productos expandidos en este pedido. Revisa si la
                      colección está expandiendo products y combos.
                    </div>
                  ) : (
                    <>
                      {products.map((product, index) => (
                        <div
                          key={`product-${product.id || index}`}
                          className="flex items-start justify-between gap-4 rounded-2xl bg-muted/35 p-3"
                        >
                          <div>
                            <p className="font-black text-foreground">
                              {product.name}
                            </p>
                            <p className="text-xs font-semibold text-muted-foreground">
                              Producto
                            </p>
                          </div>

                          <Badge className="border-0 bg-primary-soft text-primary">
                            Producto
                          </Badge>
                        </div>
                      ))}

                      {combos.map((combo, index) => (
                        <div
                          key={`combo-${combo.id || index}`}
                          className="flex items-start justify-between gap-4 rounded-2xl bg-secondary-soft/65 p-3"
                        >
                          <div>
                            <p className="font-black text-foreground">
                              {combo.name}
                            </p>
                            <p className="text-xs font-semibold text-muted-foreground">
                              Combo especial
                            </p>
                          </div>

                          <Badge className="border-0 bg-secondary text-secondary-foreground">
                            Combo
                          </Badge>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-black">
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-muted-foreground">
                      Envío
                    </span>
                    <span
                      className={[
                        "font-black",
                        Number(order.shippingCost || 0) === 0
                          ? "text-secondary-deep"
                          : "text-primary",
                      ].join(" ")}
                    >
                      {Number(order.shippingCost || 0) === 0
                        ? "GRATIS"
                        : formatCurrency(order.shippingCost)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-muted-foreground">
                      Método
                    </span>
                    <span
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black",
                        isPrepaid
                          ? "bg-secondary-soft text-secondary-deep"
                          : "bg-primary-soft text-primary",
                      ].join(" ")}
                    >
                      {isPrepaid ? (
                        <CreditCard className="h-3.5 w-3.5" />
                      ) : (
                        <Banknote className="h-3.5 w-3.5" />
                      )}
                      {paymentMethod}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-muted/45 p-3 text-xs font-bold leading-5 text-muted-foreground">
                    {isPrepaid ? (
                      <>
                        <Sparkles className="mr-1 inline h-4 w-4 text-secondary" />
                        Este pedido tiene pago anticipado. Validar comprobante
                        antes de despachar.
                      </>
                    ) : (
                      <>
                        <PackageCheck className="mr-1 inline h-4 w-4 text-primary" />
                        Este pedido es contra entrega. El cliente paga al recibir.
                      </>
                    )}
                  </div>

                  <div className="flex items-end justify-between border-t border-border pt-4">
                    <span className="text-xl font-black">Total</span>
                    <span className="font-display text-4xl font-black tracking-[-0.055em] text-primary">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Observaciones */}
            {order.observations && (
              <section className="rounded-[1.5rem] border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950/20">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-700 dark:text-orange-400" />
                  <h4 className="font-black text-orange-800 dark:text-orange-400">
                    Observaciones del cliente
                  </h4>
                </div>

                <p className="text-sm font-semibold leading-6 text-orange-700 dark:text-orange-300">
                  {order.observations}
                </p>
              </section>
            )}

            {/* Confianza */}
            <section className="rounded-[1.5rem] border border-border bg-card p-5">
              <div className="grid gap-3">
                {[
                  {
                    icon: ShieldCheck,
                    text: "Verifica datos antes de despachar.",
                  },
                  {
                    icon: Truck,
                    text: "Confirma ciudad y dirección completa.",
                  },
                  {
                    icon: BadgePercent,
                    text: "Revisa si el envío fue gratis o contra entrega.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 text-sm font-bold text-muted-foreground"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.text}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
