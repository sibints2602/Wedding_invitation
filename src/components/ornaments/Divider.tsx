import { InkDefs, useInkIds } from "./Defs";

type Props = { className?: string; variant?: "flourish" | "rose" };

/** Horizontal flourish with mirrored vines meeting at a leaf, or, in the "rose" variant, at a small five-petal rose. viewBox 320×40. */
export function Divider({ className, variant = "flourish" }: Props) {
  const ids = useInkIds();
  const ink = `url(#${ids.ink})`;
  const leaf = (x: number, y: number, a: number, s = 1) => (
    <path d={`M0 0 Q${6 * s} -${3.6 * s} ${12 * s} 0 Q${6 * s} ${3.6 * s} 0 0 Z`} fill={`url(#${ids.leaf})`} fillOpacity={0.9} stroke={ink} strokeWidth={0.7} transform={`translate(${x} ${y}) rotate(${a})`} />
  );
  const vine = (mirror: boolean) => (
    <g transform={mirror ? "translate(320 0) scale(-1 1)" : undefined}>
      <path d="M8 20 H96" stroke={ink} strokeWidth={1} opacity={0.6} />
      <path d="M96 20 C110 20 118 10 130 10 C138 10 142 16 138 20 C134 24 128 22 128 17" stroke={ink} strokeWidth={1.3} />
      <path d="M118 13 C112 8 108 9 104 12" stroke={ink} strokeWidth={1} />
      {leaf(104, 12, -150, 0.9)}
      {leaf(112, 8, -40, 0.8)}
      {leaf(136, 22, 20, 0.9)}
      <circle cx="146" cy="20" r="1.6" fill="#6f9196" />
    </g>
  );
  const petal = "M0 0 C -5.5 -8, -14 -5.5, -11 2 C -9 7, -3 7, 0 0 Z";
  return (
    <svg viewBox="0 0 320 40" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <InkDefs ids={ids} w={320} h={40} />
      {vine(false)}
      {vine(true)}
      {variant === "rose" ? (
        <g transform="translate(160 20) scale(1.1)">
          <g fill={`url(#${ids.bloom})`} stroke="#8fadb0" strokeWidth="0.8" strokeLinejoin="round">
            {[0, 72, 144, 216, 288].map((a) => (
              <path key={a} d={petal} transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r="2.2" fill="#6f9196" />
        </g>
      ) : (
        <>
          <path d="M160 12 L168 20 L160 28 L152 20 Z" fill={`url(#${ids.leaf})`} stroke={ink} strokeWidth={1} />
          <circle cx="160" cy="20" r="1.8" fill="#4e6f74" />
        </>
      )}
    </svg>
  );
}
