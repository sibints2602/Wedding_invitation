export const LANGS = ["en", "ml", "kn"] as const;
export type Lang = (typeof LANGS)[number];

/** Every user-facing string carries both languages. */
export type Localized = Record<Lang, string>;

export interface Photo {
  /** Path under /public, e.g. "/photos/bride.jpg" */
  src: string;
  width: number;
  height: number;
  alt: Localized;
  blurDataURL?: string;
}

export interface Person {
  firstName: Localized;
  fullName: Localized;
  /** Complete sentence, e.g. "Son of Mr. Thomas Mathew & Mrs. Annie Thomas" (omit until known) */
  parentsLine?: Localized;
  note?: Localized;
}

export interface WeddingEvent {
  id: string;
  name: Localized;
  /** ISO 8601 with offset, e.g. 2027-01-23T10:30:00+05:30 */
  startIso: string;
  endIso: string;
  venue: Localized;
  address: Localized;
  /** Free-text query for Google Maps */
  mapsQuery: string;
  dressCode?: Localized;
  note?: Localized;
}

export interface Verse {
  text: Localized;
  ref: Localized;
}

export interface WeddingContent {
  siteUrl: string;
  couple: {
    groom: Person;
    bride: Person;
    /** The two of them together, in the Couple section */
    photo: Photo;
  };
  ceremony: {
    startIso: string;
    city: Localized;
    church: Localized;
  };
  verses: { hero: Verse };
  wording: {
    togetherLine: Localized;
    inviteLine: Localized;
    /** Parents' lines; omit until known */
    hostsGroom?: Localized;
    hostsBride?: Localized;
    requestLine: Localized;
    closingLine: Localized;
  };
  events: WeddingEvent[];
  /** Opening photograph (the church scene) */
  hero: { photo: Photo };
  livestream: { url: string; note: Localized };
  blessings: Localized;
  /** The background track; title, credit and creditUrl are kept for the record and not shown */
  music: { src: string; title: string; credit: string; creditUrl: string };
}
