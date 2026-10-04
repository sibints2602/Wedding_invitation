"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PREF_KEY = "music";

export type AudioPlayer = {
  playing: boolean;
  /** Begin playback (must be called from a user gesture). Respects a stored "off" preference. */
  start: () => Promise<void>;
  toggle: () => Promise<void>;
};

export function useAudio(src: string): AudioPlayer {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const ensure = useCallback(() => {
    if (ref.current) return ref.current;
    const el = new Audio(src);
    el.loop = true;
    el.volume = 0.5;
    el.preload = "none";
    el.addEventListener("play", () => setPlaying(true));
    el.addEventListener("pause", () => setPlaying(false));
    ref.current = el;
    return el;
  }, [src]);

  useEffect(() => {
    return () => {
      ref.current?.pause();
      ref.current = null;
    };
  }, []);

  const start = useCallback(async () => {
    let pref: string | null = null;
    try {
      pref = window.localStorage.getItem(PREF_KEY);
    } catch {}
    if (pref === "off") return;
    try {
      await ensure().play();
    } catch {
      // Autoplay policy or missing file: stay silent, the pill shows "off".
    }
  }, [ensure]);

  const toggle = useCallback(async () => {
    const el = ensure();
    if (el.paused) {
      try {
        window.localStorage.setItem(PREF_KEY, "on");
      } catch {}
      try {
        await el.play();
      } catch {}
    } else {
      el.pause();
      try {
        window.localStorage.setItem(PREF_KEY, "off");
      } catch {}
    }
  }, [ensure]);

  return { playing, start, toggle };
}
