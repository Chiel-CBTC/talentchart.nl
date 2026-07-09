import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F1F3D",
        teal: "#0A7A70",
        "teal-light": "#14B8A6",
        offwhite: "#F8F9FA",
      },
    },
  },
  plugins: [],
};

export default config;
