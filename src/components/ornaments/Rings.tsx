import { InkDefs, useInkIds } from "./Defs";

/** Two interlocking bands with a small stone, in the seafoam ink. viewBox 72×48. */
export function Rings({ className }: { className?: string }) {
  const ids = useInkIds();
  const ink = `url(#${ids.ink})`;
  return (
    <svg viewBox="0 0 72 48" className={className} fill="none" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <InkDefs ids={ids} w={72} h={48} />
      <circle cx="27" cy="27" r="15" stroke={ink} />
      <circle cx="45" cy="27" r="15" stroke={ink} />
      <path d="M23.5 12.5 L27 7 L30.5 12.5 Z" fill="#eef3f3" stroke={ink} strokeWidth={1.2} />
      <path d="M16.5 21 A12 12 0 0 1 21 16.5" stroke="#eef3f3" strokeWidth={1} opacity={0.9} />
      <path d="M51 16.5 A12 12 0 0 1 55.5 21" stroke="#eef3f3" strokeWidth={1} opacity={0.9} />
    </svg>
  );
}
