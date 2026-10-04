import { describe, expect, test } from "vitest";
import { parseGuestName } from "@/lib/guest";

describe("parseGuestName", () => {
  test("decodes and trims", () => {
    expect(parseGuestName("Sibin%20%26%20Family")).toBe("Sibin & Family");
    expect(parseGuestName("  Anu Mathew ")).toBe("Anu Mathew");
  });
  test("strips angle brackets and quotes, keeps ampersand and apostrophe", () => {
    expect(parseGuestName('<b>Anu</b> & Co')).toBe("bAnu/b & Co");
    expect(parseGuestName(`O'Brien "family"`)).toBe("O'Brien family");
  });
  test("collapses whitespace and caps at 60 characters", () => {
    expect(parseGuestName("A    very   spaced   name")).toBe("A very spaced name");
    expect(parseGuestName("a".repeat(100))!.length).toBe(60);
  });
  test("returns null for empty or missing input", () => {
    expect(parseGuestName("")).toBeNull();
    expect(parseGuestName("   ")).toBeNull();
    expect(parseGuestName(null)).toBeNull();
    expect(parseGuestName(undefined)).toBeNull();
  });
  test("survives malformed percent encoding", () => {
    expect(parseGuestName("%E0%A4%A")).toBe("%E0%A4%A");
  });
});
