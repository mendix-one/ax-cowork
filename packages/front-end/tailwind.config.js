/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,scss}'],
  theme: {
    extend: {
      colors: {
        'ax-primary': '#3f51b5',
        'ax-secondary': '#009688',
        'ax-tertiary': '#673ab7',
        'ax-error': '#f44336',
        'ax-warning': '#ff9800',
        'ax-info': '#2196f3',
        'ax-success': '#4caf50',
        neutral: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#f0f0f0',
          400: '#d9d9d9',
          500: '#bfbfbf',
          600: '#8c8c8c',
          700: '#595959',
          800: '#434343',
          900: '#262626',
          950: '#000000',
        },
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'sans-serif'],
        serif: ['Roboto', '-apple-system', 'serif'],
      },
      fontSize: {
        base: ['1rem', '1.5'],
      },
    },
  },
  plugins: [],
}
