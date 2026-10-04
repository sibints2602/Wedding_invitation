import { describe, expect, test } from "vitest";
import { resolveInitialLang } from "@/lib/i18n";

describe("resolveInitialLang", () => {
  test("query string wins over storage", () => expect(resolveInitialLang("?lang=ml", "en")).toBe("ml"));
  test("stored language is used when no query", () => expect(resolveInitialLang("", "ml")).toBe("ml"));
  test("defaults to English", () => expect(resolveInitialLang("", null)).toBe("en"));
  test("Kannada is a language too", () => expect(resolveInitialLang("?lang=kn", "en")).toBe("kn"));
  test("unknown values are ignored", () => expect(resolveInitialLang("?lang=fr", "xx")).toBe("en"));
  test("query en overrides stored ml", () => expect(resolveInitialLang("?to=Anu&lang=en", "ml")).toBe("en"));
});
