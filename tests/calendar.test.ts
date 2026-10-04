import { describe, expect, test } from "vitest";
import { buildIcs, googleCalendarUrl, icsDataUrl } from "@/lib/calendar";
import type { WeddingEvent } from "@/content/types";

const e: WeddingEvent = {
  id: "holy-matrimony",
  name: { en: "Holy Matrimony", ml: "വിവാഹ ശുശ്രൂഷ", kn: "വിവാഹ ശുശ്രൂഷ" },
  startIso: "2027-01-23T10:30:00+05:30",
  endIso: "2027-01-23T12:00:00+05:30",
  venue: { en: "St. Mary's Cathedral", ml: "സെന്റ് മേരീസ് കത്തീഡ്രൽ", kn: "സെന്റ് മേരീസ് കത്തീഡ്രൽ" },
  address: { en: "Cathedral Road, Kottayam, Kerala", ml: "കോട്ടയം", kn: "കോട്ടയം" },
  mapsQuery: "St. Mary's Cathedral, Kottayam",
  note: { en: "Please be seated by 10:15 am.", ml: "10:15", kn: "10:15" },
};

describe("googleCalendarUrl", () => {
  test("uses UTC dates and localized text", () => {
    const u = new URL(googleCalendarUrl(e, "en"));
    expect(u.origin + u.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(u.searchParams.get("action")).toBe("TEMPLATE");
    expect(u.searchParams.get("dates")).toBe("20270123T050000Z/20270123T063000Z");
    expect(u.searchParams.get("text")).toBe("Holy Matrimony");
    expect(u.searchParams.get("location")).toBe("St. Mary's Cathedral, Cathedral Road, Kottayam, Kerala");
    expect(new URL(googleCalendarUrl(e, "ml")).searchParams.get("text")).toBe("വിവാഹ ശുശ്രൂഷ");
  });
});

describe("buildIcs", () => {
  const ics = buildIcs(e, "en", "https://priyank-and-tosmy.example.com");
  test("is a valid VCALENDAR with UTC times and CRLF line endings", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("\r\nDTSTART:20270123T050000Z\r\n");
    expect(ics).toContain("\r\nDTEND:20270123T063000Z\r\n");
    expect(ics).toContain("\r\nUID:holy-matrimony@priyank-and-tosmy.example.com\r\n");
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
  });
  test("escapes commas, semicolons and newlines in text fields", () => {
    expect(ics).toContain("LOCATION:St. Mary's Cathedral\\, Cathedral Road\\, Kottayam\\, Kerala");
    const withNewline = buildIcs({ ...e, note: { en: "Line one\nLine; two", ml: "", kn: "" } }, "en", "https://x.test");
    expect(withNewline).toContain("Line one\\nLine\\; two");
  });
  test("icsDataUrl produces a text/calendar data URL", () => {
    expect(icsDataUrl("BEGIN:VCALENDAR")).toBe("data:text/calendar;charset=utf-8,BEGIN%3AVCALENDAR");
  });
});
