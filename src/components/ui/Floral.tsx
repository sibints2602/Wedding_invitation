import Image from "next/image";
import type { FloralArt } from "@/content/florals";
import { cn } from "@/lib/cn";

type Props = {
  art: FloralArt;
  className?: string;
  sizes?: string;
  /** Preload: for the art on the sealed envelope, which is the first thing seen. */
  preload?: boolean;
};

/** A decorative watercolour piece. Purely visual: empty alt, hidden from assistive tech by the parent. */
export function Floral({ art, className, sizes = "(min-width: 768px) 24rem, 60vw", preload }: Props) {
  return <Image src={art.src} alt="" width={art.width} height={art.height} sizes={sizes} preload={preload} className={cn("h-auto w-full select-none", className)} draggable={false} />;
}
