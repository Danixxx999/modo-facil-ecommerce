import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingCart,
  MessageCircle,
  Package,
  ShieldCheck,
  Truck,
  ChevronLeft,
  ZoomIn,
  Plus,
  Minus,
  Star,
  BadgePercent,
  CreditCard,
  PackageCheck,
  Sparkles,
  HeartHandshake,
  Clock3,
  ArrowRight,
  Info,
  RotateCcw,
  MapPin,
  Flame,
  Eye,
  Gift,
  CheckCircle2,
  Zap,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.jsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";

import TopBar from "@/components/TopBar.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import ComboCard from "@/components/ComboCard.jsx";
import { useProduct, useProducts } from "@/hooks/useProducts.js";
import { useCart } from "@/contexts/CartContext.jsx";
import { useSettings } from "@/hooks/useSettings.js";
import { generateProductInquiry } from "@/services/whatsappService.js";
import {
  calculateTieredPrice,
  calculateTieredTotal,
  getTiersArray,
} from "@/hooks/useProductPricing.js";
import pb from "@/lib/pocketbaseClient.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=85";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const getDiscount = (currentTotal, regularTotal) => {
  const current = Number(currentTotal || 0);
  const regular = Number(regularTotal || 0);

  if (!regular || regular <= current) return 0;

  return Math.round(((regular - current) / regular) * 100);
};

const getProductImages = (product) => {
  if (!product) return [fallbackImage];

  if (product.images && product.images.length > 0) {
    return product.images.map((image) => pb.files.getURL(product, image));
  }

  if (product.image) {
    return [product.image];
  }

  return [fallbackImage];
};

const getRating = (product) => {
  if (product?.rating) return Number(product.rating).toFixed(1);

  const seed = String(product?.name || "").length % 4;
  return (4.6 + seed * 0.1).toFixed(1);
};

