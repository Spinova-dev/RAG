import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f78d2b",
          orange: "#f78d2b",
        },
        teal: {
          DEFAULT: "#34bfc2",
        },
        ink: "#111827",
        muted: "#4b5563",
        border: "#e5e7eb",
        soft: "#f9fafb",
        good: "#16a34a",
        warn: "#f59e0b",
        bad: "#dc2626",
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ['"Cairo"', '"Source Sans Pro"', "sans-serif"],
        brand: ['"Source Sans Pro"', "sans-serif"],
      },
      borderRadius: {
        brand: "14px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0,0,0,0.04)",
        header: "0 2px 14px rgba(0,0,0,0.06)",
        badge: "0 2px 8px rgba(247, 141, 43, 0.25)",
      },
      maxWidth: {
        content: "1200px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        typing: "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

export default config
