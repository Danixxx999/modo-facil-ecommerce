import React from "react";
import {
  ShoppingCart,
  Package,
  BadgePercent,
  Sparkles,
  Truck,
  PackageCheck,
  ShieldCheck,
  Star,
  Gift,
  Zap,
  ArrowRight,
  Flame,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext.jsx";
import pb from "@/lib/pocketbaseClient";

const fallbackImage =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const getComboImage = (combo) => {
  if (combo?.image) {
    return pb.files.getURL(combo, combo.image);
  }

  if (combo?.images && combo.images.length > 0) {
    return pb.files.getURL(combo, combo.images[0]);
  }

  return fallbackImage;
};

const getSavings = (combo) => {
  const oldPrice = Number(combo?.oldPrice || combo?.originalPrice || 0);
  const finalPrice = Number(combo?.finalPrice || combo?.price || 0);

  if (!oldPrice || !finalPrice || oldPrice <= finalPrice) {
    return {
      amount: 0,
      percent: 0,
    };
  }

  const amount = oldPrice - finalPrice;
  const percent = Math.round((amount / oldPrice) * 100);

  return {
    amount,
    percent,
  };
};

const ComboCard = ({ combo }) => {
  const { addComboToCart } = useCart();

  const imageUrl = getComboImage(combo);
  const finalPrice = Number(combo?.finalPrice || combo?.price || 0);
  const oldPrice = Number(combo?.oldPrice || combo?.originalPrice || 0);
  const { amount: savings, percent: savingsPercent } = getSavings(combo);

  const productCount =
    combo?.expand?.products?.length ||
    combo?.products?.length ||
    combo?.items?.length ||
    0;

  const handleAddCombo = () => {
    addComboToCart(combo);
  };

  return (
    <>
      <style>
        {`
          @keyframes mfComboFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          @keyframes mfComboImageLife {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.03);
            }
          }

          @keyframes mfComboBadgePulse {
            0%, 100% {
              transform: scale(1);
              filter: brightness(1);
            }
            50% {
              transform: scale(1.055);
              filter: brightness(1.09);
            }
          }

          @keyframes mfComboShine {
            0% {
              transform: translateX(-135%) skewX(-18deg);
            }
            68%, 100% {
              transform: translateX(250%) skewX(-18deg);
            }
          }

          @keyframes mfComboSpark {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scale(1);
            }
            50% {
              transform: translateY(-2px) rotate(9deg) scale(1.08);
            }
          }

          @keyframes mfComboGlow {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(249, 115, 22, 0);
            }
          }

          .mf-combo-card-live {
            animation: mfComboFloat 5.8s ease-in-out infinite;
          }

          .mf-combo-image-live {
            animation: mfComboImageLife 8.5s ease-in-out infinite;
          }

          .mf-combo-badge-live {
            animation: mfComboBadgePulse 2.2s ease-in-out infinite;
          }

          .mf-combo-spark-live {
            animation: mfComboSpark 1.7s ease-in-out infinite;
          }

          .mf-combo-glow-live {
            animation: mfComboGlow 2.6s ease-in-out infinite;
          }

          .mf-combo-shine-live::before {
            content: "";
            position: absolute;
            inset-y: -30%;
            left: 0;
            width: 80px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.26),
              transparent
            );
            animation: mfComboShine 5.9s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .mf-combo-card-live,
            .mf-combo-image-live,
            .mf-combo-badge-live,
            .mf-combo-spark-live,
            .mf-combo-glow-live,
            .mf-combo-shine-live::before {
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
        className="mf-combo-card mf-combo-card-live group relative flex h-full flex-col overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

        <div className="relative overflow-hidden">
          <div className="mf-product-image-wrap aspect-[4/3]">
            <img
              src={imageUrl}
              alt={combo?.name || "Combo Modo Fácil"}
              className="mf-product-image mf-combo-image-live h-full w-full object-cover transition-transform duration-[2200ms] ease-out group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/12 to-transparent" />

            <div className="mf-combo-shine-live pointer-events-none absolute inset-0 overflow-hidden opacity-95" />
          </div>

          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            <Badge className="mf-badge mf-badge-save mf-combo-badge-live border-0 px-2.5 py-1 shadow-lg">
              <Gift className="h-3.5 w-3.5" />
              Combo especial
            </Badge>

            {savingsPercent > 0 && (
              <Badge className="mf-badge mf-badge-hot mf-combo-glow-live border-0 px-2.5 py-1 shadow-lg">
                <BadgePercent className="h-3.5 w-3.5" />
                Ahorra {savingsPercent}%
              </Badge>
            )}
          </div>

          <div className="absolute right-3 top-3">
            <div className="mf-combo-badge-live flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1.5 text-[11px] font-black text-foreground shadow-premium-xs backdrop-blur-md">
              <PackageCheck className="h-3.5 w-3.5 text-primary" />
              Paga al recibir
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/92 px-3 py-2 shadow-premium-xs backdrop-blur-md">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Package className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-foreground">
                    {productCount > 0
                      ? `${productCount} productos incluidos`
                      : "Paquete inteligente"}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    Compra más, paga mejor
                  </p>
                </div>
              </div>

              <div className="mf-rating shrink-0 text-xs">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span>Top</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="mf-badge mf-badge-pay">
              <CreditCard className="h-3 w-3" />
              Envío gratis
            </span>

            <span className="mf-badge mf-badge-soft">
              <ShieldCheck className="h-3 w-3" />
              Verificado
            </span>
          </div>

          <h3 className="font-display text-2xl font-black leading-tight tracking-[-0.05em] transition-colors duration-200 group-hover:text-primary">
            {combo?.name || "Combo Modo Fácil"}
          </h3>

          {combo?.description ? (
            <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-muted-foreground">
              {combo.description}
            </p>
          ) : (
            <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-muted-foreground">
              Paquete pensado para ahorrar más y resolver mejor en una sola
              compra.
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-accent/15 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-accent-foreground">
                <BadgePercent className="h-3.5 w-3.5" />
                Ahorro real
              </div>
              <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                mejor que separado
              </p>
            </div>

            <div className="rounded-2xl bg-secondary-soft/70 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-secondary-deep">
                <Zap className="h-3.5 w-3.5" />
                Más valor
              </div>
              <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                ideal para una sola compra
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-4 border-t border-border/55 pt-4">
              <span className="mb-1 block text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                Precio del combo
              </span>

              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="mf-price-primary text-3xl">
                  {formatCurrency(finalPrice)}
                </span>

                {oldPrice > finalPrice && (
                  <span className="mf-price-before text-sm font-bold">
                    {formatCurrency(oldPrice)}
                  </span>
                )}
              </div>

              {savings > 0 && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-black text-accent-foreground">
                  <Sparkles className="mf-combo-spark-live h-3.5 w-3.5 text-primary" />
                  Ahorras {formatCurrency(savings)}
                </div>
              )}
            </div>

            <Button
              onClick={handleAddCombo}
              className="mf-btn mf-btn-primary group/btn min-h-[48px] w-full overflow-hidden rounded-full text-sm"
            >
              <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover/btn:-rotate-6 group-hover/btn:scale-110" />
              Agregar combo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-extrabold text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-primary" />
              Pago contra entrega disponible · soporte por WhatsApp
            </p>
          </div>
        </div>
      </motion.article>
    </>
  );
};

export default ComboCard;
