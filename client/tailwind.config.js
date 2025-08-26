/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Añadimos 'Fredoka' como la fuente principal de la app
        sans: ["Fredoka", "sans-serif"],
      },
    },
  },
  plugins: [],
};
