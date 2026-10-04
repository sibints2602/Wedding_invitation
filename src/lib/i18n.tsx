"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { LANGS, type Lang, type Localized } from "@/content/types";

const STORAGE_KEY = "lang";

function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

/** `?lang=` wins, then stored preference, else English. */
export function resolveInitialLang(search: string, stored: string | null): Lang {
  const fromQuery = new URLSearchParams(search).get("lang");
  if (isLang(fromQuery)) return fromQuery;
  if (isLang(stored)) return stored;
  return "en";
}

/* A tiny external store so the language can be read with useSyncExternalStore:
   the server (and hydration) see "en"; the client then applies the preference. */
const listeners = new Set<() => void>();
let current: Lang | null = null;

function readInitial(): Lang {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {}
  return resolveInitialLang(window.location.search, stored);
}
const getSnapshot = (): Lang => (current ??= readInitial());
const getServerSnapshot = (): Lang => "en";
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
function setLangStore(l: Lang) {
  current = l;
  try {
    window.localStorage.setItem(STORAGE_KEY, l);
  } catch {}
  listeners.forEach((fn) => fn());
}

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (p: Localized) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangStore(l), []);
  const value = useMemo<LangContextValue>(() => ({ lang, setLang, t: (p) => p[lang] }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
