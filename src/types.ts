export interface Note {
  id: string;
  title: string;
  content: string; // markdown
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Card {
  id: string;
  noteId: string | null;
  front: string;
  back: string;
  tags: string[];
  createdAt: string; // ISO

  // SM-2 scheduling state
  interval: number; // days
  repetitions: number;
  easiness: number;
  dueDate: string; // ISO date (YYYY-MM-DD)
  lastReviewedAt: string | null; // ISO
}

export type ReviewQuality = 0 | 3 | 4 | 5; // Again / Hard / Good / Easy

export interface ReviewLog {
  id: string;
  cardId: string;
  reviewedAt: string; // ISO
  quality: ReviewQuality;
  previousInterval: number;
  newInterval: number;
}

export interface Settings {
  anthropicApiKey: string;
  model: string;
}
