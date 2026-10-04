export type Countdown = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

const SEC = 1000, MIN = 60 * SEC, HOUR = 60 * MIN, DAY = 24 * HOUR;

/** Time remaining until `targetIso`, clamped at zero. */
export function getCountdown(targetIso: string, now: Date = new Date()): Countdown {
  const target = new Date(targetIso).getTime();
  const diff = target - now.getTime();
  if (!Number.isFinite(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MIN),
    seconds: Math.floor((diff % MIN) / SEC),
    done: false,
  };
}
