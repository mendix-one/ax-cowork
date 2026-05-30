export default {
    plugins: {
        // Tailwind v3 expects to be invoked via `tailwindcss({ config })`. Picked up
        // automatically by rollup-plugin-postcss in @mendix/pluggable-widgets-tools.
        tailwindcss: {},
        autoprefixer: {}
    }
};
