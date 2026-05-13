import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
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

