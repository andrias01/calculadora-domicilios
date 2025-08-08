/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Importante para encontrar clases de Tailwind en tus componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
