/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ai: {
          primary: '#00f5ff',
          secondary: '#ff00ff',
          accent: '#ffd700',
          success: '#00ff88',
        }
      },
    },
  },
  plugins: [],
}
