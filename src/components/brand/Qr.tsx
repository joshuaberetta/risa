import { qrPath } from '../../lib/qr';

/** A scannable QR code, with a quiet zone. Label it: the code itself means nothing to a screen reader. */
export function Qr({ value, label, className }: { value: string; label: string; className?: string }) {
  const { d, size } = qrPath(value);
  return (
    <svg className={className} viewBox={`-2 -2 ${size + 4} ${size + 4}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect x={-2} y={-2} width={size + 4} height={size + 4} fill="#fff" />
      <path d={d} fill="#0b0c0c" />
    </svg>
  );
}
