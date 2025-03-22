/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00a7b1",
          dark: "#008b94",
          light: "#4ecbd3",
        },
        secondary: {
          DEFAULT: "#f57f7f",
          dark: "#e66d6d",
          light: "#ff9d9d",
        },
        tertiary: {
          DEFAULT: "#394a7d",
          dark: "#2d3c64",
          light: "#556aa5",
        },
      },
    },
  },
  plugins: [],
};
