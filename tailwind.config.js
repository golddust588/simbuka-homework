/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      mobile: "360px",
      sm: "600px",
      md: "769px",
      lg: "1020px",
      xl: "1200px",
      "2xl": "1400px",
      "3xl": "1600px",
    },
  },
  plugins: [],
};
