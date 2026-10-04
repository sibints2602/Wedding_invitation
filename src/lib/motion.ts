/** The one easing every settle on the page uses: quick off the mark, long soft landing (mirrors --ease-out-strong in globals.css). */
export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
/** The same curve for the Web Animations API. */
export const EASE_OUT_CSS = `cubic-bezier(${EASE_OUT.join(", ")})`;
