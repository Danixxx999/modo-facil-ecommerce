import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  PackageOpen,
  Sparkles,
  ArrowRight,
  Grid3X3,
  Truck,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import TopBar from "@/components/TopBar.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { useCategory } from "@/hooks/useCategories.js";
import { useProducts } from "@/hooks/useProducts.js";
import pb from "@/lib/pocketbaseClient.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1600&auto=format&fit=crop&q=90";

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("es-CO");
};

const CategoryPage = () => {
  const { slug } = useParams();

  const { category, loading: categoryLoading } = useCategory(slug);
  const { products, loading: productsLoading } = useProducts({
    category: category?.id,
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const pageTitle = category?.name
    ? `${category.name} | Modo Fácil`
    : "Categoría | Modo Fácil";

  const imageUrl = category?.image
    ? pb.files.getURL(category, category.image)
    : fallbackImage;

  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    let result = Array.isArray(products) ? [...products] : [];

    if (searchValue) {
      result = result.filter((product) => {
        const text = `${product.name || ""} ${product.description || ""} ${
          product.benefit || ""
        } ${Array.isArray(product.tags) ? product.tags.join(" ") : ""}`;

        return text.toLowerCase().includes(searchValue);
      });
    }

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sort === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sort === "newest") {
      result.sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0));
    }

    return result;
  }, [products, search, sort]);

  if (categoryLoading) {
    return (
      <>
        <Helmet>
          <title>Categoría | Modo Fácil</title>
        </Helmet>

        <TopBar />
        <Header />

        <main className="mf-page">
          <div className="mf-container flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="font-semibold text-muted-foreground">
                Cargando categoría...
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Helmet>
          <title>Categoría no encontrada | Modo Fácil</title>
        </Helmet>

        <TopBar />
        <Header />

        <main className="mf-page">
          <div className="mf-container flex min-h-[70vh] items-center justify-center">
            <div className="mf-card max-w-xl p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <PackageOpen className="h-8 w-8" />
              </div>

              <h1 className="font-display text-4xl font-black tracking-[-0.06em]">
                Categoría no encontrada
              </h1>

              <p className="mt-3 font-semibold text-muted-foreground">
                Puede que esta categoría ya no esté disponible o que el enlace no
                sea correcto.
              </p>

              <Button asChild className="mf-btn mf-btn-primary mt-6">
                <Link to="/store">
                  Volver a la tienda
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            category.description || `Explora productos de ${category.name}`
          }
        />
      </Helmet>

      <TopBar />
      <Header />

      <main className="mf-page">
        {/* IMAGEN PROTAGONISTA */}
        <section className="relative bg-background">
          <div className="relative h-[68vh] min-h-[440px] overflow-hidden md:h-[76vh]">
            <img
              src={imageUrl}
              alt={category.name}
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/40 to-transparent" />

            <div className="absolute left-4 top-5 z-10 sm:left-8">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/15 text-white backdrop-blur-xl hover:bg-white/25 hover:text-white"
              >
                <Link to="/store">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Volver
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* INFO DE CATEGORÍA ABAJO, SIN TAPAR IMAGEN */}
        <section className="relative -mt-16 z-10">
          <div className="mf-container">
            <div className="mf-card overflow-hidden p-5 md:p-7">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.65fr] lg:items-end">
                <div>
                  <div className="mf-kicker mb-4">
                    <Sparkles className="h-4 w-4" />
                    Categoría seleccionada
                  </div>

                  <h1 className="font-display text-5xl font-black leading-[0.94] tracking-[-0.075em] text-foreground md:text-7xl">
                    {category.name}
                  </h1>

                  {category.description && (
                    <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-muted-foreground md:text-lg">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-2xl bg-primary-soft p-4 text-primary">
                    <Grid3X3 className="mb-2 h-5 w-5" />
                    <p className="text-2xl font-black">
                      {formatNumber(products?.length || 0)}
                    </p>
                    <p className="text-xs font-black uppercase tracking-[0.12em] opacity-80">
                      Productos
                    </p>
                  </div>

                  <div className="rounded-2xl bg-secondary-soft p-4 text-secondary-deep">
                    <Truck className="mb-2 h-5 w-5" />
                    <p className="font-black">Envíos Colombia</p>
                    <p className="text-xs font-bold opacity-80">
                      Según cobertura
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted p-4 text-foreground">
                    <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
                    <p className="font-black">Compra segura</p>
                    <p className="text-xs font-bold text-muted-foreground">
                      Soporte por WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="mt-6 rounded-[1.5rem] border border-border bg-card/80 p-4 shadow-sm backdrop-blur">
              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={`Buscar dentro de ${category.name}...`}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/35 px-3 py-2 text-sm font-bold text-muted-foreground">
                  <SlidersHorizontal className="h-4 w-4" />
                  Ordenar
                </div>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="h-11 rounded-xl border border-border bg-background px-4 text-sm font-bold outline-none"
                >
                  <option value="featured">Destacados</option>
                  <option value="newest">Más recientes</option>
                  <option value="price-low">Menor precio</option>
                  <option value="price-high">Mayor precio</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTOS */}
        <section className="mf-section pt-10">
          <div className="mf-container">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">
                  Productos disponibles
                </p>

                <h2 className="mt-2 font-display text-4xl font-black tracking-[-0.06em]">
                  Explora esta selección
                </h2>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold text-muted-foreground">
                <CreditCard className="h-4 w-4 text-primary" />
                Envío gratis con cualquier método
              </div>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-[430px] animate-pulse rounded-[1.7rem] bg-muted"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="mf-card mx-auto max-w-2xl p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <PackageOpen className="h-8 w-8" />
                </div>

                <h3 className="font-display text-4xl font-black tracking-[-0.06em]">
                  No encontramos productos
                </h3>

                <p className="mt-3 font-semibold text-muted-foreground">
                  No hay productos disponibles con esta búsqueda en esta
                  categoría.
                </p>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="mf-btn"
                    onClick={() => {
                      setSearch("");
                      setSort("featured");
                    }}
                  >
                    Limpiar búsqueda
                  </Button>

                  <Button asChild className="mf-btn mf-btn-primary">
                    <Link to="/store">
                      Ver toda la tienda
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CategoryPage;
