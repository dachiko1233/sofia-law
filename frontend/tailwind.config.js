/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand tokens (from the approved designs)
        bg: '#F6F6F3',
        ink: '#0A1A2F',
        navy: '#243140',
        accent: '#1F4FD1',
        footer: '#06111F',
        muted: '#4A5A70',
        line: '#DADDE2',
        // Supporting shades used across the designs
        'ink-soft': '#33455E', // justified body copy
        'ink-70': '#24364F',
        'slate-label': '#8FA6C4', // labels / footer text on dark
        'slate-light': '#C7D0DD', // hero subtext
        'slate-breadcrumb': '#AEBBCB',
        'slate-doc': '#D5DEEA', // practice-area head text
        'num-grey': '#6B7A8F', // list numbers
        'accent-bright': '#3D7BFF', // newsletter button + focus ring
        'navy-card': '#2F3D4D', // technology cards
        'navy-line': '#1C2E47', // footer divider
        'navy-border': '#22385A', // newsletter / social border
        'footer-dim': '#7F93AE', // footer bottom row
        'input-line': '#9AA6B5', // contact input underline
        'table-head': '#E9EBEE',
        placeholder: '#E3E6EA', // image placeholder blocks
      },
      fontFamily: {
        // Manrope covers Latin, Greek and Cyrillic at every weight, so EN/GR/RU
        // render in the same typeface. The fallbacks (Helvetica/Arial/Noto) also
        // cover all three scripts, so text stays consistent across languages even
        // before the webfont loads or if it is unavailable — never a per-script
        // system default.
        sans: ['Manrope', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      maxWidth: {
        wrap: '1320px',
        prose: '780px',
      },
      borderRadius: {
        pill: '999px',
      },
      letterSpacing: {
        label: '0.14em',
        logo: '0.06em',
      },
    },
  },
  plugins: [],
};
