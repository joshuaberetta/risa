const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "26 Jan 2026", "Nov 2026", "2027", "Q4 2026" from yyyy-mm-dd, yyyy-mm, yyyy or yyyy-Qn. */
export function formatDate(value?: string | Date): string {
  if (!value) return '';
  // YAML reads 2026-01-26 as a date, which arrives here as 2026-01-26T00:00:00.000Z.
  const s = (value instanceof Date ? value.toISOString() : String(value)).replace(/T.*$/, '');
  const q = /^(\d{4})-Q([1-4])$/.exec(s);
  if (q) return `Q${q[2]} ${q[1]}`;
  const [y, m, d] = s.split('-');
  if (!m) return y;
  const month = MONTHS[Number(m) - 1] ?? m;
  return d ? `${Number(d)} ${month} ${y}` : `${month} ${y}`;
}

/** A date range, without repeating the month or year: "26 Jan – 8 Feb 2026", "23–27 Nov 2026". */
export function formatDates(start?: string | Date, end?: string | Date): string {
  const a = formatDate(start);
  const b = formatDate(end);
  if (!b || a === b) return a;
  const [ad, am, ay] = a.split(' ');
  const [bd, bm, by] = b.split(' ');
  if (ay && by && ay === by && am === bm && ad && bd) return `${ad}–${bd} ${bm} ${by}`;
  if (ay && by && ay === by) return `${ad} ${am} – ${b}`;
  return `${a} – ${b}`;
}

/** 28919 -> "28 KB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
