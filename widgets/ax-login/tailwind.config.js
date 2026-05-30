/** @type {import('tailwindcss').Config} */
module.exports = {
    // Scope utilities under .ax-login so the widget's reset/utilities never leak
    // into the host Mendix page (other widgets don't expect Tailwind preflight).
    important: ".ax-login",
    content: ["./src/**/*.{ts,tsx,scss,css}"],
    corePlugins: {
        // Disable Tailwind's CSS reset — Mendix host already covers this and
        // preflight would aggressively override AntD defaults.
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
