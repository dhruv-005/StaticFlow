import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: "#080808",
          900: "#0D0D0F",
          800: "#121214",
          700: "#19191D",
          600: "#212126",
          500: "#29292F",
          400: "#3F3F46",
          300: "#52525B",
          200: "#71717A",
          100: "#A1A1AA",
          50: "#F5F5F7",
        },
        crimson: {
          DEFAULT: "#EF233C",
          hover: "#D91E35",
          dark: "#B8172C",
          glow: "rgba(239, 35, 60, 0.16)",
          soft: "rgba(239, 35, 60, 0.08)",
          muted: "rgba(239, 35, 60, 0.04)",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        pill: "9999px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(239, 35, 60, 0.15)",
        "glow-lg": "0 0 40px rgba(239, 35, 60, 0.2)",
        "glow-sm": "0 0 10px rgba(239, 35, 60, 0.1)",
        card: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(239, 35, 60, 0.12) 0%, transparent 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(239, 35, 60, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(239, 35, 60, 0.25)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
