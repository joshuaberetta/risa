// Writes public/favicon.svg from the logo mark (src/lib/logo.ts), with the
// colours as literals: a favicon can't see the page's CSS variables.
//   node scripts/favicon.mjs
import fs from 'node:fs';
import { logoMark } from '../src/lib/logo.ts';

const svg = logoMark()
  .replace(/var\(--logo-[a-z]+, (#[0-9A-Fa-f]{6})\)/g, '$1')
  .replace(' class="risa-mark"', ' xmlns="http://www.w3.org/2000/svg"')
  .replace(/ aria-hidden="true" focusable="false"/, '');
fs.writeFileSync(new URL('../public/favicon.svg', import.meta.url), `${svg}\n`);
console.log('Wrote public/favicon.svg');
