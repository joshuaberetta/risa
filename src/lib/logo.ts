// Logo 10b, Grid track, layered: the design review's choice (Nov 2026).
// Ported from public/designs/assets/logos.js (gridtrackLayers), with the
// geometry frozen at the studio's GT_DEFAULTS. Only the paths those defaults
// use are kept: bracket layers, the curved leg, the drone as a dot.
// Deterministic and DOM-free, so it renders the same on the server.
// Colours come from --logo-* (theme.ts; dark bands override them). The
// fallbacks are Handbook's, for the favicon and anywhere the variables are unset.

export const LOGO_GEOMETRY = {
  angle: 45, tilt: 0.577,
  cells: 3, frameW: 3.6, gridW: 2.4,
  trackW: 5, takeoff: 8, dot: 4.6,
  layers: 2, layerDY: 11.5, layerW: 3.2, tick: 6,
} as const;

const A = 'var(--logo-a, #00599D)'; // grid and drone
const B = 'var(--logo-b, #0B0C0C)'; // flight path and layers
const BG = 'var(--logo-bg, #FFFFFF)';

// The flight path, an R: up, over the bowl, and an S-bend leg.
const TRACK = 'M12 44V18Q12 12 18 12H30C38 12 41 17 41 22C41 27 37 30 31 30H25C21 30 20 33 21 36C22 39 27 40 31 41L34 42';
const START = [12, 45] as const;
const END = [36.5, 42] as const;

const f = (n: number) => n.toFixed(2);

/** The mark as an SVG string. */
export function logoMark(): string {
  const p = LOGO_GEOMETRY;
  // Plate transform: rotate, then squash to the isometric view.
  const t = (p.angle * Math.PI) / 180;
  const sx = 1.2247;
  const sy = sx * p.tilt;
  const a = sx * Math.cos(t);
  const c = -sx * Math.sin(t);
  const b = sy * Math.sin(t);
  const d = sy * Math.cos(t);
  const P = (x: number, y: number): [number, number] => [a * (x - 24) + c * (y - 24), b * (x - 24) + d * (y - 24)];
  const corners = [P(0, 0), P(48, 0), P(48, 48), P(0, 48)];

  // Layers below the plate: the outline of its lower edge, with short ticks
  // back up at each end, repeated `layers` times.
  const chain = lowerEdge(corners);
  let layers = '';
  for (let k = p.layers; k >= 1; k--) {
    const oy = p.layerDY * k;
    const pts = chain.map(([x, y]) => `${f(x)} ${f(y + oy)}`);
    const [x0, y0] = chain[0];
    const [x1, y1] = chain[chain.length - 1];
    layers += `<path d="M${f(x0)} ${f(y0 + oy - p.tick)}L${pts.join('L')}L${f(x1)} ${f(y1 + oy - p.tick)}" fill="none" stroke="${B}" stroke-width="${p.layerW}" stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  const lines: string[] = [];
  for (let i = 1; i < p.cells; i++) {
    const v = f((48 * i) / p.cells);
    lines.push(`M${v} 0V48M0 ${v}H48`);
  }
  const plate = `<g transform="matrix(${f(a)} ${f(b)} ${f(c)} ${f(d)} 0 0)"><g transform="translate(-24 -24)">
<rect width="48" height="48" fill="${BG}"/>
<rect width="48" height="48" fill="none" stroke="${A}" stroke-width="${p.frameW}"/>
<path d="${lines.join('')}" stroke="${A}" stroke-width="${p.gridW}"/>
<path d="${TRACK}" fill="none" stroke="${BG}" stroke-width="${p.trackW + 3}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${TRACK}" fill="none" stroke="${B}" stroke-width="${p.trackW}" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="${START[0] - p.takeoff / 2}" y="${START[1] - p.takeoff / 2}" width="${p.takeoff}" height="${p.takeoff}" rx="1" fill="${B}" stroke="${BG}" stroke-width="1.5"/>
</g></g>`;
  const [ex, ey] = P(END[0], END[1]);
  const dot = `<circle cx="${f(ex)}" cy="${f(ey - 1)}" r="${p.dot}" fill="${A}" stroke="${BG}" stroke-width="1.5"/>`;

  // Fit the view to the drawing.
  const pad = Math.max(p.frameW, p.layerW) / 2 + 1;
  const all = corners.flatMap(([x, y]) => Array.from({ length: p.layers + 1 }, (_, k) => [x, y + p.layerDY * k]));
  const xs = all.map((q) => q[0]);
  const ys = all.map((q) => q[1]);
  const x0 = Math.min(...xs, ex - p.dot) - pad;
  const x1 = Math.max(...xs, ex + p.dot) + pad;
  const y0 = Math.min(...ys, ey - p.dot - 1) - pad;
  const y1 = Math.max(...ys, ey + p.dot) + pad;
  return `<svg class="risa-mark" viewBox="${f(x0)} ${f(y0)} ${f(x1 - x0)} ${f(y1 - y0)}" aria-hidden="true" focusable="false">${layers}${plate}${dot}</svg>`;
}

/** The plate's lower outline, left to right: the corners seen from below. */
function lowerEdge(corners: [number, number][]): [number, number][] {
  // With the offset straight down, the visible edge runs from the leftmost
  // corner through the lowest to the rightmost (as logos.js works out in general).
  const byX = [0, 1, 2, 3].sort((i, j) => corners[i][0] - corners[j][0]);
  const lo = byX[0];
  const hi = byX[3];
  const walk = (dir: number) => {
    const out = [lo];
    for (let i = lo; i !== hi; ) out.push((i = (i + dir + 4) % 4));
    return out;
  };
  const depth = (w: number[]) => w.reduce((t, i) => t + corners[i][1], 0) / w.length;
  const [w1, w2] = [walk(1), walk(-1)];
  return (depth(w1) >= depth(w2) ? w1 : w2).map((i) => corners[i]);
}

/** The name in two lines for the lockup, broken at the space nearest the middle. */
export function nameLines(name: string): [string, string] {
  const mid = name.length / 2;
  let best = -1;
  for (let i = name.indexOf(' '); i !== -1; i = name.indexOf(' ', i + 1)) {
    if (best === -1 || Math.abs(i - mid) < Math.abs(best - mid)) best = i;
  }
  return best === -1 ? [name, ''] : [name.slice(0, best), name.slice(best + 1)];
}
