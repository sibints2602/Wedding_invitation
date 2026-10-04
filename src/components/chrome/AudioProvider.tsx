"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAudio, type AudioPlayer } from "@/lib/useAudio";

const Ctx = createContext<AudioPlayer | null>(null);

export function AudioProvider({ src, children }: { src: string; children: ReactNode }) {
  const player = useAudio(src);
  return <Ctx.Provider value={player}>{children}</Ctx.Provider>;
}

export function useAudioPlayer(): AudioPlayer {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudioPlayer must be used inside <AudioProvider>");
  return ctx;
}
