export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
      colors: {
        navy: { DEFAULT: '#07112b', 2: '#0b1a3e', 3: '#0f2050' },
        cyan: { DEFAULT: '#22d3ee' },
        purple: { DEFAULT: '#a855f7' },
        gold: { DEFAULT: '#fbbf24' },
        coral: { DEFAULT: '#f97316' },
      },
    },
  },
  plugins: [],
}