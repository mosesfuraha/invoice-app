/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        spartan: ['"League Spartan"', "sans-serif"],
      },
      colors: {
        lightBg: "#F8F8FB",
        lightText: "#1E2139",
        lightAccent: "#7C5DFA",
        lightSecondary: "#7E88C3",
        lightTextHeader: "#ffffff",
        redColorError: "#EC5757",

        darkBg: "#141625",
        darkPrimary: "#1E2139",
        darkText: "#1E2139",
        darkAccent: "#7C5DFA",
        darkSecondary: "#F8F8FB",
        darkTextHeader: "#ffffff",
        darkInput: "#252945",
        darkAccent: "#0C0E16",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
