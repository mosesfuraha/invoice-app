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

        darkBg: "#252945",
        darkText: "#1E2139",
        darkAccent: "#7C5DFA",
        darkSecondary: "#F8F8FB",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
