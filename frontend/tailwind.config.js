/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#8b5cf6', // purple-500
            dark: '#7c3aed',    // purple-600
          },
          background: '#f3f4f6',
          emerald: '#50C878',
          gold: '#D4AF37',
          charcoal: '#36454F',
          luxury: {
            DEFAULT: '#D4AF37', // soft gold
            foreground: '#1f2937' // slate-800 for contrast
          }
        },
        borderRadius: {
          xl: '1rem',
        },
        fontFamily: {
          oxygen: ['Oxygen', 'sans-serif'],
          merriweather: ['Merriweather', 'serif'],
          roboto: ['Roboto', 'sans-serif'],
          'roboto-slab': ['Roboto Slab', 'serif'],
          'oxygen-mono': ['Oxygen Mono', 'monospace'],
          'roboto-mono': ['Roboto Mono', 'monospace'],
        }
      },
    },
    plugins: [],
  }
