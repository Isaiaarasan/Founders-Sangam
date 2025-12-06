/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // New shadow utility for a deeper glow effect
      boxShadow: {
        '3xl': '0 0 30px rgba(163, 230, 53, 0.4)', // lime-400 shadow
      },
      keyframes: {
        'glitch-anim': {
          '0%, 100%': { clip: 'rect(0, 9999px, 0, 0)' },
          '5%': { clip: 'rect(32px, 9999px, 45px, 0)' },
          '10%': { clip: 'rect(100px, 9999px, 20px, 0)' },
          '25%': { clip: 'rect(120px, 9999px, 80px, 0)' },
          '35%': { clip: 'rect(55px, 9999px, 110px, 0)' },
          '50%': { clip: 'rect(10px, 9999px, 20px, 0)' },
          '65%': { clip: 'rect(35px, 9999px, 70px, 0)' },
          '80%': { clip: 'rect(110px, 9999px, 5px, 0)' },
          '95%': { clip: 'rect(80px, 9999px, 30px, 0)' },
        },
      },
      animation: {
        // Kept original animation utilities
        'glitch-slow': 'glitch-anim 5s infinite linear alternate-reverse',
        'glitch-fast': 'glitch-anim 0.8s infinite linear alternate', // Made the "fast" one faster
      },
    },
  },
  plugins: [],
};