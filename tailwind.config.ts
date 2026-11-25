import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F6F0",
        espresso: "#30251F",
        ink: "#251C17",
        walnut: "#80583F",
        terracotta: "#C87551",
        beige: "#E9E2D6",
        paper: "#FBF7EE",
      },
      fontFamily: {
        display: ["var(--font-black-ops)", "system-ui", "sans-serif"],
        sans: ["var(--font-black-ops)", "system-ui", "sans-serif"],
        reading: ["var(--font-black-ops)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        book: "0 24px 55px -18px rgba(37, 28, 23, 0.55), 0 8px 18px -8px rgba(37, 28, 23, 0.35)",
        card: "0 32px 70px -22px rgba(20, 12, 8, 0.65)",
      },
    },
  },
  plugins: [],
};

export default config;
