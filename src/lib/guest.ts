/**
 * Turns the `?to=` query value into a safe display name.
 * - URL-decodes (tolerating malformed escapes)
 * - removes <, >, " and ` so it can never form markup
 * - collapses whitespace, trims, caps at 60 characters
 * - returns null when nothing usable remains
 */
export function parseGuestName(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  let s = raw;
  try {
    s = decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    s = raw;
  }
  s = s.replace(/[<>"`]/g, "").replace(/\s+/g, " ").trim();
  if (!s) return null;
  return s.length > 60 ? s.slice(0, 60) : s;
}
