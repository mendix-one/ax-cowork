/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,scss}', '../../shared/ax-control-table/src/**/*.{ts,tsx}'],
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

        // Priority palette (mirrors src/acore/theme/theme.ts → axPriority).
        'ax-pri-p1-bg': '#fff1f0',
        'ax-pri-p1-border': '#ffa39e',
        'ax-pri-p1-text': '#cf1322',
        'ax-pri-p1-solid': '#f5222d',
        'ax-pri-p2-bg': '#fff7e6',
        'ax-pri-p2-border': '#ffd591',
        'ax-pri-p2-text': '#d46b08',
        'ax-pri-p2-solid': '#fa8c16',
        'ax-pri-p3-bg': '#e6f4ff',
        'ax-pri-p3-border': '#91caff',
        'ax-pri-p3-text': '#0958d9',
        'ax-pri-p3-solid': '#1677ff',
        'ax-pri-npi-bg': '#e6fffb',
        'ax-pri-npi-border': '#87e8de',
        'ax-pri-npi-text': '#08979c',
        'ax-pri-npi-solid': '#13c2c2',

        // Schedule lineage (mirrors axSchedule). Bars match $ax-{fixed,changes,new}-schedule in
        // src/styles/_ax-variables.scss; edges are one Material step darker for outline contrast.
        'ax-sched-fixed': '#3f51b5',
        'ax-sched-fixed-edge': '#283593',
        'ax-sched-changes': '#1565C0',
        'ax-sched-changes-edge': '#0D47A1',
        'ax-sched-new': '#00897b',
        'ax-sched-new-edge': '#00695c',
        'ax-sched-ghost': '#cfd8dc',

        // Risk severity (mirrors axRisk).
        'ax-risk-ok': '#4caf50',
        'ax-risk-info': '#2196f3',
        'ax-risk-warning': '#ff9800',
        'ax-risk-critical': '#f44336',
        'ax-risk-warning-bg': '#fff7e6',
        'ax-risk-critical-bg': '#fff1f0',

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
        // FHD planner density — use these for dense info surfaces (Gantt grid, Production Order table).
        'ax-xs': ['11px', '14px'],
        'ax-sm': ['12px', '16px'],
        'ax-md': ['13px', '18px'],
      },
    },
  },
  plugins: [],
}
