/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-green": "#0FFF7A",
        cream: "#F9F3E8",
        "deep-green": "#003830",
      },
      screens: {
        "3xl": "2000px",
      },
      fontFamily: {
        bricolage: ["var(--font-bricolage)"],
        fustat: ["var(--font-fustat)"],
      },
    },
  },
  plugins: [],
};
