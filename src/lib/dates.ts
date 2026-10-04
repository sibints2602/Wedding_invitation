import type { Lang } from "@/content/types";

const TZ = "Asia/Kolkata";
const LOCALES: Record<Lang, string> = { en: "en-IN", ml: "ml-IN", kn: "kn-IN" };
const locale = (lang: Lang) => LOCALES[lang];

/** "21" */
export function formatDay(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { day: "numeric", timeZone: TZ }).format(new Date(iso));
}

/** "November 2026" */
export function formatMonthYear(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { month: "long", year: "numeric", timeZone: TZ }).format(new Date(iso));
}

/** "Saturday" */
export function formatWeekday(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { weekday: "long", timeZone: TZ }).format(new Date(iso));
}

/** "10:30 am" */
export function formatTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ })
    .format(new Date(iso))
    .replace(/\s?(AM|PM)/, (m) => m.toLowerCase());
}
