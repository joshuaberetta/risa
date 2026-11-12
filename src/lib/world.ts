// The deployments world map. Natural Earth 1:110m outlines (public domain),
// pre-projected to Equal Earth (world.json, from the review site's world.js,
// itself from kobo.ngo). Ported from worldMap() in public/designs/assets/library.js.
import world from './world.json';
import type { Deployment } from './types';

export const WORLD = world as { width: number; height: number; projection: { scale: number; translate: [number, number] }; countries: { name: string; d: string; centroid: [number, number] }[] };

const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const M = Math.sqrt(3) / 2;

/** Equal Earth, in the outlines' coordinates. */
export function project(lon: number, lat: number): [number, number] {
  const l = (lon * Math.PI) / 180;
  const th = Math.asin(M * Math.sin((lat * Math.PI) / 180));
  const t2 = th * th;
  const t6 = t2 * t2 * t2;
  const x = (l * Math.cos(th)) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)));
  const y = th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
  return [WORLD.projection.translate[0] + WORLD.projection.scale * x, WORLD.projection.translate[1] - WORLD.projection.scale * y];
}

const centroid = Object.fromEntries(WORLD.countries.map((c) => [c.name, c.centroid]));

export interface Pin {
  d: Deployment;
  label: string;
  xy: [number, number];
}

function pinsFor(d: Deployment): Pin[] {
  if (d.locations?.length) return d.locations.map((l) => ({ d, label: l.name, xy: project(l.lon, l.lat) }));
  const c = d.countries?.[0] && centroid[d.countries[0]];
  return c ? [{ d, label: d.countries[0], xy: c }] : [];
}

/** Pins that land on the same spot are spread in a small circle. */
function spread(pins: Pin[]): Pin[] {
  const groups: Record<string, Pin[]> = {};
  for (const p of pins) (groups[`${Math.round(p.xy[0] / 8)}:${Math.round(p.xy[1] / 8)}`] ??= []).push(p);
  return Object.values(groups).flatMap((g) =>
    g.length === 1
      ? g
      : g.map((p, i) => {
          const a = (2 * Math.PI * i) / g.length - Math.PI / 2;
          return { ...p, xy: [p.xy[0] + 9 * Math.cos(a), p.xy[1] + 9 * Math.sin(a)] as [number, number] };
        }),
  );
}

/** The pins, the countries involved, and a view framing them at about 2:1. */
export function worldMapLayout(items: Deployment[], focus = false) {
  const pins = spread(items.flatMap(pinsFor));
  const hot = new Set(items.flatMap((d) => d.countries ?? []));
  const pts = pins.map((p) => p.xy);
  let [x0, y0, x1, y1] = pts.length
    ? [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))]
    : [0, 0, WORLD.width, WORLD.height];
  const pad = focus ? 60 : 70;
  x0 -= pad;
  x1 += pad;
  y0 -= pad;
  y1 += pad;
  let w = Math.max(x1 - x0, focus ? 260 : 520);
  const h = Math.max(y1 - y0, w / 2);
  w = Math.max(w, h * 2);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const viewBox = [
    Math.max(0, Math.min(WORLD.width - w, cx - w / 2)),
    Math.max(0, Math.min(WORLD.height - h, cy - h / 2)),
    Math.min(w, WORLD.width),
    Math.min(h, WORLD.height),
  ];
  return { pins, hot, viewBox, scale: viewBox[2] / 1000 };
}
