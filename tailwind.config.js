/** @type {import('tailwindcss').Config} */

// Tailwind configuration for the Dev Learning Platform.
//
// - `darkMode: 'class'` — the effective theme is applied by toggling a single
//   `dark` class on the <html> element (see Theming & Visual Design). The
//   `.dark` selector in globals.css swaps the CSS-variable token values.
// - `theme.extend.colors` maps the shadcn/ui token names to the HSL CSS
//   variables declared in src/app/globals.css via `hsl(var(--token))`, so
//   utilities like `bg-primary`, `text-accent-foreground`, `border-border`,
//   and `ring-ring` resolve to the active theme's tokens.
// - `borderRadius` is derived from the `--radius` token (rounded-2xl baseline).
// - `tailwindcss-animate` provides the motion utilities used by drawers/fades
//   (gated behind motion-safe: in components for prefers-reduced-motion).

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
