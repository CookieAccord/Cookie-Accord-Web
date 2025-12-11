/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%":   { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        "shimmer-once": "shimmer 2.2s ease-out 1",
      },
    },
  },
  plugins: [],
};
