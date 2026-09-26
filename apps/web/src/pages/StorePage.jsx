import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Filter,
  Search,
  PackageX,
  Sparkles,
  SlidersHorizontal,
  Truck,
  CreditCard,
  PackageCheck,
  ShieldCheck,
  BadgePercent,
  Flame,
  X,
  ArrowRight,
  Store,
  Zap,
  Star,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Slider } from "@/components/ui/slider.jsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx";

import TopBar from "@/components/TopBar.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { useProducts } from "@/hooks/useProducts.js";
import { useCategories } from "@/hooks/useCategories.js";
import { useSettings } from "@/hooks/useSettings.js";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const normalizeText = (value = "") => {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
};

const normalizeWhatsAppNumber = (value) => {
  const clean = String(value || "").replace(/[^\d]/g, "");
  if (!clean) return "";
  return clean.startsWith("57") ? clean : `57${clean}`;
};

const buildWhatsAppUrl = (number, message) => {
  if (!number) return "#";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

const StorePage = () => {
  const { products = [], loading: productsLoading } = useProducts();
  const { categories = [] } = useCategories();
  const { settings } = useSettings();

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(12);

  const whatsappNumber = normalizeWhatsAppNumber(
    settings?.whatsApp || settings?.whatsapp || settings?.phone
  );

  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hola, vi la tienda Modo Fácil y quiero que me ayuden a elegir un producto 😊"
  );

  const availableTags = [
    "Nuevo",
    "Más vendido",
    "Combo",
    "Oferta",
    "Paga al recibir",
  ];

  const trustChips = [
    {
      icon: CreditCard,
      label: "Envío gratis en todos los pedidos",
    },
    {
      icon: PackageCheck,
      label: "Pago contra entrega disponible",
    },
    {
      icon: Truck,
      label: "Envíos a toda Colombia",
    },
    {
      icon: ShieldCheck,
      label: "Productos verificados",
    },
  ];

  useEffect(() => {
    if (products && products.length > 0) {
      const highest = Math.max(...products.map((p) => Number(p.price || 0)));
      const safeHighest = highest > 0 ? highest : 1000000;

      setMaxPrice(safeHighest);
      setPriceRange([0, safeHighest]);
    }
  }, [products]);

  const activeFiltersCount =
    selectedCategories.length +
    selectedTags.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (search ? 1 : 0);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const normalizedSearch = normalizeText(search);

    return products
      .filter((product) => {
        const productName = normalizeText(product?.name || "");
        const productBenefit = normalizeText(product?.benefit || "");
        const productDescription = normalizeText(product?.description || "");
        const productTags = Array.isArray(product?.tags) ? product.tags : [];

        const matchesSearch =
          !normalizedSearch ||
          productName.includes(normalizedSearch) ||
          productBenefit.includes(normalizedSearch) ||
          productDescription.includes(normalizedSearch) ||
          productTags.some((tag) => normalizeText(tag).includes(normalizedSearch));

        if (!matchesSearch) return false;

        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(product.category)
        ) {
          return false;
        }

        const price = Number(product?.price || 0);

        if (price < priceRange[0] || price > priceRange[1]) {
          return false;
        }

        if (selectedTags.length > 0) {
          const hasTag = productTags.some((tag) => selectedTags.includes(tag));
          if (!hasTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a?.price || 0);
        const priceB = Number(b?.price || 0);

        switch (sortOption) {
          case "price-asc":
            return priceA - priceB;

          case "price-desc":
            return priceB - priceA;

          case "name-asc":
            return String(a?.name || "").localeCompare(String(b?.name || ""));

          case "best-seller":
            return (
              (b.tags?.includes("Más vendido") ? 1 : 0) -
              (a.tags?.includes("Más vendido") ? 1 : 0)
            );

          case "offers":
            return (
              (b.oldPrice && b.oldPrice > b.price ? 1 : 0) -
              (a.oldPrice && a.oldPrice > a.price ? 1 : 0)
            );

          case "recent":
          default:
            return new Date(b?.created || 0) - new Date(a?.created || 0);
        }
      });
  }, [
    products,
    search,
    selectedCategories,
    priceRange,
    selectedTags,
    sortOption,
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((previous) =>
      previous.includes(categoryId)
        ? previous.filter((id) => id !== categoryId)
        : [...previous, categoryId]
    );
    setVisibleCount(12);
  };

  const toggleTag = (tag) => {
    setSelectedTags((previous) =>
      previous.includes(tag)
        ? previous.filter((currentTag) => currentTag !== tag)
        : [...previous, tag]
    );
    setVisibleCount(12);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, maxPrice]);
    setSearch("");
    setVisibleCount(12);
  };

  const FiltersContent = () => (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
            Filtros
          </h3>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Encuentra rápido lo que sí necesitas.
          </p>
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto rounded-full px-3 py-1.5 text-xs font-black text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            Limpiar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          <Store className="h-4 w-4" />
          Categorías
        </h4>

        <div className="space-y-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <label
                key={category.id}
                htmlFor={`cat-${category.id}`}
                className={[
                  "group flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200",
                  selectedCategories.includes(category.id)
                    ? "border-primary/35 bg-primary-soft text-primary"
                    : "border-border/75 bg-card hover:border-primary/25 hover:bg-primary-soft/50",
                ].join(" ")}
              >
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                  className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />

                <span className="text-sm font-black tracking-[-0.02em]">
                  {category.name}
                </span>
              </label>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/35 p-4 text-sm font-semibold text-muted-foreground">
              Aún no hay categorías creadas.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          <BadgePercent className="h-4 w-4" />
          Rango de precio
        </h4>

        <div className="rounded-3xl border border-border/75 bg-card p-4 shadow-premium-xs">
          <div className="px-2 pb-2 pt-6">
            <Slider
              min={0}
              max={maxPrice > 0 ? maxPrice : 1000000}
              step={1000}
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value);
                setVisibleCount(12);
              }}
              className="my-4"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="rounded-2xl bg-muted/55 px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Desde
              </p>
              <p className="text-sm font-black">
                {formatCurrency(priceRange[0])}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/55 px-3 py-2 text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Hasta
              </p>
              <p className="text-sm font-black">
                {formatCurrency(priceRange[1])}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          <Sparkles className="h-4 w-4" />
          Etiquetas
        </h4>

        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const active = selectedTags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={[
                  "rounded-full border px-3 py-2 text-xs font-black transition-all duration-200",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-orange"
                    : "border-border bg-card text-foreground hover:border-primary/35 hover:bg-primary-soft hover:text-primary",
                ].join(" ")}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-secondary/20 bg-secondary-soft/55 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <PackageCheck className="h-5 w-5" />
          </span>

          <div>
            <p className="text-sm font-black tracking-[-0.02em]">
              Tip de compra
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
              El envío va gratis tanto con pago anticipado como con pago contra
              entrega.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes mfStoreFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }

          @keyframes mfStoreSoftFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }

          @keyframes mfStoreGlow {
            0%, 100% {
              opacity: 0.55;
              transform: scale(1);
            }
            50% {
              opacity: 0.88;
              transform: scale(1.06);
            }
          }

          @keyframes mfStoreShine {
            0% {
              transform: translateX(-130%) skewX(-18deg);
            }
            70%, 100% {
              transform: translateX(245%) skewX(-18deg);
            }
          }

          @keyframes mfStoreSpark {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scale(1);
            }
            50% {
              transform: translateY(-2px) rotate(8deg) scale(1.08);
            }
          }

          @keyframes mfStorePulseRing {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
            }
            50% {
              box-shadow: 0 0 0 9px rgba(249, 115, 22, 0);
            }
          }

          .mf-store-float {
            animation: mfStoreFloat 6.2s ease-in-out infinite;
          }

          .mf-store-soft-float {
            animation: mfStoreSoftFloat 5.5s ease-in-out infinite;
          }

          .mf-store-glow {
            animation: mfStoreGlow 5.8s ease-in-out infinite;
          }

          .mf-store-spark {
            animation: mfStoreSpark 1.9s ease-in-out infinite;
          }

          .mf-store-pulse-ring {
            animation: mfStorePulseRing 2.8s ease-in-out infinite;
          }

          .mf-store-shine::before {
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
            animation: mfStoreShine 6.2s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .mf-store-float,
            .mf-store-soft-float,
            .mf-store-glow,
            .mf-store-spark,
            .mf-store-pulse-ring,
            .mf-store-shine::before {
              animation-duration: 0.001ms;
              animation-iteration-count: 1;
            }
          }
        `}
      </style>

      <Helmet>
        <title>Tienda | Modo Fácil</title>
        <meta
          name="description"
          content="Explora productos útiles para hogar, cocina, bienestar, tecnología, auto y herramientas. Envío gratis a toda Colombia y pago contra entrega disponible."
        />
      </Helmet>

      <TopBar />
      <Header />

      <main className="mf-page">
        <section className="relative isolate overflow-hidden border-b border-border/70 py-14 md:py-20">
          <div className="absolute inset-0 -z-10 bg-hero-gradient" />
          <div className="absolute inset-0 -z-10 bg-soft-grid bg-grid opacity-[0.22]" />
          <div className="mf-store-glow absolute right-[-8rem] top-[-7rem] -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="mf-store-glow absolute left-[-8rem] bottom-[-7rem] -z-10 h-80 w-80 rounded-full bg-secondary/20 blur-3xl [animation-delay:1.1s]" />

          <div className="mf-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mf-store-pulse-ring mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-soft/80 px-4 py-2 text-sm font-black text-primary"
            >
              <span className="mf-live-dot" />
              Catálogo activo para Colombia
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.04 }}
              className="mf-title mx-auto max-w-4xl text-5xl md:text-7xl"
            >
              Explora productos que hacen tu vida{" "}
              <span className="mf-highlight">más fácil.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mf-subtitle mx-auto mt-5 max-w-2xl text-base md:text-lg"
            >
              Hogar, cocina, bienestar, tecnología, auto y combos con ahorro.
              Todo pensado para comprar fácil, recibir en casa y pagar como
              prefieras.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mx-auto mt-8 max-w-3xl"
            >
              <div className="mf-search mf-store-float relative flex items-center gap-3 overflow-hidden px-4">
                <div className="mf-store-shine pointer-events-none absolute inset-0 overflow-hidden opacity-70" />

                <Search className="relative z-10 h-6 w-6 shrink-0 text-primary" />

                <Input
                  type="text"
                  placeholder="Busca: pilates, proyector, wafflera, auto, hogar..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setVisibleCount(12);
                  }}
                  className="relative z-10 h-14 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 md:text-lg"
                />

                {search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setVisibleCount(12);
                    }}
                    className="relative z-10 rounded-full text-muted-foreground hover:bg-muted"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Limpiar
                  </Button>
                )}
              </div>
            </motion.div>

            <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2">
              {trustChips.map((chip, index) => {
                const Icon = chip.icon;

                return (
                  <div
                    key={chip.label}
                    className="mf-trust-pill mf-store-soft-float"
                    style={{ animationDelay: `${index * 0.22}s` }}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{chip.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative -mt-5 z-10">
          <div className="mf-container">
            <div className="grid gap-3 rounded-[1.8rem] border border-border/75 bg-card/86 p-4 shadow-premium-md backdrop-blur-xl md:grid-cols-3">
              {[
                {
                  icon: Flame,
                  title: "Productos útiles",
                  text: "selección para uso real",
                  className: "bg-primary-soft/60",
                  iconClass: "bg-primary text-primary-foreground shadow-orange",
                },
                {
                  icon: PackageCheck,
                  title: "Contra entrega",
                  text: "paga cuando recibes",
                  className: "bg-secondary-soft/70",
                  iconClass:
                    "bg-secondary text-secondary-foreground shadow-green",
                },
                {
                  icon: Star,
                  title: "Experiencia confiable",
                  text: "soporte y compra clara",
                  className: "bg-accent/20",
                  iconClass: "bg-accent text-accent-foreground",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`mf-store-soft-float flex items-center gap-3 rounded-2xl p-4 ${item.className}`}
                    style={{ animationDelay: `${index * 0.3}s` }}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconClass}`}
                    >
                      <Icon className="mf-store-spark h-5 w-5" />
                    </span>

                    <div>
                      <p className="text-sm font-black tracking-[-0.02em]">
                        {item.title}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mf-section-tight">
          <div className="mf-container">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-10">
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-28 rounded-[1.7rem] border border-border/75 bg-card/88 p-5 shadow-premium-sm backdrop-blur-xl">
                  <FiltersContent />
                </div>
              </aside>

              <main className="lg:col-span-3">
                <div className="mb-6 overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/80 p-4 shadow-premium-xs backdrop-blur-xl">
                  <div className="mf-store-shine pointer-events-none absolute inset-0 overflow-hidden opacity-40" />

                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            className="mf-btn mf-btn-ghost h-11 rounded-full px-4 lg:hidden"
                          >
                            <Filter className="h-4 w-4" />
                            Filtros
                            {activeFiltersCount > 0 && (
                              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-black text-primary-foreground">
                                {activeFiltersCount}
                              </span>
                            )}
                          </Button>
                        </SheetTrigger>

                        <SheetContent
                          side="left"
                          className="w-[315px] overflow-y-auto sm:w-[380px]"
                        >
                          <SheetHeader className="mb-6">
                            <SheetTitle className="text-left font-display text-2xl font-black tracking-[-0.05em]">
                              Filtrar productos
                            </SheetTitle>
                          </SheetHeader>

                          <FiltersContent />
                        </SheetContent>
                      </Sheet>

                      <div className="rounded-full border border-border bg-background px-3 py-2 text-xs font-black text-muted-foreground">
                        {filteredProducts.length} resultados
                      </div>

                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          onClick={clearFilters}
                          className="h-9 rounded-full px-3 text-xs font-black text-primary hover:bg-primary-soft"
                        >
                          Quitar filtros
                        </Button>
                      )}
                    </div>

                    <div className="flex w-full items-center gap-3 sm:w-auto">
                      <span className="hidden text-sm font-black text-muted-foreground sm:inline">
                        Ordenar:
                      </span>

                      <Select
                        value={sortOption}
                        onValueChange={(value) => {
                          setSortOption(value);
                          setVisibleCount(12);
                        }}
                      >
                        <SelectTrigger className="h-11 w-full rounded-full border-border bg-card font-bold shadow-premium-xs sm:w-[220px]">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="recent">Más recientes</SelectItem>
                          <SelectItem value="best-seller">
                            Más vendidos
                          </SelectItem>
                          <SelectItem value="offers">
                            Mejores ofertas
                          </SelectItem>
                          <SelectItem value="price-asc">
                            Menor precio
                          </SelectItem>
                          <SelectItem value="price-desc">
                            Mayor precio
                          </SelectItem>
                          <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="relative mt-4 flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary"
                      >
                        {tag}
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ))}

                    {selectedCategories.map((categoryId) => {
                      const category = categories.find(
                        (item) => item.id === categoryId
                      );

                      if (!category) return null;

                      return (
                        <button
                          key={categoryId}
                          type="button"
                          onClick={() => toggleCategory(categoryId)}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-3 py-1.5 text-xs font-black text-secondary-deep"
                        >
                          {category.name}
                          <X className="h-3.5 w-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-[1.7rem] border border-border bg-card p-4 shadow-premium-xs"
                      >
                        <div className="mf-skeleton aspect-[4/3] rounded-2xl" />
                        <div className="mt-4 space-y-3">
                          <div className="mf-skeleton h-5 w-3/4" />
                          <div className="mf-skeleton h-4 w-full" />
                          <div className="mf-skeleton h-4 w-2/3" />
                          <div className="mf-skeleton h-11 w-full rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[430px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border bg-card/75 px-4 py-20 text-center shadow-premium-xs"
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-muted text-muted-foreground">
                      <PackageX className="h-10 w-10" />
                    </div>

                    <h3 className="font-display text-3xl font-black tracking-[-0.05em]">
                      No encontramos resultados
                    </h3>

                    <p className="mt-3 max-w-md text-base font-medium leading-7 text-muted-foreground">
                      Prueba cambiando los filtros o buscando con otros términos.
                      Seguro hay una solución esperando por ti.
                    </p>

                    <Button
                      size="lg"
                      onClick={clearFilters}
                      className="mf-btn mf-btn-primary mt-8"
                    >
                      Mostrar todos los productos
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      layout
                      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                    >
                      <AnimatePresence>
                        {displayedProducts.map((product, index) => (
                          <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{
                              duration: 0.26,
                              delay: Math.min(index * 0.025, 0.18),
                            }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {visibleCount < filteredProducts.length && (
                      <div className="mt-14 text-center">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() =>
                            setVisibleCount((previous) => previous + 12)
                          }
                          className="mf-btn mf-btn-ghost min-h-[54px] rounded-full px-10 text-base"
                        >
                          Ver más productos
                          <SlidersHorizontal className="h-5 w-5" />
                        </Button>

                        <p className="mt-4 text-sm font-bold text-muted-foreground">
                          Has visto {displayedProducts.length} de{" "}
                          {filteredProducts.length} productos.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </main>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mf-container">
            <div className="relative overflow-hidden rounded-[2rem] bg-orange-gradient p-6 text-white shadow-orange md:p-8">
              <div className="mf-store-shine pointer-events-none absolute inset-0 overflow-hidden opacity-80" />
              <div className="mf-store-glow absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/20 blur-2xl" />

              <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black ring-1 ring-white/20">
                    <CheckCircle2 className="h-4 w-4" />
                    Compra fácil y recibe en casa
                  </div>

                  <h2 className="font-display text-3xl font-black tracking-[-0.05em] md:text-4xl">
                    ¿No sabes cuál elegir?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm font-semibold leading-7 text-white/80">
                    Escríbenos por WhatsApp y te ayudamos a escoger el producto o
                    combo ideal según lo que necesitas.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="mf-btn min-h-[54px] rounded-full bg-white px-6 text-primary hover:bg-white/90"
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hablar por WhatsApp
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </Button>

                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="mf-btn min-h-[54px] rounded-full border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
                  >
                    Seguir explorando
                    <Zap className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default StorePage;
