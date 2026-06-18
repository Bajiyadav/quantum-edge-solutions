import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: { 300: "#7DD3FC", 400: "#38BDF8", 500: "#0EA5E9", 600: "#0284C7" },
        gold: { 300: "#FCD34D", 400: "#F59E0B", 500: "#D97706" },
        ink: { DEFAULT: "#F0F8FF", muted: "#94AABB", dim: "#5A7A9A" },
        bg: { DEFAULT: "#020B18", alt: "#050F1E" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 2s ease-in-out infinite",
        "float-1": "float1 4s ease-in-out infinite",
        "float-2": "float2 5s ease-in-out infinite",
        "scroll-x": "scroll 20s linear infinite",
        "scroll-x-slow": "tscroll 30s linear infinite",
        "float-main": "floatMain 6s ease-in-out infinite",
      },
      keyframes: {
        floatMain: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        float1: { "0%,100%": { transform: "translateY(0) rotate(-2deg)" }, "50%": { transform: "translateY(-8px) rotate(-2deg)" } },
        float2: { "0%,100%": { transform: "translateY(0) rotate(2deg)" }, "50%": { transform: "translateY(-10px) rotate(2deg)" } },
        scroll: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        tscroll: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};
export default config;
