// Ambient declarations so TS accepts SCSS/CSS side-effect imports and the editorPreview's
// require() of the stylesheet. The Mendix tools don't ship these per-widget.
declare module '*.scss'
declare module '*.css'
