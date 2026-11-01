import type { Card, ReviewQuality } from "../types";

const MIN_EASINESS = 1.3;
const DEFAULT_EASINESS = 2.5;

export function newCardScheduleDefaults(): Pick<
  Card,
  "interval" | "repetitions" | "easiness" | "dueDate" | "lastReviewedAt"
> {
  return {
    interval: 0,
    repetitions: 0,
    easiness: DEFAULT_EASINESS,
    dueDate: new Date().toISOString().slice(0, 10),
    lastReviewedAt: null,
  };
}

/**
 * SM-2 scheduling: given a card's current state and a review quality
 * (0 = Again, 3 = Hard, 4 = Good, 5 = Easy), returns the updated state.
 */
export function scheduleNextReview(
  card: Pick<Card, "interval" | "repetitions" | "easiness">,
  quality: ReviewQuality,
): { interval: number; repetitions: number; easiness: number; dueDate: string } {
  let { interval, repetitions, easiness } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easiness);
    }
    repetitions += 1;
  }

  easiness =
    easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easiness < MIN_EASINESS) easiness = MIN_EASINESS;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    interval,
    repetitions,
    easiness: Math.round(easiness * 100) / 100,
    dueDate: dueDate.toISOString().slice(0, 10),
  };
}

export function isDue(card: Card, referenceDate = new Date()): boolean {
  const today = referenceDate.toISOString().slice(0, 10);
  return card.dueDate <= today;
}
