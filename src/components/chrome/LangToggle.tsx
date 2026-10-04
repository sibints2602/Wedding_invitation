"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { languages, ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";

/**
 * Top-left language dropdown. The pill names the current language in its own script; it opens a small paper
 * panel listing all three, each in its own script, the current one ticked. Closes on a pick, outside tap or
 * Escape; arrow keys move through the options.
 */
export function LangToggle() {
  const { lang, setLang, t } = useLang();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const current = languages.find((l) => l.code === lang) ?? languages[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    root.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      trigger.current?.focus();
      return;
    }
    if (!open || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    const items = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  };

  return (
    <div ref={root} onKeyDown={onKey} className="fixed left-4 top-[calc(0.9rem+env(safe-area-inset-top))] z-[60] md:left-6 md:top-6">
      <button
        ref={trigger}
        type="button"
        lang={current.code}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={t(ui.switchLanguage)}
        onClick={() => setOpen((v) => !v)}
        className="t-ui-sm flex h-9 items-center gap-1.5 rounded-full border border-accent/35 bg-paper/80 pl-3.5 pr-2.5 text-ink-soft shadow-[0_6px_20px_rgba(42,58,60,0.14)] backdrop-blur-md transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] [@media(hover:hover)]:hover:border-accent/70 [@media(hover:hover)]:hover:bg-paper"
      >
        {current.label}
        <ChevronDown aria-hidden="true" className={cn("size-3.5 text-accent-deep transition-transform duration-200 ease-[var(--ease-out-strong)]", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={id}
            role="listbox"
            aria-label={t(ui.switchLanguage)}
            className="absolute left-0 top-[calc(100%+8px)] min-w-[11.5rem] origin-top-left overflow-hidden rounded-[14px] border border-accent/35 bg-paper/95 p-1.5 shadow-[0_18px_44px_rgba(42,58,60,0.2),0_2px_6px_rgba(42,58,60,0.08)] backdrop-blur-xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
          >
            {languages.map((l, i) => {
              const selected = l.code === lang;
              return (
                <motion.li
                  key={l.code}
                  role="option"
                  lang={l.code}
                  aria-selected={selected}
                  tabIndex={-1}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                    trigger.current?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.currentTarget.click();
                    }
                  }}
                  initial={reduce ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: EASE_OUT, delay: reduce ? 0 : 0.03 * i }}
                  className={cn(
                    "t-ui-sm flex h-10 cursor-pointer items-center justify-between gap-6 rounded-[10px] px-3.5 outline-none transition-colors duration-150",
                    selected ? "bg-accent/15 text-accent-dusk" : "text-ink-soft [@media(hover:hover)]:hover:bg-accent/10",
                    "focus-visible:bg-accent/20",
                  )}
                >
                  {l.label}
                  {selected && <Check aria-hidden="true" className="size-4 text-accent-deep" />}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
