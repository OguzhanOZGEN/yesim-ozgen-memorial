/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": {
          DEFAULT: "#00b4d8",
          "50": "#e6f7fb",
          "100": "#b3e8f5",
          "200": "#80d9ef",
          "300": "#4dcae9",
          "400": "#1abbe3",
          "500": "#00b4d8",
          "600": "#0090ad",
          "700": "#006c82",
          "800": "#004857",
          "900": "#00242c",
          "950": "#001216"
        },
        "primary-dark": "#0090ad",
        "background-light": "#f6f6f8",
        "background-dark": "#131022",
      },
      fontFamily: {
        "display": ["Newsreader", "serif"],
        "sans": ["Noto Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
