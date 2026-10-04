import { describe, expect, test } from "vitest";
import { getCountdown } from "@/lib/countdown";

describe("getCountdown", () => {
  test("splits the remaining time into days, hours, minutes, seconds", () => {
    expect(getCountdown("2027-01-23T10:30:00+05:30", new Date("2027-01-22T10:29:30+05:30"))).toEqual({
      days: 1, hours: 0, minutes: 0, seconds: 30, done: false,
    });
    expect(getCountdown("2027-01-23T10:30:00+05:30", new Date("2027-01-20T08:15:10+05:30"))).toEqual({
      days: 3, hours: 2, minutes: 14, seconds: 50, done: false,
    });
  });
  test("a past date is done with zeros, never negative", () => {
    expect(getCountdown("2020-01-01T00:00:00+05:30", new Date("2027-01-01T00:00:00Z"))).toEqual({
      days: 0, hours: 0, minutes: 0, seconds: 0, done: true,
    });
  });
  test("the exact moment counts as done", () => {
    expect(getCountdown("2027-01-23T05:00:00Z", new Date("2027-01-23T05:00:00Z")).done).toBe(true);
  });
});
