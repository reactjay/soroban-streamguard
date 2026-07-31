/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          dark: '#0B0E14',
          card: '#121824',
          border: '#1E293B',
          purple: '#7C3AED',
          cyan: '#06B6D4',
          emerald: '#10B981',
          gold: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
};
