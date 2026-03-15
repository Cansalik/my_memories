import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1D3A",
          light: "#112347",
          deep: "#070F1E",
        },
        gold: {
          DEFAULT: "#F5D27A",
          light: "#FAE4A4",
          dim: "#C9A84C",
        },
        cream: {
          DEFAULT: "#FFF7E6",
          dim: "#F5E8CC",
        },
        rose: "#E8A4B8",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        lato: ["var(--font-lato)", "system-ui", "sans-serif"],
      },
      animation: {
        "twinkle": "twinkle 3s ease-in-out infinite",
        "twinkle-slow": "twinkle 5s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "draw-line": "drawLine 2s ease-in-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "shooting-star": "shootingStar 3s ease-in-out infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 10px 2px rgba(245, 210, 122, 0.3)" },
          "50%": { boxShadow: "0 0 25px 8px rgba(245, 210, 122, 0.7)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shootingStar: {
          "0%": { transform: "translateX(0) translateY(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateX(300px) translateY(200px)", opacity: "0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
