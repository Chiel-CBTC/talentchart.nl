import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F1F3D",
        teal: "#0D9488",
        offwhite: "#F8F9FA",
      },
    },
  },
  plugins: [],
};

export default config;
