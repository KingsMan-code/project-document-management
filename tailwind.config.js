/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // pasta app
    "./src/pages/**/*.{js,ts,jsx,tsx}", // caso tenha pages
    "./src/components/**/*.{js,ts,jsx,tsx}", // componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
