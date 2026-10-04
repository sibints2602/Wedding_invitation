import type { WeddingContent } from "./types";
import { photos } from "./photos.generated";

const ENGAGEMENT_START = "2026-11-21T16:00:00+05:30";

/**
 * Priyank & Tosmy — Engagement, 21 November 2026, St. Thomas Church, Gandibagilu.
 * Dates are IST (+05:30). Photos live in /public/photos (run `npm run photos` after changing them).
 * Still placeholder: parents' names (hidden until known), livestream link.
 */
export const wedding: WeddingContent = {
  siteUrl: "https://invitation-nine-nu.vercel.app/",

  couple: {
    photo: photos.hero,
    groom: {
      firstName: { en: "Priyank", ml: "പ്രിയങ്ക്" },
      fullName: { en: "Priyank", ml: "പ്രിയങ്ക്" },
    },
    bride: {
      firstName: { en: "Tosmy", ml: "ടോസ്മി" },
      fullName: { en: "Tosmy", ml: "ടോസ്മി" },
    },
  },

  ceremony: {
    startIso: ENGAGEMENT_START,
    city: { en: "Gandibagilu", ml: "ഗണ്ടിബാഗിലു" },
    church: { en: "St. Thomas Church", ml: "സെന്റ് തോമസ് പള്ളി" },
  },

  verses: {
    hero: {
      text: {
        en: "Love is patient and is kind. Love doesn't envy, doesn't brag, is not proud. It bears all things, believes all things, hopes all things, endures all things.",
        ml: "സ്നേഹം ദീർഘമായി ക്ഷമിക്കയും ദയ കാണിക്കയും ചെയ്യുന്നു; സ്നേഹം സ്പർദ്ധിക്കുന്നില്ല, നിഗളിക്കുന്നില്ല, ചീർക്കുന്നില്ല. എല്ലാം പൊറുക്കുന്നു, എല്ലാം വിശ്വസിക്കുന്നു, എല്ലാം പ്രത്യാശിക്കുന്നു, എല്ലാം സഹിക്കുന്നു.",
      },
      ref: { en: "1 Corinthians 13:4–7", ml: "1 കൊരിന്ത്യർ 13:4–7" },
    },
  },

  wording: {
    togetherLine: { en: "Together with their families", ml: "ഇരു കുടുംബങ്ങളോടൊപ്പം" },
    inviteLine: {
      en: "invite you to celebrate their Engagement",
      ml: "തങ്ങളുടെ വിവാഹനിശ്ചയത്തിൽ പങ്കുചേരാൻ നിങ്ങളെ സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു",
    },
    requestLine: {
      en: "request the honour of your presence at the Engagement ceremony of their children",
      ml: "തങ്ങളുടെ മക്കളുടെ വിവാഹനിശ്ചയച്ചടങ്ങിൽ സംബന്ധിച്ച് അനുഗ്രഹിക്കണമെന്ന് വിനയപൂർവ്വം അപേക്ഷിക്കുന്നു",
    },
    closingLine: {
      en: "Your presence and prayers will make our joy complete.",
      ml: "നിങ്ങളുടെ സാന്നിധ്യവും പ്രാർത്ഥനയും ഞങ്ങളുടെ സന്തോഷം പൂർണ്ണമാക്കും.",
    },
  },

  events: [
    {
      id: "engagement",
      name: { en: "Engagement Ceremony", ml: "വിവാഹനിശ്ചയം" },
      startIso: ENGAGEMENT_START,
      endIso: "2026-11-21T19:00:00+05:30",
      venue: { en: "St. Thomas Church", ml: "സെന്റ് തോമസ് പള്ളി" },
      address: { en: "St. Thomas Church, Gandibagilu", ml: "സെന്റ് തോമസ് പള്ളി, ഗണ്ടിബാഗിലു" },
      mapsQuery: "St. Thomas Church, Gandibagilu",
      note: { en: "From 4 pm onwards.", ml: "വൈകുന്നേരം 4 മണി മുതൽ." },
    },
  ],

  hero: { photo: photos.heroScene },

  livestream: {
    url: "https://www.youtube.com/live/placeholder",
    note: {
      en: "The stream begins 15 minutes before the ceremony.",
      ml: "ചടങ്ങിന് 15 മിനിറ്റ് മുൻപ് സംപ്രേഷണം ആരംഭിക്കും.",
    },
  },

  blessings: {
    en: "Your presence is the greatest blessing we could ask for.",
    ml: "നിങ്ങളുടെ സാന്നിധ്യമാണ് ഞങ്ങൾക്കേറ്റവും വലിയ അനുഗ്രഹം.",
  },

  music: {
    src: "/audio/love-melody.mp3",
    title: "Guitar and piano love melody",
    credit: "Clavier-Music (Pixabay Content License)",
    creditUrl: "https://pixabay.com/music/acoustic-group-guitar-and-piano-love-melody-233799/",
  },
};
