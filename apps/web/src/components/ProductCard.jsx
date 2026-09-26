import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  MessageCircle,
  Tag,
  Star,
  Truck,
  PackageCheck,
  ShieldCheck,
  Eye,
  BadgePercent,
  Sparkles,
  CreditCard,
  ArrowRight,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCart } from "@/contexts/CartContext.jsx";
import { useSettings } from "@/hooks/useSettings";
import { generateProductInquiry } from "@/services/whatsappService";
import { getTiersArray } from "@/hooks/useProductPricing.js";
import pb from "@/lib/pocketbaseClient";

const fallbackImage =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&auto=format&fit=crop&q=80";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const getProductSlug = (product) => {
  return product?.slug || product?.id || "#";
};

const getProductImage = (product) => {
  if (product?.images && product.images.length > 0) {
    return pb.files.getURL(product, product.images[0]);
  }

  if (product?.image) {
    return product.image;
  }

  return fallbackImage;
};

const getDiscount = (price, oldPrice) => {
  const current = Number(price || 0);
  const old = Number(oldPrice || 0);

  if (!old || old <= current) return 0;

  return Math.round(((old - current) / old) * 100);
};

const getSoftRating = (product) => {
  if (product?.rating) return Number(product.rating).toFixed(1);

  const name = product?.name || "";
  const seed = name.length % 4;

  return (4.6 + seed * 0.1).toFixed(1);
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const imageUrl = getProductImage(product);
  const productPath = `/product/${getProductSlug(product)}`;
  const discount = getDiscount(product?.price, product?.oldPrice);
  const tiers = getTiersArray(product);
  const hasTiers = tiers.length > 1;
  const rating = getSoftRating(product);

  const topTags = useMemo(() => {
    const productTags = Array.isArray(product?.tags) ? product.tags : [];
    return productTags.slice(0, 2);
  }, [product?.tags]);

  const hasStock = product?.stock === undefined || Number(product?.stock) > 0;

  const stockIsLow =
    product?.stock !== undefined &&
    Number(product?.stock) > 0 &&
    Number(product?.stock) <= 5;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
  };

  return (
    <>
      <style>
        {`
          @keyframes mfProductFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }

          @keyframes mfProductImageLife {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.025);
            }
          }

          @keyframes mfProductBadgePulse {
            0%, 100% {
              transform: scale(1);
              filter: brightness(1);
            }
            50% {
              transform: scale(1.045);
              filter: brightness(1.08);
            }
          }

          @keyframes mfProductShine {
            0% {
              transform: translateX(-130%) skewX(-18deg);
            }
            70%, 100% {
              transform: translateX(240%) skewX(-18deg);
            }
          }

          @keyframes mfProductDot {
            0%, 100% {
              opacity: 0.75;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.35);
            }
          }

          .mf-product-card-live {
            animation: mfProductFloat 5.5s ease-in-out infinite;
          }

          .mf-product-image-live {
            animation: mfProductImageLife 8s ease-in-out infinite;
          }

          .mf-product-badge-live {
            animation: mfProductBadgePulse 2.3s ease-in-out infinite;
          }

          .mf-product-shine-live::before {
            content: "";
            position: absolute;
            inset-y: -30%;
            left: 0;
            width: 75px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.24),
              transparent
            );
            animation: mfProductShine 5.8s ease-in-out infinite;
          }

          .mf-product-dot-live {
            animation: mfProductDot 1.7s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .mf-product-card-live,
            .mf-product-image-live,
            .mf-product-badge-live,
            .mf-product-shine-live::before,
            .mf-product-dot-live {
              animation-duration: 0.001ms;
              animation-iteration-count: 1;
            }
          }
        `}
      </style>

      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mf-product-card mf-product-card-live group relative flex h-full flex-col overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <Link
          to={productPath}
          className="block"
          aria-label={`Ver producto ${product?.name || "producto"}`}
        >
          <div className="mf-product-image-wrap relative aspect-[4/3] overflow-hidden">
            <img
              src={imageUrl}
              alt={product?.name || "Producto de Modo Fácil"}
              className="mf-product-image mf-product-image-live h-full w-full object-cover transition-transform duration-[2200ms] ease-out group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/8 to-transparent opacity-80" />

            <div className="mf-product-shine-live pointer-events-none absolute inset-0 overflow-hidden opacity-90" />

            <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
              {discount > 0 && (
                <Badge className="mf-badge mf-badge-hot mf-product-badge-live border-0 px-2.5 py-1 shadow-lg">
                  <BadgePercent className="h-3 w-3" />
                  -{discount}%
                </Badge>
              )}

              {topTags.length > 0 ? (
                topTags.map((tag, idx) => (
                  <Badge
                    key={`${tag}-${idx}`}
                    className="border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-black text-foreground shadow-premium-xs backdrop-blur-md"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <Badge className="border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-black text-foreground shadow-premium-xs backdrop-blur-md">
                  Producto útil
                </Badge>
              )}
            </div>

            <div className="absolute right-3 top-3">
              <div className="mf-product-badge-live flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-[11px] font-black text-foreground shadow-premium-xs backdrop-blur-md">
                <PackageCheck className="h-3.5 w-3.5 text-primary" />
                Paga al recibir
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <div className="rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-black text-foreground shadow-premium-xs backdrop-blur-md">
                Envío gratis
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/92 text-primary shadow-premium-xs backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                <Eye className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="mf-rating text-xs">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span>{rating}</span>
              <span className="font-semibold text-muted-foreground">
                ({product?.reviews || "clientes"})
              </span>
            </div>

            {stockIsLow ? (
              <span className="mf-stock-chip">
                <span className="mf-live-dot mf-product-dot-live h-1.5 w-1.5" />
                Pocas unidades
              </span>
            ) : (
              <span className="mf-badge mf-badge-soft">
                <ShieldCheck className="h-3 w-3" />
                Verificado
              </span>
            )}
          </div>

          <Link to={productPath}>
            <h3 className="line-clamp-2 font-display text-xl font-black leading-tight tracking-[-0.045em] transition-colors duration-200 group-hover:text-primary">
              {product?.name || "Producto Modo Fácil"}
            </h3>
          </Link>

          {product?.benefit ? (
            <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-muted-foreground">
              {product.benefit}
            </p>
          ) : (
            <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-muted-foreground">
              Solución práctica para hacer tu día a día más fácil, útil y cómodo.
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-primary-soft/70 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-primary-deep">
                <CreditCard className="h-3.5 w-3.5" />
                Envío gratis
              </div>
              <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                pagando anticipado
              </p>
            </div>

            <div className="rounded-2xl bg-secondary-soft/70 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-secondary-deep">
                <Truck className="h-3.5 w-3.5" />
                Colombia
              </div>
              <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                recibe en casa
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-4 flex items-end justify-between gap-3 border-t border-border/55 pt-4">
              <div className="min-w-0">
                <span className="mb-0.5 block text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Desde
                </span>

                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="mf-price-primary text-3xl">
                    {formatCurrency(product?.price)}
                  </span>

                  {product?.oldPrice && (
                    <span className="mf-price-before text-sm font-bold">
                      {formatCurrency(product.oldPrice)}
                    </span>
                  )}
                </div>
              </div>

              {hasTiers && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="mf-badge mf-badge-save shrink-0 cursor-help border-0"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        Paquetes
                      </button>
                    </TooltipTrigger>

                    <TooltipContent side="top" className="max-w-[290px] p-3">
                      <p className="mb-1 text-sm font-black">
                        Precios por cantidad
                      </p>

                      <p className="mb-3 text-xs font-semibold text-muted-foreground">
                        Valor total del paquete. No se multiplica otra vez.
                      </p>

                      <div className="space-y-2">
                        {tiers.map((tier) => (
                          <div
                            key={`${tier.label}-${tier.qty}`}
                            className="rounded-xl border border-border bg-muted/35 p-2"
                          >
                            <div className="flex items-center justify-between gap-4 text-sm">
                              <span className="font-bold text-foreground">
                                {tier.label}
                              </span>

                              <span className="font-black text-primary">
                                {formatCurrency(tier.totalPrice)}
                              </span>
                            </div>

                            {tier.qty > 1 && (
                              <div className="mt-1 flex items-center justify-between gap-4 text-[11px] font-semibold text-muted-foreground">
                                <span>Aprox. por unidad</span>
                                <span>{formatCurrency(tier.unitPrice)}/u</span>
                              </div>
                            )}

                            {tier.savings > 0 && (
                              <div className="mt-1 inline-flex rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-black text-accent-foreground">
                                Ahorras {formatCurrency(tier.savings)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={!hasStock}
                className="mf-btn mf-btn-primary group/btn h-11 overflow-hidden rounded-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover/btn:-rotate-6 group-hover/btn:scale-110" />
                {hasStock ? "Agregar" : "Agotado"}
                {hasStock && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                )}
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="mf-btn mf-btn-whatsapp h-11 w-11 rounded-full border-0 p-0"
              >
                <a
                  href={generateProductInquiry(product, settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Comprar por WhatsApp"
                  aria-label={`Consultar ${
                    product?.name || "producto"
                  } por WhatsApp`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-muted/60 px-3 py-2 text-[11px] font-extrabold text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Compra fácil · soporte por WhatsApp · pago contra entrega
            </div>
          </div>
        </div>
      </motion.article>
    </>
  );
};

export default ProductCard;
