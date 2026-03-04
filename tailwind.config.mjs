/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  plugins: [require('@tailwindcss/typography')],
  theme: {
    fontSize: {
      xxxs: ['0.65rem', { lineHeight: '0.9rem' }],
      xxs: ['0.75rem', { lineHeight: '1rem' }],
      xs: ['0.8125rem', { lineHeight: '1.2rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['0.9375rem', { lineHeight: '1.4rem' }],
      lg: ['1rem', { lineHeight: '1.5rem' }],
      xl: ['1.125rem', { lineHeight: '1.6rem' }],
      '2xl': ['1.25rem', { lineHeight: '1.6rem' }],
      '3xl': ['1.5rem', { lineHeight: '1.8rem' }],
      '4xl': ['1.875rem', { lineHeight: '2.1rem' }],
      '5xl': ['2.25rem', { lineHeight: '2.4rem' }],
    },
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      serif: ['Lora', ...defaultTheme.fontFamily.serif],
    },
    
    extend: {
      colors: {
        primary: 'var(--color-primary)',
      },
    },
  },
};
