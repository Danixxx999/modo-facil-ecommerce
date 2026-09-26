import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Boxes,
  CheckCircle2,
  Clock,
  CreditCard,
  Heart,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Target,
  Truck,
  Wand2,
  Zap,
  HeartHandshake,
  Eye,
} from "lucide-react";

import TopBar from "@/components/TopBar.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useSettings } from "@/hooks/useStoreSettings.js";

const normalizePhone = (value) => {
  return String(value || "").replace(/[^\d]/g, "");
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const AboutPage = () => {
  const { settings } = useSettings();

  const storeName = settings?.storeName || "Modo Fácil";
  const whatsapp = settings?.whatsApp || settings?.whatsapp || "";
  const phone = normalizePhone(whatsapp);

  const whatsappUrl = phone
    ? `https://wa.me/57${phone.replace(/^57/, "")}?text=${encodeURIComponent(
      `Hola 👋 Quiero conocer más sobre ${storeName}`
    )}`
    : "#";

  const pillars = [
    {
      icon: PackageCheck,
      title: "Productos útiles, no relleno",
      text: "Elegimos productos que resuelven algo real: organizar, ahorrar tiempo, mejorar rutinas o hacer más cómodo tu día.",
    },
    {
      icon: ShieldCheck,
      title: "Compra clara y confiable",
      text: "Te mostramos precios, formas de pago, envío y detalles sin enredos. Queremos que compres tranquilo.",
    },
    {
      icon: MessageCircle,
      title: "Acompañamiento humano",
      text: "Si tienes dudas, puedes escribirnos. No queremos que compres perdido, queremos ayudarte a elegir bien.",
    },
  ];

  const categories = [
    {
      icon: Home,
      title: "Hogar organizado",
      text: "Soluciones para ordenar, guardar y aprovechar mejor tus espacios.",
    },
    {
      icon: ShoppingBag,
      title: "Cocina práctica",
      text: "Productos para preparar, servir y disfrutar con menos esfuerzo.",
    },
    {
      icon: Heart,
      title: "Bienestar en casa",
      text: "Artículos para sentirte mejor, descansar y cuidar tu rutina.",
    },
    {
      icon: Zap,
      title: "Tecnología útil",
      text: "Gadgets simples, funcionales y fáciles de usar.",
    },
    {
      icon: Truck,
      title: "Auto y herramientas",
      text: "Productos prácticos para emergencias, cuidado y soluciones rápidas.",
    },
    {
      icon: Boxes,
      title: "Combos con ahorro",
      text: "Paquetes pensados para comprar más inteligente y ahorrar.",
    },
  ];

  const steps = [
    {
      title: "Exploras",
      text: "Encuentras productos y combos organizados por necesidad.",
    },
    {
      title: "Eliges",
      text: "Agregas al carrito lo que realmente te sirve.",
    },
    {
      title: "Confirmas",
      text: "Completas tus datos y escoges cómo quieres pagar.",
    },
    {
      title: "Te acompañamos",
      text: "Recibimos tu pedido y lo confirmamos por WhatsApp.",
    },
    {
      title: "Recibes",
      text: "Tu pedido llega a casa con seguimiento y atención cercana.",
    },
  ];

  const trustItems = [
    {
      icon: CreditCard,
      title: "Pago anticipado",
      text: "Envío gratis incluido en tu pedido.",
    },
    {
      icon: Banknote,
      title: "Contra entrega",
      text: "Pagas al recibir y el envío sigue siendo gratis.",
    },
    {
      icon: Truck,
      title: "Toda Colombia",
      text: "Despachos nacionales según cobertura.",
    },
    {
      icon: ShieldCheck,
      title: "Compra segura",
      text: "Atención, confirmación y soporte.",
    },
  ];

  const animationStyles = (
    <style>
      {`
        @keyframes mfAboutFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes mfAboutSoftFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes mfAboutGlow {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.06);
          }
        }

        @keyframes mfAboutShine {
          0% {
            transform: translateX(-130%) skewX(-18deg);
          }
          70%, 100% {
            transform: translateX(245%) skewX(-18deg);
          }
        }

        @keyframes mfAboutSpark {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-2px) rotate(8deg) scale(1.08);
          }
        }

        @keyframes mfAboutPulseRing {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
          }
          50% {
            box-shadow: 0 0 0 9px rgba(249, 115, 22, 0);
          }
        }

        .mf-about-float {
          animation: mfAboutFloat 6.2s ease-in-out infinite;
        }

        .mf-about-soft-float {
          animation: mfAboutSoftFloat 5.5s ease-in-out infinite;
        }

        .mf-about-glow {
          animation: mfAboutGlow 5.8s ease-in-out infinite;
        }

        .mf-about-spark {
          animation: mfAboutSpark 1.9s ease-in-out infinite;
        }

        .mf-about-pulse-ring {
          animation: mfAboutPulseRing 2.8s ease-in-out infinite;
        }

        .mf-about-shine::before {
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
          animation: mfAboutShine 6.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .mf-about-float,
          .mf-about-soft-float,
          .mf-about-glow,
          .mf-about-spark,
          .mf-about-pulse-ring,
          .mf-about-shine::before {
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
        <title>Quiénes somos | {storeName}</title>
        <meta
          name="description"
          content={`${storeName} es una tienda colombiana de productos útiles para hacer tu vida más fácil.`}
        />
      </Helmet>

      <TopBar />
      <Header />

      <main className="mf-page overflow-hidden">
        <section className="relative isolate overflow-hidden bg-hero">
          <div className="mf-about-glow absolute left-[-10%] top-[-20%] -z-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
          <div className="mf-about-glow absolute bottom-[-18%] right-[-10%] -z-10 h-[520px] w-[520px] rounded-full bg-secondary/20 blur-3xl [animation-delay:1.2s]" />

          <div className="mf-container relative py-16 md:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.div
                initial="hidden"
                animate="show"
                variants={stagger}
                className="relative z-10"
              >
                <motion.div
                  variants={fadeUp}
                  className="mf-kicker mf-about-pulse-ring mb-5"
                >
                  <Sparkles className="h-4 w-4" />
                  Tienda colombiana de soluciones útiles
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="font-display text-5xl font-black leading-[0.92] tracking-[-0.075em] text-foreground md:text-7xl xl:text-8xl"
                >
                  Hacemos que comprar soluciones para tu vida sea más fácil.
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-muted-foreground md:text-xl"
                >
                  En {storeName} reunimos productos prácticos para el hogar, la
                  cocina, el bienestar, la tecnología y el día a día. No vendemos
                  por vender: buscamos que cada compra tenga sentido.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <Button asChild className="mf-btn mf-btn-primary">
                    <Link to="/store">
                      Ver tienda
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="mf-btn">
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      Hablar con nosotros
                    </a>
                  </Button>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
                >
                  {[
                    ["01", "Compra fácil"],
                    ["02", "Pago flexible"],
                    ["03", "Soporte real"],
                  ].map(([number, label], index) => (
                    <div
                      key={label}
                      className="mf-about-soft-float rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur"
                      style={{ animationDelay: `${index * 0.22}s` }}
                    >
                      <p className="text-2xl font-black text-primary">
                        {number}
                      </p>
                      <p className="mt-1 text-sm font-bold text-muted-foreground">
                        {label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="relative mx-auto max-w-lg">
                  <div className="mf-about-soft-float absolute -left-6 top-8 z-20 hidden rounded-3xl border border-border bg-card p-4 shadow-2xl md:block">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-soft text-secondary-deep">
                        <BadgeCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-black">Productos verificados</p>
                        <p className="text-xs font-semibold text-muted-foreground">
                          Selección con propósito
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mf-about-soft-float absolute -bottom-5 -right-5 z-20 hidden rounded-3xl border border-border bg-card p-4 shadow-2xl md:block [animation-delay:0.7s]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-black">Envíos nacionales</p>
                        <p className="text-xs font-semibold text-muted-foreground">
                          Colombia en cobertura
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mf-about-float relative overflow-hidden rounded-[2.2rem] border border-border bg-card p-4 shadow-2xl">
                    <div className="mf-about-shine pointer-events-none absolute inset-0 overflow-hidden opacity-45" />

                    <div className="relative rounded-[1.7rem] bg-foreground p-6 text-background">
                      <div className="mb-8 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                            {storeName}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-background/70">
                            Soluciones para vivir mejor
                          </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                          <Store className="mf-about-spark h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {[
                          ["Hogar", "Organiza más fácil"],
                          ["Cocina", "Hazlo práctico"],
                          ["Bienestar", "Cuida tu rutina"],
                          ["Tecnología", "Útil de verdad"],
                        ].map(([title, text]) => (
                          <div
                            key={title}
                            className="flex items-center justify-between rounded-2xl bg-white/10 p-4"
                          >
                            <div>
                              <p className="font-black">{title}</p>
                              <p className="text-xs font-semibold text-background/65">
                                {text}
                              </p>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-primary-soft p-4 text-primary">
                        <CreditCard className="mb-3 h-6 w-6" />
                        <p className="font-black">Anticipado</p>
                        <p className="text-xs font-bold opacity-80">
                          Envío gratis
                        </p>
                      </div>

                      <div className="rounded-2xl bg-secondary-soft p-4 text-secondary-deep">
                        <Banknote className="mb-3 h-6 w-6" />
                        <p className="font-black">Contra entrega</p>
                        <p className="text-xs font-bold opacity-80">
                          Pago al recibir
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mf-section">
          <div className="mf-container">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
              >
                <div className="mf-kicker mb-4">
                  <Target className="h-4 w-4" />
                  Nuestra razón de ser
                </div>

                <h2 className="font-display text-4xl font-black leading-[0.95] tracking-[-0.065em] md:text-6xl">
                  Menos complicación. Más soluciones reales.
                </h2>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={stagger}
                className="space-y-5"
              >
                <motion.p
                  variants={fadeUp}
                  className="text-xl font-semibold leading-9 text-muted-foreground"
                >
                  Creemos que una tienda online no debería sentirse fría,
                  confusa o llena de productos sin sentido. Por eso construimos{" "}
                  {storeName} como una tienda clara, cercana y pensada para
                  personas que quieren comprar fácil.
                </motion.p>

                <motion.p
                  variants={fadeUp}
                  className="text-xl font-semibold leading-9 text-muted-foreground"
                >
                  Nuestro enfoque es simple: encontrar productos que solucionen
                  algo, explicarlos bien, ofrecer formas de pago cómodas y
                  acompañarte si tienes dudas.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="relative overflow-hidden rounded-[1.7rem] border border-border bg-muted/35 p-6"
                >
                  <div className="mf-about-shine pointer-events-none absolute inset-0 overflow-hidden opacity-35" />

                  <div className="relative">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
                      En una frase
                    </p>
                    <p className="mt-3 font-display text-3xl font-black tracking-[-0.055em]">
                      Queremos que cada compra se sienta útil, clara y confiable.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mf-section bg-muted/30">
          <div className="mf-container">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="mf-kicker mx-auto mb-4 w-fit">
                <Wand2 className="h-4 w-4" />
                Lo que nos hace diferentes
              </div>

              <h2 className="font-display text-4xl font-black tracking-[-0.065em] md:text-6xl">
                No es solo vender productos. Es vender tranquilidad.
              </h2>
            </div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid gap-5 lg:grid-cols-3"
            >
              {pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <motion.article
                    variants={fadeUp}
                    key={pillar.title}
                    className="group mf-card relative overflow-hidden p-7"
                  >
                    <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 transition-transform duration-500 group-hover:scale-150" />

                    <div className="relative z-10">
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <Icon className="h-7 w-7" />
                      </div>

                      <h3 className="font-display text-2xl font-black tracking-[-0.045em]">
                        {pillar.title}
                      </h3>

                      <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">
                        {pillar.text}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="mf-section">
          <div className="mf-container">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mf-kicker mb-4">
                  <Boxes className="h-4 w-4" />
                  Qué encuentras aquí
                </div>

                <h2 className="max-w-3xl font-display text-4xl font-black tracking-[-0.065em] md:text-6xl">
                  Una tienda organizada por necesidades reales.
                </h2>
              </div>

              <Button asChild variant="outline" className="mf-btn w-fit">
                <Link to="/store">
                  Explorar tienda
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category, index) => {
                const Icon = category.icon;

                return (
                  <motion.article
                    key={category.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: index * 0.04 }}
                    className="group rounded-[1.7rem] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-8 flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="text-sm font-black text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-xl font-black">{category.title}</h3>

                    <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                      {category.text}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-foreground py-20 text-background md:py-28">
          <div className="mf-about-glow absolute left-[-8%] top-[-20%] h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl" />
          <div className="mf-about-glow absolute bottom-[-25%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl [animation-delay:1.2s]" />

          <div className="mf-container relative">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Compra sin enredos
                </p>

                <h2 className="font-display text-4xl font-black leading-[0.95] tracking-[-0.065em] md:text-6xl">
                  Así funciona comprar en {storeName}.
                </h2>

                <p className="mt-5 text-base font-semibold leading-8 text-background/70">
                  Diseñamos un proceso simple para que sepas qué estás
                  comprando, cómo vas a pagar y qué pasa después de hacer tu
                  pedido.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {trustItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="mf-about-soft-float rounded-3xl border border-white/10 bg-white/10 p-4"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <Icon className="mb-3 h-6 w-6 text-primary" />
                        <p className="font-black">{item.title}</p>
                        <p className="mt-1 text-sm font-semibold text-background/65">
                          {item.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary font-black text-primary-foreground">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-xl font-black">{step.title}</h3>
                        <p className="mt-1 text-sm font-semibold leading-6 text-background/70">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mf-section">
          <div className="mf-container">
            <div className="relative overflow-hidden rounded-[2.2rem] border border-border bg-card p-6 shadow-xl md:p-10">
              <div className="mf-about-shine pointer-events-none absolute inset-0 overflow-hidden opacity-35" />
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

              <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <div className="mf-kicker mb-4">
                    <Star className="h-4 w-4" />
                    Nuestra promesa
                  </div>

                  <h2 className="font-display text-4xl font-black leading-[0.95] tracking-[-0.065em] md:text-6xl">
                    Queremos que digas: “esto sí me sirvió”.
                  </h2>

                  <p className="mt-5 text-lg font-semibold leading-8 text-muted-foreground">
                    Esa es la meta. Que el producto no se quede guardado. Que el
                    combo tenga sentido. Que el proceso no te estrese. Que si
                    tienes una duda, alguien te responda.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="mf-btn mf-btn-primary">
                      <Link to="/store">
                        Comprar ahora
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="mf-btn">
                      <Link to="/track-order">
                        Rastrear pedido
                        <Truck className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    "Productos elegidos con intención.",
                    "Comunicación clara por WhatsApp.",
                    "Envío gratis con pago anticipado.",
                    "Pago contra entrega disponible.",
                    "Pedidos con seguimiento.",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="mf-about-soft-float flex items-center gap-3 rounded-2xl bg-muted/45 p-4"
                      style={{ animationDelay: `${index * 0.16}s` }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-soft text-secondary-deep">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>

                      <p className="font-bold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16 md:py-24">
          <div className="mf-container">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative overflow-hidden rounded-[2rem] bg-orange-gradient p-8 text-primary-foreground md:p-10">
                <div className="mf-about-shine pointer-events-none absolute inset-0 overflow-hidden opacity-75" />

                <div className="relative">
                  <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
                    <MessageCircle className="h-4 w-4" />
                    Hablemos
                  </p>

                  <h2 className="font-display text-4xl font-black leading-[0.95] tracking-[-0.065em] md:text-6xl">
                    ¿No sabes qué producto elegir?
                  </h2>

                  <p className="mt-5 text-base font-semibold leading-8 opacity-90">
                    Escríbenos por WhatsApp y te ayudamos a escoger una solución
                    según lo que necesitas. Cercano, claro y sin presión.
                  </p>

                  <Button
                    asChild
                    className="mf-btn mt-8 bg-white text-primary hover:bg-white/90"
                  >
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      Escribir por WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Phone,
                    title: "WhatsApp",
                    text: whatsapp || "Configúralo en ajustes",
                  },
                  {
                    icon: Mail,
                    title: "Correo",
                    text: settings?.email || "Correo por configurar",
                  },
                  {
                    icon: MapPin,
                    title: "Ubicación",
                    text: settings?.address || "Colombia",
                  },
                  {
                    icon: Clock,
                    title: "Horario",
                    text: settings?.hours || "Lunes a sábado",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="mf-card mf-about-soft-float p-6"
                      style={{ animationDelay: `${index * 0.18}s` }}
                    >
                      <Icon className="mb-4 h-7 w-7 text-primary" />
                      <p className="font-black">{item.title}</p>
                      <p className="mt-2 break-all text-sm font-semibold text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
