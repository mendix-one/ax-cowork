/** @type {import('tailwindcss').Config} */
export default {
  // Match the widget's scoping — utilities only apply under .ax-login. Keeps the
  // sim chrome (AntD Layout/Menu) untouched by Tailwind's reset/utilities.
  important: '.ax-login',
  content: ['./src/**/*.{ts,tsx,scss,css}', '../widgets/ax-login/src/**/*.{ts,tsx,scss,css}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        'ax-primary': '#3F51B5',
        'ax-secondary': '#009688',
        'ax-tertiary': '#673AB7',
        'ax-error': '#F44336',
        'ax-warning': '#FFC107',
        'ax-info': '#03A9F4',
        'ax-success': '#4CAF50',
      },
    },
  },
  plugins: [],
}
