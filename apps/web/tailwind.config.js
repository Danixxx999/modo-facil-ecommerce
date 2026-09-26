/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.25rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1180px",
        "2xl": "1320px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
          deep: "hsl(var(--primary-deep))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          soft: "hsl(var(--secondary-soft))",
          deep: "hsl(var(--secondary-deep))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },

        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        admin: {
          bg: "hsl(var(--admin-bg))",
          card: "hsl(var(--admin-card))",
          border: "hsl(var(--admin-border))",
          sidebar: "hsl(var(--admin-sidebar))",
          "sidebar-foreground": "hsl(var(--admin-sidebar-foreground))",
          "sidebar-hover": "hsl(var(--admin-sidebar-hover))",
          header: "hsl(var(--admin-header))",
        },

        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      borderRadius: {
        xs: "0.5rem",
        sm: "calc(var(--radius) - 0.45rem)",
        md: "calc(var(--radius) - 0.25rem)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 0.25rem)",
        "2xl": "calc(var(--radius) + 0.55rem)",
        "3xl": "calc(var(--radius) + 1rem)",
        "4xl": "2rem",
      },

      boxShadow: {
        "premium-xs": "var(--shadow-xs)",
        "premium-sm": "var(--shadow-sm)",
        "premium-md": "var(--shadow-md)",
        "premium-lg": "var(--shadow-lg)",
        orange: "var(--shadow-orange)",
        green: "var(--shadow-green)",
        glow: "0 0 0 6px hsl(var(--primary) / 0.09), 0 18px 36px hsl(var(--primary) / 0.18)",
        "glow-green": "0 0 0 6px hsl(var(--secondary) / 0.09), 0 18px 36px hsl(var(--secondary) / 0.18)",
      },

      backgroundImage: {
        "page-gradient": "var(--gradient-page)",
        "hero-gradient": "var(--gradient-hero)",
        "orange-gradient": "var(--gradient-orange)",
        "green-gradient": "var(--gradient-green)",
        "gold-gradient": "var(--gradient-gold)",
        "soft-grid":
          "linear-gradient(to right, hsl(var(--border) / 0.35) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.35) 1px, transparent 1px)",
        "radial-orange":
          "radial-gradient(circle at top left, hsl(var(--primary) / 0.20), transparent 34rem)",
        "radial-green":
          "radial-gradient(circle at top right, hsl(var(--secondary) / 0.18), transparent 30rem)",
      },

      backgroundSize: {
        grid: "42px 42px",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },

      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      transitionTimingFunction: {
  premium: "cubic-bezier(0.22, 1, 0.36, 1)",
  "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
},

      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },

        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },

        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },

        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(18px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "fade-down": {
          from: {
            opacity: "0",
            transform: "translateY(-14px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "scale-in": {
          from: {
            opacity: "0",
            transform: "scale(0.96)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-9px)",
          },
        },

        "float-soft": {
          "0%, 100%": {
            transform: "translate3d(0, 0, 0) rotate(0deg)",
          },
          "50%": {
            transform: "translate3d(0, -6px, 0) rotate(0.6deg)",
          },
        },

        "pulse-soft": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 hsl(var(--primary) / 0.24)",
          },
          "50%": {
            boxShadow: "0 0 0 10px hsl(var(--primary) / 0)",
          },
        },

        "pulse-green": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 hsl(var(--secondary) / 0.22)",
          },
          "50%": {
            boxShadow: "0 0 0 10px hsl(var(--secondary) / 0)",
          },
        },

        "ping-soft": {
          "0%": {
            opacity: "0.75",
            transform: "scale(0.72)",
          },
          "80%, 100%": {
            opacity: "0",
            transform: "scale(1.45)",
          },
        },

        shimmer: {
          "0%": {
            transform: "translateX(-120%)",
          },
          "45%, 100%": {
            transform: "translateX(120%)",
          },
        },

        "shimmer-bg": {
          "0%": {
            backgroundPosition: "-700px 0",
          },
          "100%": {
            backgroundPosition: "700px 0",
          },
        },

        rotate: {
          to: {
            transform: "rotate(360deg)",
          },
        },

        marquee: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-50%)",
          },
        },

        "bounce-tiny": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "45%": {
            transform: "translateY(-3px)",
          },
        },

        wiggle: {
          "0%, 100%": {
            transform: "rotate(0)",
          },
          "25%": {
            transform: "rotate(1.2deg)",
          },
          "75%": {
            transform: "rotate(-1.2deg)",
          },
        },

        "cart-pop": {
          "0%": {
            transform: "scale(1)",
          },
          "35%": {
            transform: "scale(1.12) rotate(-2deg)",
          },
          "70%": {
            transform: "scale(0.98) rotate(1deg)",
          },
          "100%": {
            transform: "scale(1) rotate(0)",
          },
        },

        "price-pop": {
          "0%": {
            opacity: "0",
            transform: "translateY(8px) scale(0.96)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },

        "slide-in-right": {
          from: {
            opacity: "0",
            transform: "translateX(18px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        "slide-in-left": {
          from: {
            opacity: "0",
            transform: "translateX(-18px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.22s ease-out",
        "accordion-up": "accordion-up 0.22s ease-out",

        "fade-in": "fade-in 0.42s ease-out forwards",
        "fade-up": "fade-up 0.58s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-down": "fade-down 0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "scale-in": "scale-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards",

        float: "float 5s ease-in-out infinite",
        "float-soft": "float-soft 6.5s ease-in-out infinite",

        "pulse-soft": "pulse-soft 2.2s ease-in-out infinite",
        "pulse-green": "pulse-green 2.2s ease-in-out infinite",
        "ping-soft": "ping-soft 1.9s ease-out infinite",

        shimmer: "shimmer 4.8s ease-in-out infinite",
        "shimmer-bg": "shimmer-bg 1.45s ease-in-out infinite",

        rotate: "rotate 5s linear infinite",
        marquee: "marquee 22s linear infinite",

        "bounce-tiny": "bounce-tiny 1.8s ease-in-out infinite",
        wiggle: "wiggle 2.8s ease-in-out infinite",

        "cart-pop": "cart-pop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "price-pop": "price-pop 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards",

        "slide-in-right": "slide-in-right 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-left": "slide-in-left 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
