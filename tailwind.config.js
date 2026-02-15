// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [require('daisyui')],
//   daisyui: {
//     themes: false, // This disables all DaisyUI themes
//     styled: true,
//     base: true,
//     utils: true,
//   },
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Zen Maru Gothic', 'system-ui', 'sans-serif'],
        jp: ['Zen Maru Gothic', 'Nunito', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false, // We define themes manually in globals.css with CSS variables
    styled: true,
    base: true,
    utils: true,
  },
}