import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  PackageCheck,
  User,
  MapPin,
  Home,
  Phone,
  ClipboardList,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  BadgePercent,
  Clock3,
  HeartHandshake,
  Store,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group.jsx";

import TopBar from "@/components/TopBar.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { useCart } from "@/contexts/CartContext.jsx";
import { useSettings } from "@/hooks/useSettings.js";
import { useOrders } from "@/hooks/useOrders.js";
import { generateCheckoutMessage } from "@/services/whatsappService.js";
import { calculateTieredPrice } from "@/hooks/useProductPricing.js";


const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const CheckoutPage = () => {
  const { cartItems, calculateSubtotal, clearCart } = useCart();
  const { settings } = useSettings();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerId: "",
    customerPhone: "",
    customerWhatsApp: "",
    city: "",
    department: "",
    address: "",
    neighborhood: "",
    deliveryNotes: "",
    paymentMethod: "Pago anticipado",
    observations: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const subtotal = calculateSubtotal();
  const shipping = 0;
  const total = subtotal;

  const cartSummaryItems = useMemo(() => {
    return cartItems.map((item) => {
      const unitPrice =
        item.type === "combo"
          ? Number(item.finalPrice || item.price || 0)
          : calculateTieredPrice(item, item.quantity);

      return {
        ...item,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });
  }, [cartItems]);

  const requiredProgress = useMemo(() => {
    const requiredFields = [
      formData.customerName,
      formData.customerPhone,
      formData.city,
      formData.department,
      formData.address,
    ];

    const filled = requiredFields.filter(Boolean).length;

    return Math.round((filled / requiredFields.length) * 100);
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const orderNumber = `MF${Date.now().toString().slice(-8)}`;

      const productIds = cartItems
        .filter((item) => item.type === "product")
        .map((item) => item.id);

      const comboIds = cartItems
        .filter((item) => item.type === "combo")
        .map((item) => item.id);

      const orderData = {
        orderNumber,
        ...formData,
        customerWhatsApp: formData.customerWhatsApp || formData.customerPhone,
        products: productIds,
        combos: comboIds,
        subtotal,
        shippingCost: shipping,
        total,
        status: "Nuevo",
      };

      await createOrder(orderData);

      const whatsappUrl = generateCheckoutMessage(
        orderData,
        cartItems,
        settings
      );

      window.open(whatsappUrl, "_blank");

      clearCart();
      toast.success("Pedido creado correctamente");
      navigate(`/order-tracking?order=${orderNumber}`);
    } catch (error) {
      toast.error("Error al crear el pedido");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <style>
        {`
          @keyframes mfCheckoutFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes mfCheckoutSoftFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }

          @keyframes mfCheckoutGlow {
            0%, 100% {
              opacity: 0.55;
              transform: scale(1);
            }
            50% {
              opacity: 0.85;
              transform: scale(1.06);
            }
          }

          @keyframes mfCheckoutShine {
            0% {
              transform: translateX(-130%) skewX(-18deg);
            }
            70%, 100% {
              transform: translateX(245%) skewX(-18deg);
            }
          }

          @keyframes mfCheckoutSpark {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scale(1);
            }
            50% {
              transform: translateY(-2px) rotate(8deg) scale(1.08);
            }
          }

          @keyframes mfCheckoutPulseRing {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
            }
            50% {
              box-shadow: 0 0 0 9px rgba(249, 115, 22, 0);
            }
          }

          .mf-checkout-float {
            animation: mfCheckoutFloat 6.2s ease-in-out infinite;
          }

          .mf-checkout-soft-float {
            animation: mfCheckoutSoftFloat 5.5s ease-in-out infinite;
          }

          .mf-checkout-glow {
            animation: mfCheckoutGlow 5.8s ease-in-out infinite;
          }

          .mf-checkout-spark {
            animation: mfCheckoutSpark 1.9s ease-in-out infinite;
          }

          .mf-checkout-pulse-ring {
            animation: mfCheckoutPulseRing 2.8s ease-in-out infinite;
          }

          .mf-checkout-shine::before {
            content: "";
            position: absolute;
            inset-y: -35%;
            left: 0;
            width: 90px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.26),
              transparent
            );
            animation: mfCheckoutShine 6.2s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .mf-checkout-float,
            .mf-checkout-soft-float,
            .mf-checkout-glow,
            .mf-checkout-spark,
            .mf-checkout-pulse-ring,
            .mf-checkout-shine::before {
              animation-duration: 0.001ms;
              animation-iteration-count: 1;
            }
          }
        `}
      </style>

      <Helmet>
        <title>Finalizar pedido | Modo Fácil</title>
        <meta
          name="description"
          content="Finaliza tu pedido en Modo Fácil. Elige pago anticipado o contra entrega con envío gratis a toda Colombia."
        />
      </Helmet>

      <TopBar />
      <Header />

      <main className="mf-page">
        <section className="relative isolate overflow-hidden border-b border-border/70 py-10 md:py-14">
          <div className="absolute inset-0 -z-10 bg-hero-gradient" />
          <div className="absolute inset-0 -z-10 bg-soft-grid bg-grid opacity-[0.18]" />
          <div className="mf-checkout-glow absolute -left-20 top-8 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="mf-checkout-glow absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl [animation-delay:1.1s]" />

          <div className="relative mf-container">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mf-kicker mf-checkout-pulse-ring mb-4">
                  <LockKeyhole className="h-4 w-4" />
                  Checkout seguro
                </div>

                <h1 className="mf-title text-5xl md:text-6xl">
                  Finalizar pedido
                </h1>

                <p className="mf-subtitle mt-3 max-w-2xl">
                  Completa tus datos, elige cómo quieres pagar y confirma tu
                  compra por WhatsApp.
                </p>
              </div>

              <Button asChild className="mf-btn mf-btn-ghost w-fit">
                <Link to="/cart">
                  Volver al carrito
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {[
                {
                  icon: CreditCard,
                  title: "Pago anticipado",
                  text: "envío gratis",
                },
                {
                  icon: PackageCheck,
                  title: "Contra entrega",
                  text: "envío gratis",
                },
                {
                  icon: Truck,
                  title: "Toda Colombia",
                  text: "recibe en casa",
                },
                {
                  icon: MessageCircle,
                  title: "Confirmas por WhatsApp",
                  text: "soporte rápido",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="mf-trust-pill mf-checkout-soft-float justify-start"
                    style={{ animationDelay: `${index * 0.22}s` }}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span>
                      <strong className="block text-[12px]">
                        {item.title}
                      </strong>
                      <span className="block text-[10px] text-muted-foreground">
                        {item.text}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mf-container py-10 md:py-14">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
              <div className="space-y-6 lg:col-span-2">
                <div className="relative overflow-hidden rounded-[1.6rem] border border-border/75 bg-card p-4 shadow-premium-xs">
                  <div className="mf-checkout-shine pointer-events-none absolute inset-0 overflow-hidden opacity-40" />

                  <div className="relative mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <ClipboardList className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-black">
                          Datos necesarios para despachar
                        </p>
                        <p className="text-xs font-semibold text-muted-foreground">
                          Completa los campos marcados con *
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-black text-primary">
                      {requiredProgress}%
                    </span>
                  </div>

                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      animate={{ width: `${requiredProgress}%` }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="mf-card-static rounded-[1.8rem] p-5 md:p-7">
                  <div className="mb-6 flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-orange">
                      1
                    </span>
                    <div>
                      <h2 className="font-display text-3xl font-black tracking-[-0.055em]">
                        Tus datos
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        Necesitamos esta información para confirmar y despachar
                        correctamente.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="customerName"
                        className="flex items-center gap-2 font-black"
                      >
                        <User className="h-4 w-4 text-primary" />
                        Nombre completo *
                      </Label>
                      <Input
                        id="customerName"
                        required
                        value={formData.customerName}
                        onChange={(event) =>
                          handleChange("customerName", event.target.value)
                        }
                        placeholder="Ej: Daniel Olaya"
                        className="mf-input h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerId" className="font-black">
                        Cédula
                      </Label>
                      <Input
                        id="customerId"
                        value={formData.customerId}
                        onChange={(event) =>
                          handleChange("customerId", event.target.value)
                        }
                        placeholder="Opcional"
                        className="mf-input h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="customerPhone"
                        className="flex items-center gap-2 font-black"
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        Teléfono *
                      </Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(event) =>
                          handleChange("customerPhone", event.target.value)
                        }
                        placeholder="Ej: 3001234567"
                        className="mf-input h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="customerWhatsApp"
                        className="flex items-center gap-2 font-black"
                      >
                        <MessageCircle className="h-4 w-4 text-secondary" />
                        WhatsApp
                      </Label>
                      <Input
                        id="customerWhatsApp"
                        type="tel"
                        value={formData.customerWhatsApp}
                        onChange={(event) =>
                          handleChange("customerWhatsApp", event.target.value)
                        }
                        placeholder="Si es diferente al teléfono"
                        className="mf-input h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="mf-card-static rounded-[1.8rem] p-5 md:p-7">
                  <div className="mb-6 flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-orange">
                      2
                    </span>
                    <div>
                      <h2 className="font-display text-3xl font-black tracking-[-0.055em]">
                        Datos de envío
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        Escríbelos lo más claro posible para evitar retrasos.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="flex items-center gap-2 font-black"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        Ciudad *
                      </Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(event) =>
                          handleChange("city", event.target.value)
                        }
                        placeholder="Ej: Ibagué"
                        className="mf-input h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="font-black">
                        Departamento *
                      </Label>
                      <Input
                        id="department"
                        required
                        value={formData.department}
                        onChange={(event) =>
                          handleChange("department", event.target.value)
                        }
                        placeholder="Ej: Tolima"
                        className="mf-input h-12"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="address"
                        className="flex items-center gap-2 font-black"
                      >
                        <Home className="h-4 w-4 text-primary" />
                        Dirección completa *
                      </Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(event) =>
                          handleChange("address", event.target.value)
                        }
                        placeholder="Ej: Carrera 5 # 10-20, apto 301"
                        className="mf-input h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood" className="font-black">
                        Barrio
                      </Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={(event) =>
                          handleChange("neighborhood", event.target.value)
                        }
                        placeholder="Opcional"
                        className="mf-input h-12"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="deliveryNotes" className="font-black">
                        Notas de entrega
                      </Label>
                      <Textarea
                        id="deliveryNotes"
                        value={formData.deliveryNotes}
                        onChange={(event) =>
                          handleChange("deliveryNotes", event.target.value)
                        }
                        placeholder="Ej: casa fachada blanca, dejar en portería, llamar antes de llegar..."
                        className="mf-input min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mf-card-static rounded-[1.8rem] p-5 md:p-7">
                  <div className="mb-6 flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-orange">
                      3
                    </span>
                    <div>
                      <h2 className="font-display text-3xl font-black tracking-[-0.055em]">
                        Método de pago
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        Elige pago anticipado o contra entrega. El envío es gratis
                        con cualquiera de los dos métodos.
                      </p>
                    </div>
                  </div>

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      handleChange("paymentMethod", value)
                    }
                    className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="Pago anticipado"
                        id="pago-anticipado"
                        className="peer sr-only"
                      />

                      <Label
                        htmlFor="pago-anticipado"
                        className="mf-payment-card mf-payment-card-recommended relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-[1.5rem] p-5 peer-data-[state=checked]:ring-4 peer-data-[state=checked]:ring-secondary/15"
                      >
                        {formData.paymentMethod === "Pago anticipado" && (
                          <div className="mf-checkout-shine pointer-events-none absolute inset-0 overflow-hidden opacity-70" />
                        )}

                        <div className="absolute right-3 top-3 rounded-full bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-secondary-foreground">
                          Recomendado
                        </div>

                        <CreditCard className="mf-checkout-spark mb-4 h-8 w-8 text-secondary" />

                        <div className="relative">
                          <span className="block text-xl font-black tracking-[-0.03em]">
                            Pago anticipado
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-muted-foreground">
                            Pagas antes del despacho. El envío está incluido.
                          </span>
                        </div>

                        <div className="relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/12 px-3 py-1.5 text-xs font-black text-secondary-deep">
                          <Sparkles className="h-3.5 w-3.5" />
                          Envío GRATIS
                        </div>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem
                        value="Pago contra entrega"
                        id="contra-entrega"
                        className="peer sr-only"
                      />

                      <Label
                        htmlFor="contra-entrega"
                        className="mf-payment-card mf-payment-card-cod relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-[1.5rem] p-5 peer-data-[state=checked]:ring-4 peer-data-[state=checked]:ring-primary/15"
                      >
                        {formData.paymentMethod === "Pago contra entrega" && (
                          <div className="mf-checkout-shine pointer-events-none absolute inset-0 overflow-hidden opacity-60" />
                        )}

                        <Banknote className="mf-checkout-spark mb-4 h-8 w-8 text-primary" />

                        <div className="relative">
                          <span className="block text-xl font-black tracking-[-0.03em]">
                            Pago contra entrega
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-muted-foreground">
                            Pagas cuando recibes tu pedido en casa.
                          </span>
                        </div>

                        <div className="relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-black text-primary">
                          <PackageCheck className="h-3.5 w-3.5" />
                          Envío GRATIS
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <AnimatePresence mode="wait">
                    {formData.paymentMethod === "Pago anticipado" && (
                      <motion.div
                        key="prepaid"
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mb-6 rounded-[1.5rem] border border-secondary/20 bg-secondary-soft/70 p-5">
                          <h4 className="mb-3 flex items-center gap-2 font-black text-secondary-deep">
                            <ShieldCheck className="h-5 w-5" />
                            Instrucciones para pago anticipado
                          </h4>

                          <p className="text-sm font-semibold leading-6 text-muted-foreground">
                            {settings?.paymentInstructions ||
                              "Realiza la transferencia a uno de los medios configurados y envía el comprobante por WhatsApp para confirmar el despacho."}
                          </p>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border bg-card p-4">
                              <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                                Nequi
                              </span>
                              <span className="text-lg font-black">
                                {settings?.nequiNumber || "No configurado"}
                              </span>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-4">
                              <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                                Banco / Otro
                              </span>
                              <span className="text-lg font-black">
                                {settings?.falabellaNumber || "No configurado"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label htmlFor="observations" className="font-black">
                      Observaciones del pedido
                    </Label>
                    <Textarea
                      id="observations"
                      value={formData.observations}
                      onChange={(event) =>
                        handleChange("observations", event.target.value)
                      }
                      placeholder="Agrega instrucciones especiales si lo deseas..."
                      className="mf-input min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-28 space-y-4">
                  <div className="mf-checkout-float relative overflow-hidden rounded-[1.8rem] border border-border/75 bg-card p-5 shadow-premium-md md:p-6">
                    <div className="mf-checkout-shine pointer-events-none absolute inset-0 overflow-hidden opacity-35" />

                    <div className="relative mb-5 flex items-center justify-between">
                      <h2 className="font-display text-3xl font-black tracking-[-0.055em]">
                        Tu pedido
                      </h2>

                      <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-black text-primary">
                        {cartItems.length} item
                        {cartItems.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="relative mb-6 max-h-[280px] space-y-3 overflow-y-auto pr-1">
                      {cartSummaryItems.map((item) => (
                        <div
                          key={`${item.id}-${item.type}`}
                          className="rounded-2xl border border-border/70 bg-muted/30 p-3"
                        >
                          <div className="flex justify-between gap-4">
                            <div className="min-w-0">
                              <p className="line-clamp-2 text-sm font-black leading-5">
                                {item.name}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                x{item.quantity} ·{" "}
                                {item.type === "combo"
                                  ? "Combo"
                                  : "Producto"}
                              </p>
                            </div>

                            <span className="shrink-0 text-sm font-black">
                              {formatCurrency(item.lineTotal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="relative space-y-4 border-t border-border pt-5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-muted-foreground">
                          Subtotal
                        </span>
                        <span className="font-black">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-muted-foreground">
                          Envío
                        </span>
                        <motion.span
                          key={shipping}
                          initial={{ scale: 1.08 }}
                          animate={{ scale: 1 }}
                          className={[
                            "font-black",
                            shipping === 0
                              ? "rounded-full bg-secondary-soft px-3 py-1 text-secondary-deep"
                              : "text-primary",
                          ].join(" ")}
                        >
                          {shipping === 0
                            ? "¡GRATIS!"
                            : formatCurrency(shipping)}
                        </motion.span>
                      </div>

                      <div className="rounded-2xl bg-muted/55 p-4 text-xs font-bold leading-5 text-muted-foreground">
                        <PackageCheck className="mr-1 inline h-4 w-4 text-primary" />
                        El envío es gratis con pago anticipado y con pago contra entrega.
                      </div>

                      <div className="flex items-end justify-between border-t border-border pt-5">
                        <span className="text-xl font-black">Total</span>

                        <motion.span
                          key={total}
                          initial={{ scale: 1.08, y: -2 }}
                          animate={{ scale: 1, y: 0 }}
                          className="mf-price-primary text-4xl"
                        >
                          {formatCurrency(total)}
                        </motion.span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mf-btn mf-btn-primary mt-6 min-h-[58px] w-full rounded-2xl text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-5 w-5" />
                          Confirmar por WhatsApp
                        </>
                      )}
                    </Button>

                    <p className="relative mt-4 text-center text-xs font-bold leading-5 text-muted-foreground">
                      Al confirmar, se crea tu pedido y se abre WhatsApp para
                      finalizar la compra.
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-border/75 bg-card p-4 shadow-premium-xs">
                    <div className="grid gap-3">
                      {[
                        {
                          icon: CheckCircle2,
                          text: "Tus datos se usan solo para gestionar el pedido.",
                        },
                        {
                          icon: ShieldCheck,
                          text: "Compra clara, segura y con soporte.",
                        },
                        {
                          icon: Truck,
                          text: "Despachos a ciudades de Colombia.",
                        },
                        {
                          icon: BadgePercent,
                          text: "Envío gratis con cualquier método de pago.",
                        },
                        {
                          icon: HeartHandshake,
                          text: "Confirmación humana por WhatsApp.",
                        },
                        {
                          icon: Clock3,
                          text: "Proceso rápido y fácil de entender.",
                        },
                      ].map((item, index) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.text}
                            className="flex items-center gap-3 text-sm font-bold text-muted-foreground"
                          >
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"
                              style={{
                                animation:
                                  "mfCheckoutSpark 2s ease-in-out infinite",
                                animationDelay: `${index * 0.12}s`,
                              }}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            {item.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button asChild className="mf-btn mf-btn-ghost w-full">
                    <Link to="/store">
                      <Store className="h-4 w-4" />
                      Seguir viendo productos
                    </Link>
                  </Button>
                </div>
              </aside>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CheckoutPage;
