import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full select-none " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] " +
  "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid:
    "text-paper bg-[linear-gradient(100deg,#6f9196_0%,#8fadb0_50%,#7a9c9f_100%)] shadow-[0_8px_24px_rgba(111,145,150,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] " +
    "[@media(hover:hover)]:hover:shadow-[0_12px_30px_rgba(111,145,150,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]",
  outline: "border border-accent/70 text-ink-soft bg-paper/40 [@media(hover:hover)]:hover:border-accent [@media(hover:hover)]:hover:bg-accent/10",
};

const sizes: Record<Size, string> = {
  md: "t-ui h-11 px-6",
  sm: "t-ui-sm h-9 px-4",
};

type Common = { variant?: Variant; size?: Size; icon?: ReactNode; className?: string; children?: ReactNode };
type AsButton = Common & { as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>;
type AsLink = Common & { as: "a" } & AnchorHTMLAttributes<HTMLAnchorElement>;

const OWN_KEYS = ["as", "variant", "size", "icon", "className", "children"] as const;

function nativeProps<T extends object>(props: T): Omit<T, (typeof OWN_KEYS)[number]> {
  const rest: Record<string, unknown> = { ...(props as Record<string, unknown>) };
  for (const k of OWN_KEYS) delete rest[k];
  return rest as Omit<T, (typeof OWN_KEYS)[number]>;
}

/** Pill button. `as="a"` renders a link with the same look. */
export function Button(props: AsButton | AsLink) {
  const { variant = "solid", size = "md", icon, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon && <span className="shrink-0 [&>svg]:size-4">{icon}</span>}
      {children}
    </>
  );
  if (props.as === "a") {
    return (
      <a className={classes} {...nativeProps(props)}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...nativeProps(props)}>
      {content}
    </button>
  );
}
