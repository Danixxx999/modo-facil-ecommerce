import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock3,
  ClipboardCheck,
  Home,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  Hash,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  Store,
  RotateCcw,
  Eye,
  HeartHandshake,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import TopBar from "@/components/TopBar.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { useOrder } from "@/hooks/useOrders.js";
import { useSettings } from "@/hooks/useSettings.js";

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("es-CO", {
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
      month: "long",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

const normalizePhone = (value) => {
  return String(value || "").replace(/[^\d]/g, "");
};

const STATUS_STEPS = [
  {
    key: "Nuevo",
    label: "Recibido",
    description: "Tu pedido fue registrado.",
    icon: ClipboardCheck,
  },
  {
    key: "Confirmado",
    label: "Confirmado",
    description: "Estamos validando tus datos.",
    icon: CheckCircle2,
  },
  {
    key: "En preparación",
    label: "Preparación",
    description: "Estamos preparando tu compra.",
    icon: Package,
  },
  {
    key: "Despachado",
    label: "Despachado",
    description: "Tu pedido va en camino.",
    icon: Truck,
  },
  {
    key: "Entregado",
    label: "Entregado",
    description: "Pedido entregado con éxito.",
    icon: Home,
  },
];

const getStatusIndex = (status) => {
  const index = STATUS_STEPS.findIndex((step) => step.key === status);

  if (status === "Devuelto") return 3;
  if (status === "Cancelado") return 0;

  return index >= 0 ? index : 0;
};

const getStatusTone = (status) => {
  if (status === "Entregado") {
    return {
      label: "Entregado",
      className: "bg-secondary-soft text-secondary-deep",
      panelClass: "border-secondary/20 bg-secondary-soft/60",
      icon: CheckCircle2,
    };
  }

  if (status === "Cancelado" || status === "Devuelto") {
    return {
      label: status,
      className: "bg-destructive/10 text-destructive",
      panelClass: "border-destructive/20 bg-destructive/10",
      icon: XCircle,
    };
  }

  if (status === "Despachado") {
    return {
      label: "En camino",
      className: "bg-primary-soft text-primary",
      panelClass: "border-primary/20 bg-primary-soft/60",
      icon: Truck,
    };
  }

  return {
    label: status || "En proceso",
    className: "bg-primary-soft text-primary",
    panelClass: "border-primary/20 bg-primary-soft/60",
    icon: Package,
  };
};

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [searchedOrder, setSearchedOrder] = useState(initialOrder);

  const { settings } = useSettings();
  const { order, loading, error } = useOrder(searchedOrder);

  const storeName = settings?.storeName || "Modo Fácil";
  const whatsapp = settings?.whatsApp || settings?.whatsapp || "";
  const supportPhone = normalizePhone(whatsapp);

  useEffect(() => {
    if (initialOrder) {
      setOrderNumber(initialOrder);
      setSearchedOrder(initialOrder);
    }
  }, [initialOrder]);

  const statusTone = useMemo(() => {
    return getStatusTone(order?.status);
  }, [order?.status]);

  const activeIndex = useMemo(() => {
    return getStatusIndex(order?.status);
  }, [order?.status]);

  const progressPercent = useMemo(() => {
    if (!order) return 0;
    if (order.status === "Cancelado" || order.status === "Devuelto") return 100;
    return Math.min(100, (activeIndex / (STATUS_STEPS.length - 1)) * 100);
  }, [activeIndex, order]);

  const supportUrl = useMemo(() => {
    if (!supportPhone) return "#";

    const cleanPhone = supportPhone.startsWith("57")
      ? supportPhone
      : `57${supportPhone}`;

    const message = order
      ? `Hola 👋 necesito ayuda con mi pedido #${order.orderNumber}`
      : `Hola 👋 necesito ayuda para rastrear mi pedido en ${storeName}`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }, [supportPhone, order, storeName]);

  const handleSearch = (event) => {
    event.preventDefault();

    const cleanValue = orderNumber.trim();

    if (!cleanValue) return;

    setSearchedOrder(cleanValue);
  };

  const StatusIcon = statusTone.icon;

  const animationStyles = (
    <style>
      {`
        @keyframes mfTrackingFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes mfTrackingSoftFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes mfTrackingGlow {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.06);
          }
        }

        @keyframes mfTrackingShine {
          0% {
            transform: translateX(-130%) skewX(-18deg);
          }
          70%, 100% {
            transform: translateX(245%) skewX(-18deg);
          }
        }

        @keyframes mfTrackingSpark {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-2px) rotate(8deg) scale(1.08);
          }
        }

        @keyframes mfTrackingPulseRing {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
          }
          50% {
            box-shadow: 0 0 0 9px rgba(249, 115, 22, 0);
          }
        }

        .mf-tracking-float {
          animation: mfTrackingFloat 6.2s ease-in-out infinite;
        }

        .mf-tracking-soft-float {
          animation: mfTrackingSoftFloat 5.5s ease-in-out infinite;
        }

        .mf-tracking-glow {
          animation: mfTrackingGlow 5.8s ease-in-out infinite;
        }

        .mf-tracking-spark {
          animation: mfTrackingSpark 1.9s ease-in-out infinite;
        }

        .mf-tracking-pulse-ring {
          animation: mfTrackingPulseRing 2.8s ease-in-out infinite;
        }

        .mf-tracking-shine::before {
          content: "";
          position: absolute;
          inset-y: -35%;
          left: 0;
          width: 90px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.25),
            transparent
          );
          animation: mfTrackingShine 6.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .mf-tracking-float,
          .mf-tracking-soft-float,
          .mf-tracking-glow,
          .mf-tracking-spark,
          .mf-tracking-pulse-ring,
          .mf-tracking-shine::before {
            animation-duration: 0.001ms;
            animation-iteration-count: 1;
          }
        }
      `}
    </style>
  );

  return (
    <>
      {animationStyles}

      <Helmet>
        <title>Rastrear pedido | {storeName}</title>
        <meta
          name="description"
          content={`Consulta el estado de tu pedido en ${storeName}.`}
        />
      </Helmet>

      <TopBar />
      <Header />

      <main className="mf-page overflow-hidden">
        <section className="relative isolate overflow-hidden bg-hero">
          <div className="mf-tracking-glow absolute left-[-12%] top-[-20%] -z-10 h-[460px] w-[460px] rounded-full bg-primary/15 blur-3xl" />
          <div className="mf-tracking-glow absolute bottom-[-25%] right-[-15%] -z-10 h-[560px] w-[560px] rounded-full bg-secondary/20 blur-3xl [animation-delay:1.2s]" />

          <div className="mf-container relative py-16 md:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                <div className="mf-kicker mf-tracking-pulse-ring mb-5">
                  <Truck className="h-4 w-4" />
                  Seguimiento de compra
                </div>

                <h1 className="font-display text-5xl font-black leading-[0.92] tracking-[-0.075em] md:text-7xl">
                  Rastrea tu pedido sin escribirnos primero.
                </h1>

                <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-muted-foreground">
                  Ingresa tu número de pedido y consulta el estado de tu compra:
                  recibido, confirmado, en preparación, despachado o entregado.
                </p>

                <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                  {[
                    {
                      icon: PackageCheck,
                      title: "Pedido claro",
                      text: "Consulta rápida",
                    },
                    {
                      icon: Truck,
                      title: "Estado visual",
                      text: "Paso a paso",
                    },
                    {
                      icon: MessageCircle,
                      title: "Soporte",
                      text: "Ayuda por WhatsApp",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="mf-tracking-soft-float rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur"
                        style={{ animationDelay: `${index * 0.22}s` }}
                      >
                        <Icon className="mb-3 h-6 w-6 text-primary" />
                        <p className="font-black">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mf-card mf-tracking-float relative overflow-hidden p-5"
              >
                <div className="mf-tracking-shine pointer-events-none absolute inset-0 overflow-hidden opacity-40" />

                <div className="relative rounded-[1.7rem] bg-foreground p-6 text-background">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                        Buscar pedido
                      </p>
                      <p className="mt-1 text-sm font-semibold text-background/70">
                        Ejemplo: MF12345678
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Search className="mf-tracking-spark h-6 w-6 text-primary" />
                    </div>
                  </div>

                  <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                      <Label
                        htmlFor="orderNumber"
                        className="text-background/80"
                      >
                        Número de pedido
                      </Label>

                      <Input
                        id="orderNumber"
                        placeholder="Ej: MF12345678"
                        value={orderNumber}
                        onChange={(event) => setOrderNumber(event.target.value)}
                        className="mt-2 h-12 rounded-2xl border-white/10 bg-white text-foreground"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !orderNumber.trim()}
                      className="mf-btn mf-btn-primary w-full"
                    >
                      {loading ? (
                        <>
                          <RotateCcw className="h-5 w-5 animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5" />
                          Rastrear pedido
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                <div className="relative mt-4 rounded-[1.5rem] bg-primary-soft p-4 text-primary">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm font-bold leading-6">
                      Tu información se usa únicamente para consultar y gestionar
                      el estado de tu pedido.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mf-section">
          <div className="mf-container">
            <AnimatePresence mode="wait">
              {!searchedOrder && !order && !loading && (
                <motion.div
                  key="empty-help"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="mx-auto max-w-4xl"
                >
                  <div className="mf-card relative overflow-hidden p-6 md:p-8">
                    <div className="mf-tracking-shine pointer-events-none absolute inset-0 overflow-hidden opacity-35" />

                    <div className="relative grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                      <div className="rounded-[1.7rem] bg-muted/40 p-6">
                        <Sparkles className="mb-4 h-9 w-9 text-primary" />
                        <h2 className="font-display text-4xl font-black tracking-[-0.06em]">
                          ¿Dónde encuentro mi número?
                        </h2>
                        <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">
                          El número de pedido aparece después de finalizar tu
                          compra y también puede estar en el mensaje de WhatsApp de
                          confirmación.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {[
                          "Revisa el mensaje de confirmación.",
                          "Copia el número completo del pedido.",
                          "Pégalo en el buscador.",
                          "Consulta el estado actualizado.",
                        ].map((item, index) => (
                          <div
                            key={item}
                            className="flex items-center gap-3 rounded-2xl bg-muted/35 p-4"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black">
                              {index + 1}
                            </div>
                            <p className="font-bold">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {loading && searchedOrder && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="mx-auto max-w-3xl"
                >
                  <div className="mf-card p-10 text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-primary-soft text-primary">
                      <RotateCcw className="h-10 w-10 animate-spin" />
                    </div>

                    <h2 className="font-display text-4xl font-black tracking-[-0.06em]">
                      Buscando tu pedido...
                    </h2>

                    <p className="mt-3 font-semibold text-muted-foreground">
                      Estamos consultando el estado de #{searchedOrder}
                    </p>
                  </div>
                </motion.div>
              )}

              {error && searchedOrder && !loading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="mx-auto max-w-3xl"
                >
                  <div className="mf-card overflow-hidden p-6 text-center md:p-10">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-destructive/10 text-destructive">
                      <XCircle className="h-10 w-10" />
                    </div>

                    <h2 className="font-display text-4xl font-black tracking-[-0.06em]">
                      No encontramos ese pedido
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl font-semibold leading-7 text-muted-foreground">
                      Verifica que el número esté escrito exactamente como aparece
                      en tu confirmación. También puedes escribirnos y te ayudamos.
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                      <Button
                        onClick={() => {
                          setOrderNumber("");
                          setSearchedOrder("");
                        }}
                        variant="outline"
                        className="mf-btn"
                      >
                        Buscar otro pedido
                      </Button>

                      <Button asChild className="mf-btn mf-btn-whatsapp">
                        <a href={supportUrl} target="_blank" rel="noreferrer">
                          <MessageCircle className="h-5 w-5" />
                          Pedir ayuda
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {order && !loading && (
                <motion.div
                  key="order-found"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="mx-auto max-w-6xl space-y-6"
                >
                  <div className="mf-card overflow-hidden">
                    <div className="relative bg-foreground p-6 text-background md:p-8">
                      <div className="mf-tracking-shine pointer-events-none absolute inset-0 overflow-hidden opacity-35" />

                      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`mf-tracking-pulse-ring flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] ${statusTone.className}`}
                          >
                            <StatusIcon className="h-8 w-8" />
                          </div>

                          <div>
                            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
                              Pedido encontrado
                            </p>

                            <h2 className="font-display text-4xl font-black tracking-[-0.06em] md:text-5xl">
                              #{order.orderNumber}
                            </h2>

                            <p className="mt-2 text-sm font-semibold text-background/70">
                              Creado el {formatDate(order.created)}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-fit rounded-full px-4 py-2 text-sm font-black ${statusTone.className}`}
                        >
                          Estado: {statusTone.label}
                        </div>
                      </div>

                      <div className="relative mt-8">
                        <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-5">
                          {STATUS_STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isDone = index <= activeIndex;
                            const isCurrent = index === activeIndex;

                            return (
                              <div
                                key={step.key}
                                className={[
                                  "rounded-2xl border p-4 transition-colors",
                                  isDone
                                    ? "border-primary/30 bg-primary/15"
                                    : "border-white/10 bg-white/5",
                                  isCurrent ? "ring-2 ring-primary/40" : "",
                                ].join(" ")}
                              >
                                <Icon
                                  className={[
                                    "mb-3 h-6 w-6",
                                    isDone ? "text-primary" : "text-background/40",
                                    isCurrent ? "mf-tracking-spark" : "",
                                  ].join(" ")}
                                />

                                <p className="font-black">{step.label}</p>
                                <p className="mt-1 text-xs font-semibold text-background/60">
                                  {step.description}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {(order.status === "Cancelado" ||
                          order.status === "Devuelto") && (
                          <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-red-200">
                            Este pedido aparece como {order.status}. Si crees que
                            es un error, comunícate con soporte.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                      <div className="mf-card p-6">
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black">
                              Información del pedido
                            </h3>
                            <p className="text-sm font-semibold text-muted-foreground">
                              Datos registrados al momento de la compra.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <InfoItem
                            icon={User}
                            label="Cliente"
                            value={order.customerName}
                          />

                          <InfoItem
                            icon={Phone}
                            label="Teléfono"
                            value={order.customerPhone}
                          />

                          <InfoItem
                            icon={MapPin}
                            label="Ciudad"
                            value={
                              order.city
                                ? `${order.city}${
                                    order.department
                                      ? `, ${order.department}`
                                      : ""
                                  }`
                                : "-"
                            }
                          />

                          <InfoItem
                            icon={
                              order.paymentMethod === "Pago anticipado"
                                ? CreditCard
                                : Banknote
                            }
                            label="Método de pago"
                            value={order.paymentMethod}
                          />
                        </div>

                        {(order.address || order.neighborhood) && (
                          <div className="mt-5 rounded-2xl bg-muted/35 p-4">
                            <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                              Dirección de entrega
                            </p>
                            <p className="font-bold">
                              {order.address || "-"}
                              {order.neighborhood
                                ? ` · Barrio ${order.neighborhood}`
                                : ""}
                            </p>
                          </div>
                        )}
                      </div>

                      {(order.trackingNumber || order.carrier) && (
                        <div className="mf-card p-6">
                          <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-soft text-secondary-deep">
                              <Truck className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black">
                                Información de envío
                              </h3>
                              <p className="text-sm font-semibold text-muted-foreground">
                                Datos de transportadora y guía.
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <InfoItem
                              icon={Hash}
                              label="Número de guía"
                              value={order.trackingNumber || "-"}
                            />

                            <InfoItem
                              icon={Truck}
                              label="Transportadora"
                              value={order.carrier || "-"}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="mf-card p-6">
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black">
                              Resumen de pago
                            </h3>
                            <p className="text-sm font-semibold text-muted-foreground">
                              Valores registrados en el pedido.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <MoneyRow
                            label="Subtotal"
                            value={formatCurrency(order.subtotal)}
                          />

                          <MoneyRow
                            label="Envío"
                            value={
                              Number(order.shippingCost || 0) === 0
                                ? "Gratis"
                                : formatCurrency(order.shippingCost)
                            }
                          />

                          <div className="border-t border-border pt-4">
                            <div className="flex items-end justify-between gap-4">
                              <span className="text-lg font-black">Total</span>
                              <span className="font-display text-3xl font-black tracking-[-0.05em] text-primary">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-[1.7rem] bg-orange-gradient p-6 text-primary-foreground shadow-xl">
                        <div className="mf-tracking-shine pointer-events-none absolute inset-0 overflow-hidden opacity-75" />

                        <div className="relative">
                          <MessageCircle className="mb-4 h-8 w-8" />
                          <h3 className="font-display text-3xl font-black tracking-[-0.055em]">
                            ¿Necesitas ayuda?
                          </h3>
                          <p className="mt-3 text-sm font-semibold leading-6 opacity-90">
                            Escríbenos con tu número de pedido y te ayudamos a
                            revisar cualquier detalle.
                          </p>

                          <Button
                            asChild
                            className="mf-btn mt-5 bg-white text-primary hover:bg-white/90"
                          >
                            <a href={supportUrl} target="_blank" rel="noreferrer">
                              Hablar por WhatsApp
                              <ArrowRight className="h-5 w-5" />
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="mf-card p-5">
                        <p className="mb-3 text-sm font-black text-foreground">
                          También puedes
                        </p>

                        <div className="grid gap-2">
                          <Button
                            asChild
                            variant="outline"
                            className="justify-start"
                          >
                            <Link to="/store">
                              <Store className="mr-2 h-4 w-4" />
                              Seguir comprando
                            </Link>
                          </Button>

                          <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => {
                              setOrderNumber("");
                              setSearchedOrder("");
                            }}
                          >
                            <Search className="mr-2 h-4 w-4" />
                            Buscar otro pedido
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-2xl bg-muted/35 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>

      <p className="font-black text-foreground">{value || "-"}</p>
    </div>
  );
};

const MoneyRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/35 px-4 py-3">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="font-black text-foreground">{value}</span>
    </div>
  );
};

export default OrderTrackingPage;
