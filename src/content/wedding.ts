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
      firstName: { en: "Priyank", ml: "പ്രിയങ്ക്", kn: "ಪ್ರಿಯಾಂಕ್" },
      fullName: { en: "Priyank", ml: "പ്രിയങ്ക്", kn: "ಪ್ರಿಯಾಂಕ್" },
    },
    bride: {
      firstName: { en: "Tosmy", ml: "ടോസ്മി", kn: "ಟೋಸ್ಮಿ" },
      fullName: { en: "Tosmy", ml: "ടോസ്മി", kn: "ಟೋಸ್ಮಿ" },
    },
  },

  ceremony: {
    startIso: ENGAGEMENT_START,
    city: { en: "Gandibagilu", ml: "ഗണ്ടിബാഗിലു", kn: "ಗಂಡಿಬಾಗಿಲು" },
    church: { en: "St. Thomas Church", ml: "സെന്റ് തോമസ് പള്ളി", kn: "ಸೇಂಟ್ ಥಾಮಸ್ ಚರ್ಚ್" },
  },

  verses: {
    hero: {
      text: {
        en: "Love is patient and is kind. Love doesn't envy, doesn't brag, is not proud. It bears all things, believes all things, hopes all things, endures all things.",
        ml: "സ്നേഹം ദീർഘമായി ക്ഷമിക്കയും ദയ കാണിക്കയും ചെയ്യുന്നു; സ്നേഹം സ്പർദ്ധിക്കുന്നില്ല, നിഗളിക്കുന്നില്ല, ചീർക്കുന്നില്ല. എല്ലാം പൊറുക്കുന്നു, എല്ലാം വിശ്വസിക്കുന്നു, എല്ലാം പ്രത്യാശിക്കുന്നു, എല്ലാം സഹിക്കുന്നു.",
        kn: "ಪ್ರೀತಿಯು ದೀರ್ಘಶಾಂತಿಯುಳ್ಳದ್ದು, ದಯೆಯುಳ್ಳದ್ದು; ಪ್ರೀತಿಯು ಹೊಟ್ಟೆಕಿಚ್ಚುಪಡುವುದಿಲ್ಲ, ಬಡಾಯಿ ಕೊಚ್ಚಿಕೊಳ್ಳುವುದಿಲ್ಲ, ಹೆಮ್ಮೆಪಡುವುದಿಲ್ಲ. ಎಲ್ಲವನ್ನೂ ತಾಳಿಕೊಳ್ಳುತ್ತದೆ, ಎಲ್ಲವನ್ನೂ ನಂಬುತ್ತದೆ, ಎಲ್ಲವನ್ನೂ ನಿರೀಕ್ಷಿಸುತ್ತದೆ, ಎಲ್ಲವನ್ನೂ ಸಹಿಸಿಕೊಳ್ಳುತ್ತದೆ.",
      },
      ref: { en: "1 Corinthians 13:4–7", ml: "1 കൊരിന്ത്യർ 13:4–7", kn: "1 ಕೊರಿಂಥದವರಿಗೆ 13:4–7" },
    },
  },

  wording: {
    togetherLine: { en: "Together with their families", ml: "ഇരു കുടുംബങ്ങളോടൊപ്പം", kn: "ಎರಡೂ ಕುಟುಂಬಗಳೊಂದಿಗೆ" },
    inviteLine: {
      en: "invite you to celebrate their Engagement",
      ml: "തങ്ങളുടെ വിവാഹനിശ്ചയത്തിൽ പങ്കുചേരാൻ നിങ്ങളെ സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു",
      kn: "ತಮ್ಮ ನಿಶ್ಚಿತಾರ್ಥದಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಲು ನಿಮ್ಮನ್ನು ಪ್ರೀತಿಯಿಂದ ಆಹ್ವಾನಿಸುತ್ತೇವೆ",
    },
    requestLine: {
      en: "request the honour of your presence at the Engagement ceremony of their children",
      ml: "തങ്ങളുടെ മക്കളുടെ വിവാഹനിശ്ചയച്ചടങ്ങിൽ സംബന്ധിച്ച് അനുഗ്രഹിക്കണമെന്ന് വിനയപൂർവ്വം അപേക്ഷിക്കുന്നു",
      kn: "ತಮ್ಮ ಮಕ್ಕಳ ನಿಶ್ಚಿತಾರ್ಥ ಸಮಾರಂಭದಲ್ಲಿ ತಾವು ಉಪಸ್ಥಿತರಿದ್ದು ಆಶೀರ್ವದಿಸಬೇಕೆಂದು ವಿನಮ್ರವಾಗಿ ವಿನಂತಿಸುತ್ತೇವೆ",
    },
    closingLine: {
      en: "Your presence and prayers will make our joy complete.",
      ml: "നിങ്ങളുടെ സാന്നിധ്യവും പ്രാർത്ഥനയും ഞങ്ങളുടെ സന്തോഷം പൂർണ്ണമാക്കും.",
      kn: "ನಿಮ್ಮ ಉಪಸ್ಥಿತಿ ಮತ್ತು ಪ್ರಾರ್ಥನೆ ನಮ್ಮ ಸಂತೋಷವನ್ನು ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ.",
    },
  },

  events: [
    {
      id: "engagement",
      name: { en: "Engagement Ceremony", ml: "വിവാഹനിശ്ചയം", kn: "ನಿಶ್ಚಿತಾರ್ಥ ಸಮಾರಂಭ" },
      startIso: ENGAGEMENT_START,
      endIso: "2026-11-21T19:00:00+05:30",
      venue: { en: "St. Thomas Church", ml: "സെന്റ് തോമസ് പള്ളി", kn: "ಸೇಂಟ್ ಥಾಮಸ್ ಚರ್ಚ್" },
      address: { en: "St. Thomas Church, Gandibagilu", ml: "സെന്റ് തോമസ് പള്ളി, ഗണ്ടിബാഗിലു", kn: "ಸೇಂಟ್ ಥಾಮಸ್ ಚರ್ಚ್, ಗಂಡಿಬಾಗಿಲು" },
      mapsQuery: "St. Thomas Church, Gandibagilu",
      note: { en: "From 4 pm onwards.", ml: "വൈകുന്നേരം 4 മണി മുതൽ.", kn: "ಸಂಜೆ 4 ಗಂಟೆಯಿಂದ." },
    },
  ],

  hero: { photo: photos.heroCouple },

  livestream: {
    url: "https://www.youtube.com/live/placeholder",
    note: {
      en: "The stream begins 15 minutes before the ceremony.",
      ml: "ചടങ്ങിന് 15 മിനിറ്റ് മുൻപ് സംപ്രേഷണം ആരംഭിക്കും.",
      kn: "ಸಮಾರಂಭ ಆರಂಭವಾಗುವ 15 ನಿಮಿಷ ಮೊದಲು ನೇರ ಪ್ರಸಾರ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.",
    },
  },

  blessings: {
    en: "Your presence is the greatest blessing we could ask for.",
    ml: "നിങ്ങളുടെ സാന്നിധ്യമാണ് ഞങ്ങൾക്കേറ്റവും വലിയ അനുഗ്രഹം.",
    kn: "ನಿಮ್ಮ ಉಪಸ್ಥಿತಿಯೇ ನಾವು ಕೇಳಬಹುದಾದ ಅತಿದೊಡ್ಡ ಆಶೀರ್ವಾದ.",
  },

  music: {
    src: "/audio/love-melody.mp3",
    title: "Guitar and piano love melody",
    credit: "Clavier-Music (Pixabay Content License)",
    creditUrl: "https://pixabay.com/music/acoustic-group-guitar-and-piano-love-melody-233799/",
  },
};
