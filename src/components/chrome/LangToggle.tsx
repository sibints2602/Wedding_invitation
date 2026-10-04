"use client";

import { useLang } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";

/** Top-left language switch. The label names the *other* language. */
export function LangToggle() {
  const { lang, setLang, t } = useLang();
  const next = lang === "en" ? "ml" : "en";
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      title={t(ui.switchLanguage)}
      lang={next}
      className={cn(
        "t-ui-sm fixed left-4 top-[calc(0.9rem+env(safe-area-inset-top))] z-[60] h-9 rounded-full border border-accent/35 bg-paper/75 px-3.5 text-ink-soft shadow-[0_6px_20px_rgba(42,58,60,0.14)] backdrop-blur-md",
        "transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] [@media(hover:hover)]:hover:border-accent/70 [@media(hover:hover)]:hover:bg-paper",
        "md:left-6 md:top-6",
      )}
    >
      {t(ui.otherLanguage)}
    </button>
  );
}
