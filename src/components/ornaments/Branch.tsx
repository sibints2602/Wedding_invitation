import { bezier, bezierTangentDeg, cubicPath, f, leafPath, type Pt } from "./geometry";
import { InkDefs, useInkIds } from "./Defs";

const P0: Pt = { x: 6, y: 56 }, P1: Pt = { x: 40, y: 48 }, P2: Pt = { x: 92, y: 10 }, P3: Pt = { x: 154, y: 14 };
const LEAVES = 9;
const OLIVES = [0.3, 0.58];

/** An olive branch with washed leaves and two olives, in the seafoam ink. viewBox 160×64. */
export function Branch({ className, flip = false }: { className?: string; flip?: boolean }) {
  const ids = useInkIds();
  const ink = `url(#${ids.ink})`;
  const leaf = `url(#${ids.leaf})`;
  const items = Array.from({ length: LEAVES }, (_, i) => {
    const t = 0.1 + (i / (LEAVES - 1)) * 0.86;
    const p = bezier(P0, P1, P2, P3, t);
    const tangent = bezierTangentDeg(P0, P1, P2, P3, t);
    const side = i % 2 === 0 ? -1 : 1;
    return { p, angle: tangent + side * 40, len: 26 - i * 1.4, width: 7.5 - i * 0.35 };
  });
  const tip = bezier(P0, P1, P2, P3, 1);
  const tipAngle = bezierTangentDeg(P0, P1, P2, P3, 1);

  return (
    <svg viewBox="0 0 160 64" className={className} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <InkDefs ids={ids} w={160} h={64} />
      <path d={cubicPath(P0, P1, P2, P3)} stroke={ink} />
      {items.map((it, i) => (
        <path key={i} d={leafPath(it.len, it.width)} fill={leaf} fillOpacity={0.9} stroke={ink} strokeWidth={0.9} transform={`translate(${f(it.p.x)} ${f(it.p.y)}) rotate(${f(it.angle)})`} />
      ))}
      <path d={leafPath(15, 4.5)} fill={leaf} fillOpacity={0.9} stroke={ink} strokeWidth={0.9} transform={`translate(${f(tip.x)} ${f(tip.y)}) rotate(${f(tipAngle - 8)})`} />
      {OLIVES.map((t, i) => {
        const p = bezier(P0, P1, P2, P3, t);
        const a = ((bezierTangentDeg(P0, P1, P2, P3, t) + 90) * Math.PI) / 180;
        return <circle key={i} cx={f(p.x + Math.cos(a) * 6)} cy={f(p.y + Math.sin(a) * 6)} r={2.6} fill="#6f9196" stroke="none" />;
      })}
    </svg>
  );
}
