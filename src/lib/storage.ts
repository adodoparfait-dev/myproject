import type { Card, Note, ReviewLog, Settings } from "../types";

const KEYS = {
  notes: "memo:notes",
  cards: "memo:cards",
  reviewLogs: "memo:reviewLogs",
  settings: "memo:settings",
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  loadNotes: (): Note[] => load(KEYS.notes, []),
  saveNotes: (notes: Note[]) => save(KEYS.notes, notes),

  loadCards: (): Card[] => load(KEYS.cards, []),
  saveCards: (cards: Card[]) => save(KEYS.cards, cards),

  loadReviewLogs: (): ReviewLog[] => load(KEYS.reviewLogs, []),
  saveReviewLogs: (logs: ReviewLog[]) => save(KEYS.reviewLogs, logs),

  loadSettings: (): Settings => ({
    anthropicApiKey: "",
    model: "claude-sonnet-5",
    theme: "system",
    ...load<Partial<Settings>>(KEYS.settings, {}),
  }),
  saveSettings: (settings: Settings) => save(KEYS.settings, settings),
};

export function newId(): string {
  return crypto.randomUUID();
}

export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}
