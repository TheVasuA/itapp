// PostCSS configuration consumed by Next.js when processing imported CSS.
// Tailwind CSS + Autoprefixer are wired here; the Tailwind config itself and
// the global stylesheet (src/app/globals.css) are added in a later task.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
