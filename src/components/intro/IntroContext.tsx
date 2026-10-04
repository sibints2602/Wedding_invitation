"use client";

import { createContext, startTransition, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

/** A point in viewport pixels. */
export type Point = { x: number; y: number };
/** Called the instant the envelope is opened, with the centre of the wax seal on screen (null if unknown). */
type OpenListener = (origin: Point | null) => void;

type Intro = {
  /** True from the tap that opens the envelope: the page beneath composes and the reveals may play. */
  opened: boolean;
  /** Open the page beneath the envelope. Listeners run synchronously first (see onOpen). */
  markOpened: (origin?: Point) => void;
  /**
   * Subscribe to the tap itself. Listeners run before React re-renders the page beneath (which takes a few
   * hundred milliseconds), so something that must move with the flap — the petals bursting from the seal —
   * can start at once. Returns the unsubscribe.
   */
  onOpen: (fn: OpenListener) => () => void;
};

const Ctx = createContext<Intro | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const listeners = useRef(new Set<OpenListener>());
  const onOpen = useCallback((fn: OpenListener) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);
  const markOpened = useCallback((origin?: Point) => {
    listeners.current.forEach((fn) => fn(origin ?? null));
    // the page beneath composes as a transition: React yields to the browser while rendering it, so the flap's
    // swing and the petals keep their frames instead of stalling until the whole page has re-rendered
    startTransition(() => setOpened(true));
  }, []);
  const value = useMemo(() => ({ opened, markOpened, onOpen }), [opened, markOpened, onOpen]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIntro(): Intro {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useIntro must be used inside <IntroProvider>");
  return ctx;
}
