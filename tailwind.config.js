/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        lightBg: "#F8F8FB",
        lightText: "#1E2139",
        lightAccent: "#7C5DFA",
        lightSecondary: "#7E88C3",
        lightTextHeader: "#ffffff", // Corrected typo from 'ligthtextHeader'

        darkBg: "#141625",
        darkPrimary: "#1E2139", // Corrected key to 'darkPrimary' (removed 'bg-')
        darkText: "#1E2139",
        darkAccent: "#7C5DFA",
        darkSecondary: "#F8F8FB",
        darkTextHeader: "#ffffff", // Corrected typo from 'darktextHeader'
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
