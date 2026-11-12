import {
  Anchor,
  Button,
  Container,
  Input,
  createTheme,
  rem,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from '@mantine/core';
import { STATUS_COLOURS } from '../lib/status';

// Theme G, Handbook, from the design review (public/designs/themes/handbook/):
// plain documentation, black on white, one link blue. The system and the
// reasons for it are in DESIGN.md. Components use these scales and the
// --risa-* variables, never hex values.

// Kobo dark blue: links, focus and primary buttons (7). Hover is 8.
const blue: MantineColorsTuple = [
  '#e6f0f8',
  '#cce0f0',
  '#99c2e2',
  '#8fc1ea', // links on dark bands
  '#3385c5',
  '#0f6db0',
  '#0063a8',
  '#00599d', // Kobo dark blue
  '#00467c', // button hover
  '#003a66',
];

// Ink and Handbook's greys.
const ink: MantineColorsTuple = [
  '#f3f2f1', // surface: footer, callouts, table heads
  '#e6e6e5',
  '#dddddd', // soft rule
  '#b1b4b6', // rule
  '#8c9195',
  '#6f777b',
  '#505a5f', // secondary text
  '#383f43',
  '#1d1f20', // surface on dark bands
  '#0b0c0c', // ink
];

const SANS = "'Source Sans 3 Variable', 'Source Sans 3', Arial, sans-serif";

export const theme = createTheme({
  colors: { blue, ink },
  primaryColor: 'blue',
  primaryShade: 7,
  black: ink[9],
  white: '#ffffff',
  fontFamily: SANS,
  fontFamilyMonospace: "'IBM Plex Mono', ui-monospace, monospace",
  headings: {
    fontFamily: SANS,
    fontWeight: '700',
    sizes: {
      h1: { fontSize: 'clamp(2.2rem, 1.6rem + 2.4vw, 3rem)', lineHeight: '1.15' },
      h2: { fontSize: rem(32), lineHeight: '1.2' },
      h3: { fontSize: rem(22), lineHeight: '1.25' },
      h4: { fontSize: rem(18), lineHeight: '1.3' },
    },
  },
  fontSizes: { xs: rem(14), sm: rem(15.5), md: rem(18), lg: rem(20.5), xl: rem(23) },
  lineHeights: { md: '1.55' },
  spacing: { xs: rem(8), sm: rem(12), md: rem(16), lg: rem(24), xl: rem(32) },
  breakpoints: { xs: '36em', sm: '48em', md: '62em', lg: '75em', xl: '88em' },
  // Square corners and no shadows, everywhere.
  defaultRadius: 0,
  radius: { xs: '0', sm: '0', md: '0', lg: '0', xl: '0' },
  shadows: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'none' },
  focusRing: 'auto',
  components: {
    Button: Button.extend({
      defaultProps: { size: 'md' },
      styles: { root: { fontWeight: 600, borderWidth: rem(2) } },
    }),
    Container: Container.extend({ defaultProps: { size: 1080 } }),
    Anchor: Anchor.extend({ defaultProps: { underline: 'always' } }),
    Input: Input.extend({ styles: { input: { borderWidth: rem(2), borderColor: ink[9] } } }),
  },
});

/** Colours that aren't a single shade, as `var(--risa-*)` for CSS modules. */
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    // Mantine's own greys (hints, placeholders) fail AA on white; use Handbook's.
    '--mantine-color-dimmed': ink[6],
    '--mantine-color-placeholder': ink[5],
    '--risa-paper': '#ffffff',
    '--risa-surface': ink[0],
    '--risa-ink': ink[9],
    '--risa-ink-2': ink[6],
    '--risa-line': ink[3],
    '--risa-line-soft': ink[2],
    '--risa-link': blue[7],
    '--risa-link-hover': blue[8],
    '--risa-font-mono': "'IBM Plex Mono', ui-monospace, monospace",
    '--risa-header-height': rem(72),
    // The callout rule: a 4px bar at the inline start.
    '--risa-rule': `${rem(4)} solid var(--risa-ink-2)`,
    // Logo 10b. Dark bands override these (global.css .risa-dark).
    '--logo-a': blue[7],
    '--logo-b': ink[9],
    '--logo-c': ink[6],
    '--logo-d': ink[3],
    '--logo-ink': ink[9],
    '--logo-bg': '#ffffff',
    // Reserved for status. Nothing else may use these (src/lib/status.ts).
    ...Object.fromEntries(
      Object.entries(STATUS_COLOURS).flatMap(([k, c]) => [
        [`--risa-st-${k}`, c.fill],
        [`--risa-st-${k}-text`, c.text],
      ]),
    ),
    '--risa-st-ink': '#1d232b',
  },
  light: {},
  dark: {},
});
