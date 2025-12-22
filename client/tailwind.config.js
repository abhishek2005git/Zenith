/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0D17', // The Deep Dark Background
          800: '#15192B', // The Card Background
          accent: '#D0D6F9', // The "Moonlight" Text Color
        }
      },
      fontFamily: {
        // We will set these fonts up in Step 5
        sans: ['Outfit', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-pattern': "url('/assets/noise.png')", // Optional texture
      }
    },
  },
  plugins: [],
}