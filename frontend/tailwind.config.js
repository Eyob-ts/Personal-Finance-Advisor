/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
  theme: {
    extend: {
        fontFamily: {
            merriweather: ['Merriweather', 'serif'],
            oxygen: ['Oxygen', 'sans-serif'],
            'oxygen-mono': ['Oxygen Mono', 'monospace'],
            'roboto-mono': ['Roboto Mono', 'monospace'],
            'roboto-slab': ['Roboto Slab', 'serif'],
          },
          colors: {
            primary: "#4f46e5", 
            danger: "#ef4444",
            success: "#10b981"
          }


    },
  },
  plugins: [],
}

