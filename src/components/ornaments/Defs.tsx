import { useId } from "react";

/** Shared gradients for the seafoam line art: the ink of the strokes, the wash of the leaves, the heart of a bloom. Call inside an <svg>. */
export function useInkIds() {
  const id = useId().replace(/:/g, "");
  return { ink: `ink-${id}`, bloom: `bloom-${id}`, leaf: `leaf-${id}` };
}

export function InkDefs({ ids, w = 160, h = 64 }: { ids: ReturnType<typeof useInkIds>; w?: number; h?: number }) {
  return (
    <defs>
      <linearGradient id={ids.ink} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
        <stop offset="0" stopColor="#6f9196" />
        <stop offset="0.42" stopColor="#bfd3d4" />
        <stop offset="0.58" stopColor="#8fadb0" />
        <stop offset="1" stopColor="#6f9196" />
      </linearGradient>
      <radialGradient id={ids.bloom} cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.6" stopColor="#e6efef" />
        <stop offset="1" stopColor="#bfd3d4" />
      </radialGradient>
      <linearGradient id={ids.leaf} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2="0">
        <stop offset="0" stopColor="#b7cbc8" />
        <stop offset="1" stopColor="#7f9a94" />
      </linearGradient>
    </defs>
  );
}
