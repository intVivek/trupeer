/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray900: '#171717',
        gray800: '#1c1c1c',
        gray200: "#323232",
        gray400: '#aeaeae',
        backdrop: '#82828240',
        accentColor: '#ff6c47',
        accentColor200: '#b74d33',
        transparentAccent: '#ff643e3b',
      },

      animation: {
        "slide-in": "slide-in 0.2s ease forwards",
      },
      keyframes: {
        "slide-in": {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
