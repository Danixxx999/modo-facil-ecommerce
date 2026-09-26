import React from "react";
import {
  CreditCard,
  Truck,
  Phone,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  Banknote,
  Zap,
  MessageCircle,
  BadgePercent,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const normalizeWhatsApp = (value) => {
  const clean = String(value || "").replace(/[^\d]/g, "");
  if (!clean) return "";
  return clean.startsWith("57") ? clean : `57${clean}`;
};

const TopBar = () => {
  const { settings } = useSettings();

  const whatsapp = normalizeWhatsApp(
    settings?.whatsApp || settings?.whatsapp || settings?.phone
  );

  const items = [
    {
      icon: CreditCard,
      text: "Envío GRATIS en todos los pedidos",
      highlight: true,
    },
    {
      icon: Banknote,
      text: "Pago contra entrega disponible",
    },
    {
      icon: PackageCheck,
      text: "Sin recargo por pago contra entrega",
    },
    {
      icon: Truck,
      text: "Envíos a toda Colombia",
    },
    {
      icon: ShieldCheck,
      text: "Compra segura y productos verificados",
    },
    {
      icon: BadgePercent,
      text: "Combos con ahorro real",
    },
    {
      icon: Zap,
      text: "Productos útiles para hacer tu vida más fácil",
    },
  ];

  if (whatsapp) {
    items.push({
      icon: MessageCircle,
      text: `Atención por WhatsApp: ${whatsapp}`,
      whatsapp: true,
    });
  } else {
    items.push({
      icon: Phone,
      text: "Soporte rápido antes de comprar",
    });
  }

  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <>
      <style>
        {`
          @keyframes mfTopbarMove {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes mfTopbarPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.85;
            }
            50% {
              transform: scale(1.18);
              opacity: 1;
            }
          }

          @keyframes mfTopbarShine {
            0% {
              transform: translateX(-120%) skewX(-18deg);
            }
            55%, 100% {
              transform: translateX(260%) skewX(-18deg);
            }
          }

          @keyframes mfTopbarSpark {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scale(1);
            }
            50% {
              transform: translateY(-2px) rotate(8deg) scale(1.08);
            }
          }

          .mf-topbar-track-live {
            animation: mfTopbarMove 58s linear infinite;
            will-change: transform;
          }

          .mf-topbar-shell-live:hover .mf-topbar-track-live {
            animation-play-state: paused;
          }

          .mf-topbar-shine-live::before {
            content: "";
            position: absolute;
            top: -60%;
            left: 0;
            width: 90px;
            height: 220%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.32),
              transparent
            );
            animation: mfTopbarShine 5.2s ease-in-out infinite;
          }

          .mf-topbar-dot-live {
            animation: mfTopbarPulse 1.8s ease-in-out infinite;
          }

          .mf-topbar-spark-live {
            animation: mfTopbarSpark 1.35s ease-in-out infinite;
          }

          @media (max-width: 640px) {
            .mf-topbar-track-live {
              animation-duration: 57s;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .mf-topbar-track-live,
            .mf-topbar-dot-live,
            .mf-topbar-spark-live,
            .mf-topbar-shine-live::before {
              animation-duration: 0.001ms;
              animation-iteration-count: 1;
            }
          }
        `}
      </style>

      <div className="mf-topbar-shell-live relative z-50 overflow-hidden border-b border-white/20 bg-orange-gradient text-white shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.14),transparent_30%)]" />

        <div className="mf-topbar-shine-live pointer-events-none absolute inset-0 z-10 overflow-hidden" />

        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-primary via-primary/80 to-transparent" />

        <div className="relative z-[15] flex h-10 w-full items-center overflow-hidden md:h-11">
          <div className="mf-topbar-track-live flex w-max items-center whitespace-nowrap">
            {marqueeItems.map((item, index) => {
              const Icon = item.icon;
              const isFreeShipping = item.text.includes("GRATIS");

              return (
                <div
                  key={`${item.text}-${index}`}
                  className="flex shrink-0 items-center gap-2 px-5 text-[12px] font-black uppercase tracking-[0.105em] text-white md:px-8 md:text-[13px]"
                >
                  <span
                    className={[
                      "relative flex h-6 w-6 items-center justify-center rounded-full ring-1 shadow-sm",
                      item.highlight
                        ? "bg-white text-primary ring-white/60"
                        : "bg-white/18 text-white ring-white/25",
                    ].join(" ")}
                  >
                    <Icon className="relative z-10 h-3.5 w-3.5" />

                    <span
                      className={[
                        "mf-topbar-dot-live absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full",
                        item.highlight ? "bg-secondary" : "bg-white",
                      ].join(" ")}
                    />
                  </span>

                  <span className="whitespace-nowrap drop-shadow-sm">
                    {isFreeShipping ? (
                      <strong className="font-black text-white">
                        Envío GRATIS en todos los pedidos
                      </strong>
                    ) : (
                      item.text
                    )}
                  </span>

                  {item.highlight ? (
                    <Sparkles className="mf-topbar-spark-live h-3.5 w-3.5 text-white" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
