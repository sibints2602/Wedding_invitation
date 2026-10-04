import type { Lang, WeddingEvent } from "@/content/types";

/** 2027-01-23T10:30:00+05:30 → 20270123T050000Z */
function toUtcStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
}

function location(e: WeddingEvent, lang: Lang): string {
  return `${e.venue[lang]}, ${e.address[lang]}`;
}

export function googleCalendarUrl(e: WeddingEvent, lang: Lang): string {
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action", "TEMPLATE");
  u.searchParams.set("text", e.name[lang]);
  u.searchParams.set("dates", `${toUtcStamp(e.startIso)}/${toUtcStamp(e.endIso)}`);
  u.searchParams.set("location", location(e, lang));
  if (e.note) u.searchParams.set("details", e.note[lang]);
  u.searchParams.set("ctz", "Asia/Kolkata");
  return u.toString();
}

/** RFC 5545 text escaping. */
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function buildIcs(e: WeddingEvent, lang: Lang, siteUrl: string): string {
  const host = (() => {
    try {
      return new URL(siteUrl).host;
    } catch {
      return "wedding";
    }
  })();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.id}@${host}`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
    `DTSTART:${toUtcStamp(e.startIso)}`,
    `DTEND:${toUtcStamp(e.endIso)}`,
    `SUMMARY:${esc(e.name[lang])}`,
    `LOCATION:${esc(location(e, lang))}`,
    `DESCRIPTION:${esc([e.note?.[lang], siteUrl].filter(Boolean).join("\n"))}`,
    `URL:${siteUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}

export function icsDataUrl(ics: string): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
