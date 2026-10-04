import { Fragment } from "react";

/** An ampersand inside a line set in the names voice: Pinyon's own is an old "Et" form that reads oddly, so it is set in the serif. */
export function Amp() {
  return (
    <span className="font-serif italic [font-size:0.8em]" aria-hidden="true">
      &amp;
    </span>
  );
}

/** Free text (a guest's name) in the names voice, with any "&" swapped for the serif ampersand. */
export function ScriptText({ text }: { text: string }) {
  const parts = text.split("&");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <Amp />}
          {part}
        </Fragment>
      ))}
    </>
  );
}
