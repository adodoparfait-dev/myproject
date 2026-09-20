import type { ReviewLog } from "../types";

export interface DayBucket {
  date: string; // YYYY-MM-DD
  correct: number;
  incorrect: number;
}

export function lastNDaysBuckets(logs: ReviewLog[], days: number): DayBucket[] {
  const buckets = new Map<string, DayBucket>();
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { date: key, correct: 0, incorrect: 0 });
  }
  for (const log of logs) {
    const key = log.reviewedAt.slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (log.quality >= 3) bucket.correct += 1;
    else bucket.incorrect += 1;
  }
  return Array.from(buckets.values());
}

export function retentionRate(logs: ReviewLog[]): number | null {
  if (logs.length === 0) return null;
  const correct = logs.filter((l) => l.quality >= 3).length;
  return Math.round((correct / logs.length) * 100);
}

export function currentStreak(logs: ReviewLog[]): number {
  const days = new Set(logs.map((l) => l.reviewedAt.slice(0, 10)));
  const cursor = new Date();
  let streak = 0;
  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
