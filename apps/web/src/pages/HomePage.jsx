import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  CheckCircle2,
  PackageCheck,
  Award,
  CreditCard,
  Sparkles,
  BadgePercent,
  Star,
  Zap,
  Clock3,
  HeartHandshake,
  Search,
  Store,
  Home as HomeIcon,
  Utensils,
  Dumbbell,
  Car,
  Smartphone,
  ChevronRight,
  Flame,
  Gift,
  ShoppingBag,
  MapPin,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button.jsx";
import TopBar from "@/components/TopBar.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import CategoryCard from "@/components/CategoryCard.jsx";
import ComboCard from "@/components/ComboCard.jsx";
import TestimonialCard from "@/components/TestimonialCard.jsx";
import FAQItem from "@/components/FAQItem.jsx";
import { useProducts } from "@/hooks/useProducts.js";
import { useCategories } from "@/hooks/useCategories.js";
import { useCombos } from "@/hooks/useCombos.js";
import { useTestimonials } from "@/hooks/useTestimonials.js";
import { useFAQ } from "@/hooks/useFAQ.js";
import { useSettings } from "@/hooks/useSettings.js";

const normalizeWhatsAppNumber = (value) => {
  const clean = String(value || "").replace(/[^\d]/g, "");
  if (!clean) return "";
  return clean.startsWith("57") ? clean : `57${clean}`;
};