const ProductPage = () => {
  const { slug } = useParams();
  const { product, loading } = useProduct(slug);
  const { products: relatedProducts = [] } = useProducts({
    category: product?.category,
  });
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const pageTitle = product?.name
    ? `${product.name} | Modo Fácil`
    : "Producto | Modo Fácil";

  const images = useMemo(() => getProductImages(product), [product]);
  const mainImage = images[selectedImage] || images[0] || fallbackImage;

  const tiers = getTiersArray(product || {});
  const unitPrice = calculateTieredPrice(product || {}, quantity);
  const totalPrice = calculateTieredTotal(product || {}, quantity);
  const basePrice = Number(product?.price || unitPrice || 0);
  const regularTotal = basePrice * quantity;
  const oldPrice = Number(product?.oldPrice || 0);
  const compareTotal = oldPrice > basePrice ? oldPrice * quantity : regularTotal;
  const discount = getDiscount(totalPrice, compareTotal);
  const savings = Math.max(compareTotal - totalPrice, 0);
  const rating = getRating(product);

  const stock =
    product?.stock === undefined || product?.stock === null
      ? 99
      : Number(product.stock);

  const hasStock = stock > 0;
  const stockIsLow = stock > 0 && stock <= 5;

  const related = useMemo(() => {
    return relatedProducts
      .filter((item) => item.id !== product?.id)
      .slice(0, 4);
  }, [relatedProducts, product?.id]);

  const handleAddToCart = () => {
    if (!hasStock) {
      toast.error("Este producto está agotado por el momento");
      return;
    }

    setIsAdding(true);
    addToCart(product, quantity);

    setTimeout(() => {
      setIsAdding(false);
      toast.success("Producto agregado al carrito");
    }, 420);
  };

  const handleQtyChange = (delta) => {
    const nextQuantity = quantity + delta;
    const maxQty = stock || 99;

    if (nextQuantity >= 1 && nextQuantity <= maxQty) {
      setQuantity(nextQuantity);
    }
  };

  const animationStyles = (
    <style>
      {`
        @keyframes mfProductPageFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes mfProductPageSoftFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes mfProductPageGlow {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.06);
          }
        }

        @keyframes mfProductPageShine {
          0% {
            transform: translateX(-130%) skewX(-18deg);
          }
          70%, 100% {
            transform: translateX(245%) skewX(-18deg);
          }
        }

        @keyframes mfProductPageImageLife {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.025);
          }
        }

        @keyframes mfProductPageSpark {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-2px) rotate(8deg) scale(1.08);
          }
        }

        @keyframes mfProductPagePulseRing {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
          }
          50% {
            box-shadow: 0 0 0 9px rgba(249, 115, 22, 0);
          }
        }

        .mf-product-page-float {
          animation: mfProductPageFloat 6.2s ease-in-out infinite;
        }

        .mf-product-page-soft-float {
          animation: mfProductPageSoftFloat 5.5s ease-in-out infinite;
        }

        .mf-product-page-glow {
          animation: mfProductPageGlow 5.8s ease-in-out infinite;
        }

        .mf-product-page-image-life {
          animation: mfProductPageImageLife 8.2s ease-in-out infinite;
        }

        .mf-product-page-spark {
          animation: mfProductPageSpark 1.9s ease-in-out infinite;
        }

        .mf-product-page-pulse-ring {
          animation: mfProductPagePulseRing 2.8s ease-in-out infinite;
        }

        .mf-product-page-shine::before {
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
          animation: mfProductPageShine 6.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .mf-product-page-float,
          .mf-product-page-soft-float,
          .mf-product-page-glow,
          .mf-product-page-image-life,
          .mf-product-page-spark,
          .mf-product-page-pulse-ring,
          .mf-product-page-shine::before {
            animation-duration: 0.001ms;
            animation-iteration-count: 1;
          }
        }
      `}
    </style>
  );

  if (loading) {
    return (
      <>
        {animationStyles}

        <Helmet>
          <title>Producto | Modo Fácil</title>
        </Helmet>

        <TopBar />
        <Header />

        <main className="mf-page flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-5 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-sm font-black text-muted-foreground">
              Cargando producto...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        {animationStyles}

        <Helmet>
          <title>Producto no encontrado | Modo Fácil</title>
        </Helmet>

        <TopBar />
        <Header />

        <main className="mf-page flex min-h-screen items-center justify-center px-4">
          <div className="mf-card-static relative max-w-lg overflow-hidden rounded-[2rem] p-8 text-center">
            <div className="mf-product-page-shine pointer-events-none absolute inset-0 overflow-hidden opacity-45" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Info className="h-8 w-8" />
              </div>

              <h2 className="font-display text-3xl font-black tracking-[-0.05em]">
                Producto no encontrado
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
                Puede que el producto ya no esté disponible o que el enlace haya
                cambiado.
              </p>

              <Button asChild className="mf-btn mf-btn-primary mt-6">
                <Link to="/store">
                  Volver a la tienda
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {animationStyles}

      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            product.description ||
            product.benefit ||
            `Compra ${product.name} en Modo Fácil. Envío gratis a toda Colombia y pago contra entrega disponible.`
          }
        />
      </Helmet>

      <TopBar />
      <Header />

      <main className="mf-page pb-24 md:pb-0">
        <section className="relative isolate overflow-hidden border-b border-border/70">
          <div className="absolute inset-0 -z-10 bg-hero-gradient" />
          <div className="absolute inset-0 -z-10 bg-soft-grid bg-grid opacity-[0.18]" />
          <div className="mf-product-page-glow absolute -left-24 top-2 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="mf-product-page-glow absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl [animation-delay:1.2s]" />

          <div className="relative mf-container py-6 md:py-8">
            <Button
              variant="ghost"
              asChild
              className="mb-4 -ml-3 rounded-full text-muted-foreground hover:bg-primary-soft hover:text-primary"
            >
              <Link to="/store">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Volver a la tienda
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2 text-xs font-black text-muted-foreground">
              <Link to="/" className="hover:text-primary">
                Inicio
              </Link>
              <span>/</span>
              <Link to="/store" className="hover:text-primary">
                Tienda
              </Link>
              <span>/</span>
              <span className="line-clamp-1 text-foreground">
                {product.name}
              </span>
            </div>
          </div>
        </section>

        <section className="mf-container py-8 md:py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-4"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="mf-card-static group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-[2rem] bg-muted"
                  >
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="mf-product-page-image-life h-full w-full object-cover transition-transform duration-[2200ms] ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-95" />
                    <div className="mf-product-page-shine pointer-events-none absolute inset-0 overflow-hidden opacity-85" />

                    <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                      {discount > 0 && (
                        <Badge className="mf-badge mf-badge-hot border-0 px-3 py-1.5 shadow-lg">
                          <BadgePercent className="h-4 w-4" />
                          -{discount}%
                        </Badge>
                      )}

                      <Badge className="mf-badge mf-badge-pay border-0 px-3 py-1.5 shadow-lg">
                        <PackageCheck className="h-4 w-4" />
                        Paga al recibir
                      </Badge>

                      {stockIsLow && (
                        <span className="mf-stock-chip bg-white/92 backdrop-blur-xl">
                          <span className="mf-live-dot h-1.5 w-1.5" />
                          Pocas unidades
                        </span>
                      )}
                    </div>

                    <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-premium-xs backdrop-blur-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      <ZoomIn className="h-5 w-5" />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/92 p-3 shadow-premium-sm backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-foreground">
                            Producto verificado
                          </p>
                          <p className="line-clamp-1 text-[11px] font-semibold text-muted-foreground">
                            Compra segura · soporte por WhatsApp
                          </p>
                        </div>

                        <div className="mf-rating shrink-0 text-xs">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          {rating}
                        </div>
                      </div>
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-5xl border-none bg-transparent p-1 shadow-none">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="max-h-[85vh] w-full rounded-2xl object-contain"
                  />
                </DialogContent>
              </Dialog>

              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={[
                        "relative aspect-square overflow-hidden rounded-2xl border transition-all duration-200",
                        selectedImage === index
                          ? "border-primary ring-4 ring-primary/12"
                          : "border-border opacity-70 hover:opacity-100",
                      ].join(" ")}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      {selectedImage === index && (
                        <span className="absolute inset-0 bg-primary/10" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: Truck,
                    title: "Toda Colombia",
                    color: "text-primary",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Compra segura",
                    color: "text-secondary",
                  },
                  {
                    icon: MessageCircle,
                    title: "Soporte rápido",
                    color: "text-primary",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="mf-card-static mf-product-page-soft-float rounded-2xl p-3 text-center"
                      style={{ animationDelay: `${index * 0.22}s` }}
                    >
                      <Icon className={`mx-auto mb-2 h-5 w-5 ${item.color}`} />
                      <p className="text-xs font-black">{item.title}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="flex flex-col"
            >
              <div className="mb-4 flex flex-wrap gap-2">
                {product.tags?.length > 0 ? (
                  product.tags.map((tag, index) => (
                    <Badge
                      key={`${tag}-${index}`}
                      className="mf-badge mf-badge-soft border-0"
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <Badge className="mf-badge mf-badge-soft border-0">
                    Producto útil
                  </Badge>
                )}

                <span className="mf-badge mf-badge-pay">
                  <MapPin className="h-3.5 w-3.5" />
                  Envíos Colombia
                </span>
              </div>

              <h1 className="mf-title text-4xl md:text-6xl">
                {product.name}
              </h1>

              {product.benefit ? (
                <p className="mf-subtitle mt-4 text-base md:text-lg">
                  {product.benefit}
                </p>
              ) : (
                <p className="mf-subtitle mt-4 text-base md:text-lg">
                  Producto seleccionado para hacer tu día más fácil, práctico y
                  cómodo.
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="mf-rating">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star
                      key={item}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                  <span className="ml-1 text-sm text-foreground">{rating}</span>
                </div>

                <span className="text-sm font-bold text-muted-foreground">
                  Clientes felices
                </span>

                <span className="mf-stock-chip">
                  <span className="mf-live-dot h-1.5 w-1.5" />
                  {hasStock ? "Disponible" : "Agotado"}
                </span>
              </div>

              <div className="mt-7 overflow-hidden rounded-[2rem] border border-border/75 bg-card/92 p-5 shadow-premium-sm md:p-6">
                <div className="mf-product-page-shine pointer-events-none absolute inset-0 overflow-hidden opacity-0" />

                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                      {quantity > 1
                        ? `Paquete de ${quantity} unidades`
                        : "Precio"}
                    </p>

                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={totalPrice}
                          initial={{ scale: 1.06, y: -2, opacity: 0.75 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0.98, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="mf-price-primary text-5xl"
                        >
                          {formatCurrency(totalPrice)}
                        </motion.span>
                      </AnimatePresence>

                      {compareTotal > totalPrice && (
                        <span className="mf-price-before text-lg font-bold">
                          {formatCurrency(compareTotal)}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs font-bold text-muted-foreground">
                      {quantity > 1
                        ? `${formatCurrency(unitPrice)} por unidad aprox.`
                        : "Precio por 1 unidad"}
                    </p>

                    {savings > 0 && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-black text-accent-foreground">
                        <Sparkles className="mf-product-page-spark h-3.5 w-3.5 text-primary" />
                        Ahorras {formatCurrency(savings)}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-secondary-soft/70 px-4 py-3 text-right">
                    <p className="text-xs font-black text-secondary-deep">
                      Cantidad
                    </p>
                    <p className="font-display text-2xl font-black tracking-[-0.05em]">
                      {quantity} unidad{quantity > 1 ? "es" : ""}
                    </p>
                  </div>
                </div>

                {tiers.length > 1 && (
                  <div className="mb-5 rounded-3xl bg-muted/45 p-4">
                    <h4 className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                      <Gift className="h-4 w-4 text-primary" />
                      Elige tu paquete
                    </h4>

                    <p className="mb-3 text-xs font-semibold text-muted-foreground">
                      Estos valores son el precio total del paquete. No se
                      multiplican otra vez.
                    </p>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {tiers.map((tier) => {
                        const active = quantity === tier.qty;

                        return (
                          <button
                            key={`${tier.label}-${tier.qty}`}
                            type="button"
                            onClick={() => setQuantity(tier.qty)}
                            className={[
                              "relative overflow-hidden rounded-2xl border p-3 text-center transition-all duration-200",
                              active
                                ? "border-primary bg-primary text-primary-foreground shadow-orange"
                                : "border-border bg-card hover:border-primary/30 hover:bg-primary-soft",
                            ].join(" ")}
                          >
                            {active && (
                              <span className="mf-product-page-shine pointer-events-none absolute inset-0 overflow-hidden opacity-55" />
                            )}

                            <div className="relative text-xs font-black opacity-80">
                              {tier.label}
                            </div>

                            <div className="relative mt-1 font-display text-lg font-black tracking-[-0.04em]">
                              {formatCurrency(tier.totalPrice)}
                            </div>

                            {tier.qty > 1 && (
                              <div
                                className={[
                                  "relative mt-1 text-[10px] font-bold",
                                  active
                                    ? "text-primary-foreground/80"
                                    : "text-muted-foreground",
                                ].join(" ")}
                              >
                                {formatCurrency(tier.unitPrice)}/u aprox.
                              </div>
                            )}

                            {tier.savings > 0 && (
                              <div
                                className={[
                                  "relative mt-2 rounded-full px-2 py-1 text-[10px] font-black",
                                  active
                                    ? "bg-white/18 text-white"
                                    : "bg-accent/15 text-accent-foreground",
                                ].join(" ")}
                              >
                                Ahorras {formatCurrency(tier.savings)}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-5 grid gap-3 md:grid-cols-2">
                  <div className="mf-payment-card mf-payment-card-recommended p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                        <CreditCard className="h-5 w-5" />
                      </span>

                      <div>
                        <p className="text-sm font-black">Pago anticipado</p>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          Envío GRATIS a tu ciudad.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mf-payment-card mf-payment-card-cod p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <PackageCheck className="h-5 w-5" />
                      </span>

                      <div>
                        <p className="text-sm font-black">
                          Pago contra entrega
                        </p>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          Envío GRATIS a tu ciudad.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex h-14 items-center justify-between rounded-2xl border border-border bg-background p-1 sm:w-36">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full rounded-xl hover:bg-muted"
                      onClick={() => handleQtyChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>

                    <motion.span
                      key={quantity}
                      initial={{ scale: 1.12 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.18 }}
                      className="w-12 text-center text-lg font-black"
                    >
                      {quantity}
                    </motion.span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full rounded-xl hover:bg-muted"
                      onClick={() => handleQtyChange(1)}
                      disabled={quantity >= stock}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  <Button
                    size="lg"
                    className="mf-btn mf-btn-primary mf-product-page-pulse-ring min-h-[56px] flex-1 rounded-2xl text-base"
                    onClick={handleAddToCart}
                    disabled={!hasStock}
                  >
                    <ShoppingCart
                      className={`h-5 w-5 ${isAdding ? "animate-bounce" : ""}`}
                    />
                    {hasStock
                      ? isAdding
                        ? "Agregado"
                        : `Agregar · ${formatCurrency(totalPrice)}`
                      : "Agotado"}
                  </Button>
                </div>

                <Button
                  size="lg"
                  className="mf-btn mf-btn-whatsapp mt-3 min-h-[56px] w-full rounded-2xl text-base"
                  asChild
                >
                  <a
                    href={generateProductInquiry(product, settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Comprar rápido por WhatsApp
                  </a>
                </Button>

                <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
                  Compra fácil · soporte por WhatsApp · pago contra entrega
                  disponible
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Package,
                    title: "Disponibilidad",
                    text: hasStock
                      ? product.stock !== undefined
                        ? `${stock} en stock`
                        : "Disponible"
                      : "Agotado",
                    color: "text-primary",
                  },
                  {
                    icon: Truck,
                    title: "Envío",
                    text: product.estimatedDelivery || "Nacional",
                    color: "text-secondary",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Garantía",
                    text: product.warranty || "Compra segura",
                    color: "text-accent-foreground",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="mf-card-static mf-product-page-soft-float rounded-2xl p-4 text-center"
                      style={{ animationDelay: `${index * 0.22}s` }}
                    >
                      <Icon className={`mx-auto mb-2 h-6 w-6 ${item.color}`} />
                      <p className="text-sm font-black">{item.title}</p>
                      <p className="mt-1 text-xs font-semibold text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mf-container pb-12">
          <div className="mx-auto max-w-5xl">
            <Tabs defaultValue="description" className="mb-12">
              <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl bg-muted p-1 md:grid-cols-4">
                <TabsTrigger
                  value="description"
                  className="rounded-xl py-3 font-black data-[state=active]:shadow-premium-xs"
                >
                  Descripción
                </TabsTrigger>
                <TabsTrigger
                  value="benefits"
                  className="rounded-xl py-3 font-black data-[state=active]:shadow-premium-xs"
                >
                  Beneficios
                </TabsTrigger>
                <TabsTrigger
                  value="howto"
                  className="rounded-xl py-3 font-black data-[state=active]:shadow-premium-xs"
                >
                  Cómo usar
                </TabsTrigger>
                <TabsTrigger
                  value="specs"
                  className="rounded-xl py-3 font-black data-[state=active]:shadow-premium-xs"
                >
                  Detalles
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 rounded-[2rem] border border-border bg-card p-5 shadow-premium-sm md:p-8">
                <TabsContent value="description" className="mt-0 outline-none">
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {product.longDescription ||
                        product.description ||
                        "Este producto fue seleccionado para hacer tu día a día más fácil, práctico y cómodo."}
                    </p>

                    {product.whatIncluded && (
                      <div className="mt-8 rounded-3xl bg-muted/50 p-6">
                        <h3 className="mb-4 font-display text-2xl font-black tracking-[-0.05em] text-foreground">
                          Qué incluye tu compra
                        </h3>
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {product.whatIncluded}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="benefits" className="mt-0 outline-none">
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {product.benefits ||
                        "• Compra práctica para uso real.\n• Ideal para mejorar tu rutina diaria.\n• Fácil de usar y pensado para el hogar colombiano.\n• Soporte por WhatsApp si necesitas ayuda antes de comprar."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="howto" className="mt-0 outline-none">
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {product.howToUse ||
                        "Usa el producto siguiendo las instrucciones del empaque o la guía del proveedor. Si tienes dudas, puedes escribirnos por WhatsApp antes o después de comprar."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="specs" className="mt-0 outline-none">
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {product.specs ||
                        "Las especificaciones pueden variar según disponibilidad del proveedor. Antes de despachar validamos la información clave del producto."}
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="grid gap-4 md:grid-cols-4">
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
                  icon: RotateCcw,
                  title: "Compra clara",
                  text: "soporte y seguimiento",
                },
                {
                  icon: Clock3,
                  title: "Despacho",
                  text: "según cobertura",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="mf-card-static mf-product-page-soft-float rounded-2xl p-4"
                    style={{ animationDelay: `${index * 0.22}s` }}
                  >
                    <Icon className="mb-3 h-6 w-6 text-primary" />
                    <p className="text-sm font-black">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {product.expand?.recommendedCombo && (
          <section className="mf-container pb-12">
            <div className="mb-6">
              <div className="mf-kicker mb-3">
                <Sparkles className="h-4 w-4" />
                Mejora tu experiencia
              </div>
              <h2 className="mf-title text-4xl">Combo recomendado</h2>
            </div>

            <div className="max-w-2xl">
              <ComboCard combo={product.expand.recommendedCombo} />
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mf-container border-t border-border/70 py-12">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mf-kicker mb-3">
                  <HeartHandshake className="h-4 w-4" />
                  También te puede servir
                </div>
                <h2 className="mf-title text-4xl">Productos relacionados</h2>
              </div>

              <Link
                to="/store"
                className="group inline-flex w-fit items-center gap-2 text-sm font-black text-primary"
              >
                Ver más productos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {related.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}

        <div className="mf-sticky-mobile-cta p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-muted-foreground">
                Total
              </p>
              <p className="mf-price-primary text-xl">
                {formatCurrency(totalPrice)}
              </p>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!hasStock}
              className="mf-btn mf-btn-primary min-h-[48px] flex-1 rounded-2xl text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Agregar
            </Button>

            <Button
              asChild
              className="mf-btn mf-btn-whatsapp min-h-[48px] rounded-2xl px-4"
            >
              <a
                href={generateProductInquiry(product, settings)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Comprar por WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductPage;
