/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serifhead: ["'Playfair Display'", "serif"],
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};


