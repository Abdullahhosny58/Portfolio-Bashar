/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        'cin-black':   '#080808',
        'cin-dark':    '#0f0f0f',
        'cin-surface': '#141414',
        'cin-gold':    '#c9a84c',
        'cin-gold-lt': '#e8c97c',
        'cin-cream':   '#f0ebe0',
        'cin-text':    '#e8e0d0',
        'cin-muted':   '#a09888',
        'cin-faint':   '#5a5248',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      screens: { xs: '450px' },
    },
  },
  plugins: [],
};
