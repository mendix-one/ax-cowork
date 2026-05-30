/** @type {import('tailwindcss').Config} */
export default {
    // Scope every utility under .ax-login so the widget's reset/utilities never
    // leak into the surrounding Mendix page (other widgets don't expect Tailwind
    // preflight on their <button>/<input>).
    important: ".ax-login",
    content: ["./src/**/*.{ts,tsx,scss,css}"],
    corePlugins: {
        // Disable Tailwind's CSS reset — Mendix host styles already cover this
        // and preflight would aggressively override AntD defaults.
        preflight: false
    },
    theme: {
        extend: {
            colors: {
                // Mirror axColors from react-app/src/acore/theme/token.ts so utility
                // classes (`text-ax-primary`, `bg-ax-primary`) match the React app.
                "ax-primary": "#3F51B5",
                "ax-secondary": "#009688",
                "ax-tertiary": "#673AB7",
                "ax-error": "#F44336",
                "ax-warning": "#FFC107",
                "ax-info": "#03A9F4",
                "ax-success": "#4CAF50"
            }
        }
    },
    plugins: []
};
