/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 10px 60px rgba(56, 189, 248, 0.2)',
        'brand-strong': '0 0 0 1px rgba(94, 234, 212, 0.3), 0 25px 70px rgba(14, 165, 233, 0.25)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 8s ease-in-out infinite',
        'gradient-x': 'gradientX 12s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.45 },
          '50%': { opacity: 0.8 },
        },
        gradientX: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(30,41,59,0.75), rgba(15,23,42,0.7))',
        'hero-radial': 'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.25), transparent 35%), radial-gradient(circle at 80% 10%, rgba(94,234,212,0.25), transparent 30%), radial-gradient(circle at 50% 80%, rgba(59,130,246,0.2), transparent 30%)',
      },
    },
  },
  plugins: [],
};
