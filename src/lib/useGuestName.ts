"use client";

import { useSyncExternalStore } from "react";
import { parseGuestName } from "./guest";

const subscribe = () => () => {};
const read = () => parseGuestName(new URLSearchParams(window.location.search).get("to"));
const serverRead = () => null;

/** Reads `?to=` on the client; null during SSR and hydration (so no mismatch). */
export function useGuestName(): string | null {
  return useSyncExternalStore(subscribe, read, serverRead);
}
