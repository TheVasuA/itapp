// Design tokens — canonical green → yellow palette (HSL channel values).
//
// This is the single source of truth for the brand color tokens. The exact same
// values are declared as CSS variables in `src/app/globals.css` (`:root` for
// light, `.dark` for dark) using the shadcn/ui token names, and Tailwind
// (`tailwind.config.js`) maps `theme.extend.colors` to those variables via
// `hsl(var(--token))`. Keeping the values here lets non-CSS code (tests, build
// tooling, docs) reference the canonical palette without parsing CSS.
//
// Brand pairing: primary = green, accent/secondary = yellow. Yellow surfaces use
// a DARK foreground so text meets WCAG AA (yellow + white text fails AA).
//
// Values are stored as HSL channel strings ("H S% L%") so they slot directly
// into `hsl(var(--token))`.

/** Light theme tokens (mirrors `:root` in globals.css). */
export const lightTokens = {
  background: '60 30% 99%', // near-white, faint warm tint
  foreground: '150 25% 12%', // deep green-black text
  card: '0 0% 100%',
  'card-foreground': '150 25% 12%',
  popover: '0 0% 100%',
  'popover-foreground': '150 25% 12%',
  primary: '142 70% 40%', // vivid green (brand)
  'primary-foreground': '0 0% 100%', // white text on green (AA)
  secondary: '48 95% 55%', // warm yellow
  'secondary-foreground': '36 45% 14%', // dark text on yellow (AA)
  accent: '48 95% 55%', // yellow accent (matches secondary)
  'accent-foreground': '36 45% 14%', // DARK text on yellow (AA)
  muted: '150 16% 95%',
  'muted-foreground': '150 10% 38%',
  border: '150 14% 88%',
  input: '150 14% 88%',
  ring: '142 70% 40%', // green focus ring
  destructive: '0 72% 50%',
  'destructive-foreground': '0 0% 100%',
};

/** Dark theme tokens (mirrors `.dark` in globals.css). */
export const darkTokens = {
  background: '150 30% 6%', // near-black, very dark green-tinted
  foreground: '150 12% 92%', // light text
  card: '150 24% 9%',
  'card-foreground': '150 12% 92%',
  popover: '150 24% 9%',
  'popover-foreground': '150 12% 92%',
  primary: '142 65% 52%', // brighter green for dark bg
  'primary-foreground': '150 40% 8%', // dark text on bright green (AA)
  secondary: '45 85% 52%', // slightly muted gold
  'secondary-foreground': '40 60% 10%',
  accent: '45 85% 52%', // muted gold accent
  'accent-foreground': '40 60% 10%', // DARK text on gold (AA)
  muted: '150 18% 16%',
  'muted-foreground': '150 10% 65%',
  border: '150 16% 20%',
  input: '150 16% 20%',
  ring: '142 65% 52%',
  destructive: '0 62% 45%',
  'destructive-foreground': '0 0% 100%',
};

/** Border-radius baseline (rounded-2xl). Mirrors `--radius` in globals.css. */
export const radius = '1rem';

export default { lightTokens, darkTokens, radius };
