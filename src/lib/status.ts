// The four statuses, from the RISA template's `status` list (codebook.md).
// Their colours are reserved: only StatusPill, StatusLegend and the maps use
// them, and no brand element is red, amber or green. Status is always shown
// twice, by colour and by shape (filled / half / crossed / outline; solid /
// dashed / dotted lines), so it survives greyscale printing.

export type Status = 'ok' | 'partial' | 'no' | 'unknown';
export const STATUSES: Status[] = ['ok', 'partial', 'no', 'unknown'];

/** `fill` is for symbols and lines; `text` is the AA-safe shade for labels (DESIGN.md). */
export const STATUS_COLOURS: Record<Status, { fill: string; text: string }> = {
  ok: { fill: '#1f9a62', text: '#146b44' },
  partial: { fill: '#e9a23b', text: '#8c5c0f' },
  no: { fill: '#a8281a', text: '#a8281a' },
  unknown: { fill: '#8c939c', text: '#5e656e' },
};

/** Labels for services, and for access points (routes, choke points, hazards). */
export const STATUS_LABELS: Record<'service' | 'access', Record<Status, string>> = {
  service: { ok: 'Working', partial: 'Partly working', no: 'Not working', unknown: "Can't see" },
  access: { ok: 'Passable', partial: 'Restricted', no: 'Blocked', unknown: "Can't see" },
};

export const statusLabel = (status: Status, kind: 'service' | 'access' = 'service') => STATUS_LABELS[kind][status];
