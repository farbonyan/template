import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";
import fluid, { extract, fontSize, screens } from "fluid-tailwind";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: {
    files: ["src/**/*.{ts,tsx}"],
    extract,
  },
  theme: {
    screens,
    fontSize: Object.fromEntries(
      Object.entries(fontSize).map(([key, [fontSize, lineHeight]]) => {
        return [key, [fontSize, `${Number.parseInt(lineHeight) * 1}rem`]];
      }),
    ),
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1800px",
      },
    },
    extend: {
      colors: {
        link: "hsl(var(--link))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        dashboard: "hsl(var(--dashboard))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        action: {
          DEFAULT: "hsl(var(--action))",
          foreground: "hsl(var(--action-foreground))",
        },
        highlight: {
          DEFAULT: "hsl(var(--highlight))",
          foreground: "hsl(var(--highlight-foreground))",
        },
        alert: {
          DEFAULT: "hsl(var(--alert))",
          foreground: "hsl(var(--alert-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        tab: {
          DEFAULT: "hsl(var(--tab))",
          foreground: "hsl(var(--tab-foreground))",
          active: {
            DEFAULT: "hsl(var(--tab-active))",
            foreground: "hsl(var(--tab-active-foreground))",
          },
        },
        input: {
          DEFAULT: "hsl(var(--input))",
          border: "hsl(var(--input-border))",
        },
        header: {
          DEFAULT: "hsl(var(--header))",
          foreground: "hsl(var(--header-foreground))",
        },
        scrollbar: "hsl(var(--scrollbar))",
        table: {
          header: "hsl(var(--table-header))",
          row: {
            active: "hsl(var(--table-row-active))",
          },
          checkbox: {
            active: "hsl(var(--table-checkbox-active))",
          },
        },
        badge: {
          success: {
            DEFAULT: "hsl(var(--badge-success))",
            foreground: "hsl(var(--badge-success-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--badge-destructive))",
            foreground: "hsl(var(--badge-destructive-foreground))",
          },
          pink: {
            DEFAULT: "hsl(var(--badge-pink))",
            foreground: "hsl(var(--badge-pink-foreground))",
          },
          blue: {
            DEFAULT: "hsl(var(--badge-blue))",
            foreground: "hsl(var(--badge-blue-foreground))",
          },
          lightblue: {
            DEFAULT: "hsl(var(--badge-lightblue))",
            foreground: "hsl(var(--badge-lightblue-foreground))",
          },
          purple: {
            DEFAULT: "hsl(var(--badge-purple))",
            foreground: "hsl(var(--badge-purple-foreground))",
          },
        },
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      transitionDuration: {
        "2000": "2000ms",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden",
          },
          "100%": {
            width: "100%",
          },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-75%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-20deg)",
            transformOrigin: "12px 4px",
          },
          "50%": { transform: "rotate(20deg)", transformOrigin: "12px 4px" },
        },
        snapped: {
          "0%": {
            opacity: "1",
            transform: "scale(1) rotate(0deg)",
            filter: "blur(0)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.8) translate(20px, 20px)",
            filter: "blur(12px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "antenna-move": "wiggle 0.6s ease-in-out infinite",
        typing: "typing 2s steps(20) forward alternate",
        "snap-fade": "snapped 0.7s forwards ease-in-out",
      },
    },
  },
  plugins: [
    animate,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ({ addUtilities }: PluginAPI) => {
      addUtilities({
        ".writing-tb": {
          writingMode: "tb",
        },
        ".writing-rl": {
          writingMode: "rl",
        },
        ".writing-lr": {
          writingMode: "lr",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        "@-moz-document url-prefix()": {
          ".disable-animation": {
            animation: "none !important",
          },
        },
      });
    },
    fluid,
  ],
} satisfies Config;
