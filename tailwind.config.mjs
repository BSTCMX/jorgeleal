/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  safelist: [
    'dark',
    'reveal',
    'revealed',
    'animate-gradient',
    'social-link',
    'project-card',
    'project-card-image'
  ],
  theme: {
    extend: {
      animation: {
        'gradient-shift-optimized': 'gradient-shift-optimized 8s ease infinite',
      },
      keyframes: {
        'gradient-shift-optimized': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
}
