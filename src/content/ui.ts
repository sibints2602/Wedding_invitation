import type { Lang, Localized } from "./types";

/** Interface strings (buttons, labels, section titles). */
export const ui = {
  tapToOpen: { en: "Tap to open", ml: "തുറക്കാൻ തൊടുക", kn: "ತೆರೆಯಲು ಸ್ಪರ್ಶಿಸಿ" },
  youAreInvited: { en: "You Are Invited", ml: "നിങ്ങളെ ക്ഷണിക്കുന്നു", kn: "ನಿಮಗೆ ಆತ್ಮೀಯ ಆಹ್ವಾನ" },
  and: { en: "and", ml: "&", kn: "&" },
  dear: { en: "Dear", ml: "പ്രിയപ്പെട്ട", kn: "ಪ್ರಿಯ" },
  dearGuest: { en: "Dear Guest", ml: "പ്രിയ അതിഥി", kn: "ಪ್ರಿಯ ಅತಿಥಿ" },
  musicOn: { en: "Music on", ml: "സംഗീതം ഓൺ", kn: "ಸಂಗೀತ ಆನ್" },
  musicOff: { en: "Music off", ml: "സംഗീതം ഓഫ്", kn: "ಸಂಗೀತ ಆಫ್" },
  switchLanguage: { en: "Switch language", ml: "ഭാഷ മാറ്റുക", kn: "ಭಾಷೆ ಬದಲಿಸಿ" },
  directions: { en: "Directions", ml: "വഴി കാണിക്കുക", kn: "ದಾರಿ ತೋರಿಸಿ" },
  addToCalendar: { en: "Add to calendar", ml: "കലണ്ടറിൽ ചേർക്കുക", kn: "ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ" },
  googleCalendar: { en: "Google Calendar", ml: "ഗൂഗിൾ കലണ്ടർ", kn: "ಗೂಗಲ್ ಕ್ಯಾಲೆಂಡರ್" },
  appleCalendar: { en: "Apple / Outlook (.ics)", ml: "ആപ്പിൾ / ഔട്ട്‌ലുക്ക് (.ics)", kn: "ಆಪಲ್ / ಔಟ್‌ಲುಕ್ (.ics)" },
  dressCode: { en: "Dress code", ml: "വേഷവിധാനം", kn: "ಉಡುಗೆ" },
  celebrationLead: { en: "An evening of joy, one sacred promise.", ml: "ആഹ്ലാദത്തിന്റെ ഒരു സായാഹ്നം, ഒരു പവിത്ര വാഗ്ദാനം.", kn: "ಒಂದು ಸಂತೋಷದ ಸಂಜೆ, ಒಂದು ಪವಿತ್ರ ವಾಗ್ದಾನ." },
  celebration: { en: "The celebration", ml: "ആഘോഷം", kn: "ಸಂಭ್ರಮ" },
  countdownLead: { en: "Counting the days to the ceremony", ml: "ചടങ്ങിലേക്ക് ഇനി", kn: "ಸಮಾರಂಭಕ್ಕೆ ಇನ್ನು" },
  days: { en: "days", ml: "ദിവസം", kn: "ದಿನ" },
  hours: { en: "hours", ml: "മണിക്കൂർ", kn: "ಗಂಟೆ" },
  minutes: { en: "minutes", ml: "മിനിറ്റ്", kn: "ನಿಮಿಷ" },
  seconds: { en: "seconds", ml: "സെക്കൻഡ്", kn: "ಸೆಕೆಂಡ್" },
  engaged: { en: "Engaged!", ml: "വിവാഹനിശ്ചയം കഴിഞ്ഞു!", kn: "ನಿಶ್ಚಿತಾರ್ಥವಾಯಿತು!" },
  scratchToReveal: { en: "Scratch to reveal", ml: "ചുരണ്ടി നോക്കൂ", kn: "ಕೆರೆದು ನೋಡಿ" },
  coupleLead: { en: "Two hearts, one calling.", ml: "രണ്ടു ഹൃദയങ്ങൾ, ഒരേ വിളി.", kn: "ಎರಡು ಹೃದಯಗಳು, ಒಂದೇ ಕರೆ." },
  theGroom: { en: "The groom-to-be", ml: "വരൻ", kn: "ಭಾವಿ ವರ" },
  theBride: { en: "The bride-to-be", ml: "വധു", kn: "ಭಾವಿ ವಧು" },
  livestreamLead: { en: "Can't be there in person?", ml: "നേരിട്ട് എത്താൻ കഴിയുന്നില്ലേ?", kn: "ನೇರವಾಗಿ ಬರಲು ಸಾಧ್ಯವಿಲ್ಲವೇ?" },
  livestream: { en: "Watch live", ml: "തത്സമയം കാണുക", kn: "ನೇರ ಪ್ರಸಾರ ನೋಡಿ" },
  blessingsTitle: { en: "With love", ml: "സ്നേഹപൂർവ്വം", kn: "ಪ್ರೀತಿಯಿಂದ" },
} satisfies Record<string, Localized>;

/** The languages, each named in its own script. */
export const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം" },
  { code: "kn", label: "ಕನ್ನಡ" },
];