const formatWhatsAppUrl = (number, message) => {
  if (!number) return "#";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const HomePage = () => {
  const { products: featuredProducts = [] } = useProducts({ featured: true });
  const { categories = [] } = useCategories();
  const { combos = [] } = useCombos(true);
  const { testimonials = [] } = useTestimonials();
  const { faqs = [] } = useFAQ();
  const { settings } = useSettings();

  const whatsappNumber = normalizeWhatsAppNumber(
    settings?.whatsApp || settings?.whatsapp || settings?.phone
  );

  const whatsappUrl = formatWhatsAppUrl(
    whatsappNumber,
    "Hola, vi Modo Fácil y quiero hacer un pedido 😊"
  );

  const categoryFallbacks = useMemo(
    () => [
      {
        title: "Hogar organizado",
        description: "Gana espacio, orden y comodidad en casa.",
        icon: HomeIcon,
        color: "bg-primary-soft text-primary",
      },
      {
        title: "Cocina práctica",
        description: "Productos para cocinar más fácil y más rico.",
        icon: Utensils,
        color: "bg-accent/20 text-accent-foreground",
      },
      {
        title: "Bienestar en casa",
        description: "Cuídate, descansa y crea rutinas simples.",
        icon: Dumbbell,
        color: "bg-secondary-soft text-secondary-deep",
      },
      {
        title: "Tecnología útil",
        description: "Gadgets que sí vas a usar todos los días.",
        icon: Smartphone,
        color: "bg-primary-soft text-primary",
      },
      {
        title: "Auto y herramientas",
        description: "Soluciones para resolver sin complicarte.",
        icon: Car,
        color: "bg-secondary-soft text-secondary-deep",
      },
      {
        title: "Combos con ahorro",
        description: "Compra inteligente y sube el valor de tu pedido.",
        icon: BadgePercent,
        color: "bg-accent/25 text-accent-foreground",
      },
    ],
    []
  );

  const featuredPreview = featuredProducts.slice(0, 6);
  const combosPreview = combos.slice(0, 3);
  const testimonialsPreview = testimonials.slice(0, 6);
  const faqsPreview = faqs.slice(0, 6);

  const heroProofs = [
    {
      icon: CreditCard,
      title: "Envío gratis",
      text: "con cualquier método de pago",
    },
    {
      icon: PackageCheck,
      title: "Paga al recibir",
      text: "contra entrega disponible",
    },
    {
      icon: Truck,
      title: "Toda Colombia",
      text: "recibe en tu ciudad",
    },
    {
      icon: ShieldCheck,
      title: "Compra segura",
      text: "productos verificados",
    },
  ];

  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: "Productos verificados",
      text: "Seleccionamos soluciones prácticas y revisamos la información clave antes de publicarlas.",
    },
    {
      icon: Truck,
      title: "Envíos a toda Colombia",
      text: "Envío gratis con pago anticipado o contra entrega, a toda Colombia.",
    },
    {
      icon: MessageCircle,
      title: "Atención por WhatsApp",
      text: "Te acompañamos antes de comprar, durante el pedido y después de recibir.",
    },
    {
      icon: CheckCircle2,
      title: "Compra fácil",
      text: "Elige producto, confirma tus datos y recibe en casa sin enredos.",
    },
    {
      icon: PackageCheck,
      title: "Empaque seguro",
      text: "Cada producto se despacha protegido para que llegue como debe llegar.",
    },
    {
      icon: Award,
      title: "Garantía de calidad",
      text: "Trabajamos con proveedores certificados y productos pensados para uso real.",
    },
  ];

  const experienceCards = [
    {
      title: "Cine en casa",
      text: "Proyectores, luces y ambiente para noches que se sienten diferentes.",
      icon: Sparkles,
    },
    {
      title: "Orden total",
      text: "Organizadores, closet y soluciones para que tu casa respire.",
      icon: HomeIcon,
    },
    {
      title: "Auto seguro",
      text: "Compresor, iniciador y herramientas para no quedarte varado.",
      icon: Car,
    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes mfHomeFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes mfHomeSoftFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          @keyframes mfHomeGlow {
            0%, 100% {
              opacity: 0.55;
              transform: scale(1);
            }
            50% {
              opacity: 0.85;
              transform: scale(1.06);
            }
          }

          @keyframes mfHomeShine {
            0% {
              transform: translateX(-130%) skewX(-18deg);
            }
            68%, 100% {
              transform: translateX(240%) skewX(-18deg);
            }
          }

          @keyframes mfHomeSpark {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scale(1);
            }
            50% {
              transform: translateY(-2px) rotate(8deg) scale(1.08);
            }
          }

          @keyframes mfHomePulseRing {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
            }
            50% {
              box-shadow: 0 0 0 9px rgba(249, 115, 22, 0);
            }
          }

          .mf-home-float {
            animation: mfHomeFloat 6.4s ease-in-out infinite;
          }

          .mf-home-soft-float {
            animation: mfHomeSoftFloat 5.4s ease-in-out infinite;
          }

          .mf-home-glow {
            animation: mfHomeGlow 5.8s ease-in-out infinite;
          }

          .mf-home-spark {
            animation: mfHomeSpark 1.9s ease-in-out infinite;
          }

          .mf-home-pulse-ring {
            animation: mfHomePulseRing 2.8s ease-in-out infinite;
          }

          .mf-home-shine::before {
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
            animation: mfHomeShine 6.1s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .mf-home-float,
            .mf-home-soft-float,
            .mf-home-glow,
            .mf-home-spark,
            .mf-home-pulse-ring,
            .mf-home-shine::before {
              animation-duration: 0.001ms;
              animation-iteration-count: 1;
            }
          }
        `}
      </style>

      <Helmet>
        <title>Modo Fácil | Productos útiles para vivir mejor</title>
        <meta
          name="description"
          content="Compra productos prácticos para hogar, cocina, bienestar, tecnología y auto. Envío gratis a toda Colombia y pago contra entrega disponible."
        />
      </Helmet>

      <TopBar />
      <Header />

      <main className="mf-page">
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-hero-gradient" />
          <div className="absolute inset-0 -z-10 bg-soft-grid bg-grid opacity-[0.22]" />

          <div className="mf-home-glow absolute left-[-8rem] top-16 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="mf-home-glow absolute right-[-10rem] top-28 -z-10 h-80 w-80 rounded-full bg-secondary/20 blur-3xl [animation-delay:1.2s]" />

          <div className="mf-container grid min-h-[calc(100vh-7rem)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="relative z-10"
            >
              <motion.div variants={fadeUp} className="mf-kicker mb-5">
                <span className="mf-live-dot" />
                Tienda colombiana · compra fácil · recibe en casa
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mf-title max-w-3xl text-5xl sm:text-6xl lg:text-7xl"
              >
                Haz tu vida más{" "}
                <span className="mf-highlight">fácil</span> con productos que sí
                vas a usar.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mf-subtitle mt-6 max-w-2xl text-base sm:text-lg lg:text-xl"
              >
                Soluciones prácticas para hogar, cocina, bienestar, tecnología y
                auto. Compra desde tu celular, recibe en casa y paga como
                prefieras.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              >
                <Button
                  asChild
                  size="lg"
                  className="mf-btn mf-btn-primary mf-home-pulse-ring min-h-[54px] rounded-full px-6 text-base"
                >
                  <Link to="/store">
                    Explorar tienda
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="mf-btn mf-btn-ghost min-h-[54px] rounded-full px-6 text-base"
                >
                  <a href="#combos">
                    Ver combos con ahorro
                    <BadgePercent className="h-5 w-5" />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {heroProofs.map((proof, index) => {
                  const Icon = proof.icon;

                  return (
                    <div
                      key={proof.title}
                      className="mf-trust-pill mf-home-soft-float"
                      style={{ animationDelay: `${index * 0.25}s` }}
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="leading-tight">
                        <strong className="block text-[12px]">
                          {proof.title}
                        </strong>
                        <span className="block text-[10px] text-muted-foreground">
                          {proof.text}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* HERO VISUAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.12,
              }}
              className="relative"
            >
              <div className="mf-card-static mf-home-float relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
                <div className="absolute inset-0 bg-radial-orange opacity-70" />

                <div className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-white via-primary-soft/60 to-secondary-soft/70 p-4 sm:p-6">
                  <div className="mf-home-shine pointer-events-none absolute inset-0 overflow-hidden opacity-90" />

                  <div className="relative mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
                        Lo más buscado
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-black tracking-[-0.05em] sm:text-3xl">
                        Soluciones que provocan comprar
                      </h2>
                    </div>

                    <div className="mf-payment-spark px-3 py-2 text-xs font-black">
                      Paga al recibir
                    </div>
                  </div>

                  <div className="relative grid grid-cols-2 gap-3">
                    {[
                      {
                        name: "Tabla Pilates",
                        price: "$229.900",
                        tag: "Fitness en casa",
                        emoji: "🧘‍♀️",
                      },
                      {
                        name: "Proyector Y320",
                        price: "$249.900",
                        tag: "Cine en casa",
                        emoji: "🎬",
                      },
                      {
                        name: "Combo Auto",
                        price: "$189.900",
                        tag: "No te quedes varado",
                        emoji: "🚗",
                      },
                      {
                        name: "Wafflera 3 en 1",
                        price: "$159.900",
                        tag: "Desayunos felices",
                        emoji: "🧇",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.name}
                        className="mf-card p-3"
                        animate={{
                          y: index % 2 === 0 ? [0, -6, 0] : [0, 6, 0],
                        }}
                        transition={{
                          duration: 5.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.25,
                        }}
                      >
                        <div className="mb-3 flex h-24 items-center justify-center rounded-2xl bg-white/70 text-5xl shadow-premium-xs">
                          {item.emoji}
                        </div>
                        <p className="line-clamp-1 text-sm font-black">
                          {item.name}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-muted-foreground">
                          {item.tag}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="mf-price-primary text-lg">
                            {item.price}
                          </span>
                          <span className="mf-badge mf-badge-pay">
                            <Zap className="h-3 w-3" />
                            Top
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mf-floating-proof mf-home-soft-float absolute -bottom-5 left-4 hidden max-w-[220px] p-4 sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary ring-2 ring-card" />
                    <div className="h-8 w-8 rounded-full bg-accent ring-2 ring-card" />
                    <div className="h-8 w-8 rounded-full bg-secondary ring-2 ring-card" />
                  </div>
                  <div>
                    <p className="text-sm font-black">Clientes felices</p>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Compras fáciles en Colombia
                    </p>
                  </div>
                </div>
              </div>

              <div className="mf-floating-proof mf-home-soft-float absolute -right-2 top-6 hidden p-3 sm:block [animation-delay:0.8s]">
                <div className="flex items-center gap-2 text-sm font-black">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  4.8/5 en experiencia
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SEARCH / QUICK PROMISE */}
        <section className="relative -mt-5 z-10">
          <div className="mf-container">
            <div className="mf-soft-panel grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center md:p-5">
              <div className="mf-search flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-black tracking-[-0.02em]">
                    ¿Qué quieres mejorar hoy?
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Hogar, cocina, bienestar, tecnología, auto o combos con
                    ahorro.
                  </p>
                </div>
              </div>

              <Button asChild className="mf-btn mf-btn-secondary">
                <Link to="/store">
                  Ver catálogo completo
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="categories" className="mf-section">
          <div className="mf-container">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mf-kicker mb-4">
                  <Store className="h-4 w-4" />
                  Compra por intención
                </div>

                <h2 className="mf-title text-4xl md:text-5xl">
                  ¿Qué quieres mejorar hoy?
                </h2>

                <p className="mf-subtitle mt-3 max-w-2xl">
                  No vendemos cosas al azar. Organizamos productos por
                  soluciones reales para que encuentres rápido lo que necesitas.
                </p>
              </div>

              <Link
                to="/store"
                className="group inline-flex w-fit items-center gap-2 text-sm font-black text-primary"
              >
                Ver toda la tienda
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {categories.slice(0, 6).map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {categoryFallbacks.map((category, index) => {
                  const Icon = category.icon;

                  return (
                    <Link
                      key={category.title}
                      to="/store"
                      className="mf-card mf-home-soft-float group p-5"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="relative z-10 flex items-start gap-4">
                        <span
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${category.color}`}
                        >
                          <Icon className="h-7 w-7" />
                        </span>

                        <div>
                          <h3 className="font-display text-xl font-black tracking-[-0.04em]">
                            {category.title}
                          </h3>
                          <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                            {category.description}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-1 text-sm font-black text-primary">
                            Explorar
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        {featuredPreview.length > 0 && (
          <section id="featured" className="mf-section bg-muted/45">
            <div className="mf-container">
              <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mf-kicker mb-4">
                    <Flame className="h-4 w-4" />
                    Lo que más provoca comprar
                  </div>

                  <h2 className="mf-title text-4xl md:text-5xl">
                    Productos destacados
                  </h2>

                  <p className="mf-subtitle mt-3 max-w-2xl">
                    Selección especial para empezar: productos útiles, visuales y
                    con potencial real para vender por redes.
                  </p>
                </div>

                <Link
                  to="/store"
                  className="group inline-flex w-fit items-center gap-2 text-sm font-black text-primary"
                >
                  Ver más productos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredPreview.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCES */}
        <section className="mf-section-tight">
          <div className="mf-container">
            <div className="grid gap-5 lg:grid-cols-3">
              {experienceCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: index * 0.08 }}
                    className="mf-card mf-home-soft-float p-6"
                    style={{ animationDelay: `${index * 0.35}s` }}
                  >
                    <div className="relative z-10">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <Icon className="h-7 w-7" />
                      </div>

                      <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                        {card.title}
                      </h3>

                      <p className="mt-2 text-sm font-medium leading-7 text-muted-foreground">
                        {card.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMBOS */}
        {combosPreview.length > 0 && (
          <section id="combos" className="mf-section">
            <div className="mf-container">
              <div className="mb-10 overflow-hidden rounded-[2rem] border border-accent/25 bg-gradient-to-br from-card via-card to-accent/10 p-6 shadow-premium-sm md:p-8">
                <div className="mf-home-shine pointer-events-none absolute inset-0 overflow-hidden opacity-60" />

                <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <div className="mf-kicker mb-4">
                      <Gift className="h-4 w-4" />
                      Compra más inteligente
                    </div>

                    <h2 className="mf-title text-4xl md:text-5xl">
                      Combos con ahorro real
                    </h2>

                    <p className="mf-subtitle mt-3 max-w-2xl">
                      Aquí está la magia: productos que juntos resuelven más, se
                      sienten más valiosos y ayudan a ahorrar en una sola compra.
                    </p>
                  </div>

                  <Button asChild className="mf-btn mf-btn-primary">
                    <Link to="/store">
                      Ver todos los combos
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {combosPreview.map((combo) => (
                  <ComboCard key={combo.id} combo={combo} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TRUST FEATURES */}
        <section className="relative overflow-hidden bg-secondary-deep py-16 text-white">
          <div className="mf-home-glow absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="mf-home-glow absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl [animation-delay:1s]" />

          <div className="mf-container relative">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black backdrop-blur-xl">
                <HeartHandshake className="h-4 w-4 text-accent" />
                Confianza antes de vender
              </div>

              <h2 className="font-display text-4xl font-black tracking-[-0.05em] md:text-5xl">
                Comprar debe sentirse fácil y seguro.
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70 md:text-base">
                Como vendemos para Colombia, dejamos claro lo que más importa:
                pago contra entrega, envío, soporte, garantía y productos
                revisados.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trustFeatures.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.10]"
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent"
                      style={{
                        animation: "mfHomeSpark 2.2s ease-in-out infinite",
                        animationDelay: `${index * 0.15}s`,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-black tracking-[-0.04em]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-7 text-white/70">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        {testimonialsPreview.length > 0 && (
          <section className="mf-section">
            <div className="mf-container">
              <div className="mb-10 text-center">
                <div className="mf-kicker mx-auto mb-4">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  Prueba social
                </div>

                <h2 className="mf-title text-4xl md:text-5xl">
                  Lo que dicen nuestros clientes
                </h2>

                <p className="mf-subtitle mx-auto mt-3 max-w-2xl">
                  Experiencias de compra que ayudan a que nuevos clientes se
                  sientan tranquilos al pedir.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {testimonialsPreview.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqsPreview.length > 0 && (
          <section className="mf-section bg-muted/45">
            <div className="mf-container max-w-4xl">
              <div className="mb-10 text-center">
                <div className="mf-kicker mx-auto mb-4">
                  <MessageCircle className="h-4 w-4" />
                  Dudas normales antes de comprar
                </div>

                <h2 className="mf-title text-4xl md:text-5xl">
                  Preguntas frecuentes
                </h2>

                <p className="mf-subtitle mx-auto mt-3 max-w-2xl">
                  Todo lo que el cliente necesita saber para comprar sin miedo.
                </p>
              </div>

              <div className="mf-card-static rounded-[2rem] p-4 md:p-6">
                {faqsPreview.map((faq) => (
                  <FAQItem key={faq.id} faq={faq} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="relative isolate overflow-hidden py-16 md:py-20">
          <div className="absolute inset-0 -z-10 bg-orange-gradient" />
          <div className="absolute inset-0 -z-10 bg-soft-grid bg-grid opacity-[0.16]" />
          <div className="mf-home-glow absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20">
              <Clock3 className="h-4 w-4" />
              Tu próxima solución puede llegar esta semana
            </div>

            <h2 className="font-display text-4xl font-black tracking-[-0.055em] text-white md:text-6xl">
              Entra, elige y recibe en casa.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-white/82 md:text-lg">
              Compra productos útiles, confirma por WhatsApp si lo necesitas y
              paga como prefieras: anticipado o contra entrega. El envío va
              incluido en ambos casos.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="mf-btn min-h-[54px] rounded-full bg-white px-6 text-base font-black text-primary hover:bg-white/90"
              >
                <Link to="/store">
                  Ver productos
                  <ShoppingBag className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="mf-btn mf-btn-whatsapp min-h-[54px] rounded-full px-6 text-base"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Pedir por WhatsApp
                </a>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-2 text-xs font-black text-white/82">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-2">
                <MapPin className="h-3.5 w-3.5" />
                Colombia
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-2">
                <CreditCard className="h-3.5 w-3.5" />
                Envío gratis
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-2">
                <PackageCheck className="h-3.5 w-3.5" />
                Pago contra entrega
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
