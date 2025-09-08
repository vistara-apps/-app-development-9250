/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(260, 60%, 10%)',
        surface: 'hsl(260, 50%, 15%)',
        accent: 'hsl(30, 90%, 55%)',
        primary: 'hsl(260, 70%, 50%)',
        secondary: 'hsl(280, 60%, 60%)',
        success: 'hsl(120, 60%, 50%)',
        danger: 'hsl(0, 70%, 60%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(260, 60%, 10%, 0.3)',
        'glow': '0 0 20px hsla(260, 70%, 50%, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}