import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { newId, storage } from "../lib/storage";
import { newCardScheduleDefaults, scheduleNextReview } from "../lib/srs";
import type { Card, Note, ReviewLog, ReviewQuality, Settings } from "../types";

interface StoreValue {
  notes: Note[];
  cards: Card[];
  reviewLogs: ReviewLog[];
  settings: Settings;

  addNote: (title: string, content: string, tags: string[]) => Note;
  updateNote: (id: string, patch: Partial<Pick<Note, "title" | "content" | "tags">>) => void;
  deleteNote: (id: string) => void;

  addCard: (input: { noteId: string | null; front: string; back: string; tags: string[] }) => Card;
  addCards: (
    inputs: { noteId: string | null; front: string; back: string; tags: string[] }[],
  ) => Card[];
  updateCard: (id: string, patch: Partial<Pick<Card, "front" | "back" | "tags">>) => void;
  deleteCard: (id: string) => void;
  reviewCard: (id: string, quality: ReviewQuality) => void;

  updateSettings: (patch: Partial<Settings>) => void;

  importData: (data: { notes: Note[]; cards: Card[]; reviewLogs: ReviewLog[] }) => void;

  allTags: string[];
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => storage.loadNotes());
  const [cards, setCards] = useState<Card[]>(() => storage.loadCards());
  const [reviewLogs, setReviewLogs] = useState<ReviewLog[]>(() =>
    storage.loadReviewLogs(),
  );
  const [settings, setSettings] = useState<Settings>(() =>
    storage.loadSettings(),
  );

  function persistNotes(next: Note[]) {
    setNotes(next);
    storage.saveNotes(next);
  }
  function persistCards(next: Card[]) {
    setCards(next);
    storage.saveCards(next);
  }
  function persistReviewLogs(next: ReviewLog[]) {
    setReviewLogs(next);
    storage.saveReviewLogs(next);
  }
  function persistSettings(next: Settings) {
    setSettings(next);
    storage.saveSettings(next);
  }

  function addNote(title: string, content: string, tags: string[]): Note {
    const now = new Date().toISOString();
    const note: Note = { id: newId(), title, content, tags, createdAt: now, updatedAt: now };
    persistNotes([note, ...notes]);
    return note;
  }

  function updateNote(id: string, patch: Partial<Pick<Note, "title" | "content" | "tags">>) {
    persistNotes(
      notes.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n,
      ),
    );
  }

  function deleteNote(id: string) {
    persistNotes(notes.filter((n) => n.id !== id));
    persistCards(cards.map((c) => (c.noteId === id ? { ...c, noteId: null } : c)));
  }

  function addCard(input: { noteId: string | null; front: string; back: string; tags: string[] }): Card {
    const card: Card = {
      id: newId(),
      noteId: input.noteId,
      front: input.front,
      back: input.back,
      tags: input.tags,
      createdAt: new Date().toISOString(),
      ...newCardScheduleDefaults(),
    };
    persistCards([card, ...cards]);
    return card;
  }

  function addCards(
    inputs: { noteId: string | null; front: string; back: string; tags: string[] }[],
  ): Card[] {
    const now = new Date().toISOString();
    const newCards: Card[] = inputs.map((input) => ({
      id: newId(),
      noteId: input.noteId,
      front: input.front,
      back: input.back,
      tags: input.tags,
      createdAt: now,
      ...newCardScheduleDefaults(),
    }));
    persistCards([...newCards, ...cards]);
    return newCards;
  }

  function updateCard(id: string, patch: Partial<Pick<Card, "front" | "back" | "tags">>) {
    persistCards(cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function deleteCard(id: string) {
    persistCards(cards.filter((c) => c.id !== id));
  }

  function reviewCard(id: string, quality: ReviewQuality) {
    const card = cards.find((c) => c.id === id);
    if (!card) return;
    const previousInterval = card.interval;
    const next = scheduleNextReview(card, quality);
    persistCards(
      cards.map((c) =>
        c.id === id
          ? { ...c, ...next, lastReviewedAt: new Date().toISOString() }
          : c,
      ),
    );
    const log: ReviewLog = {
      id: newId(),
      cardId: id,
      reviewedAt: new Date().toISOString(),
      quality,
      previousInterval,
      newInterval: next.interval,
    };
    persistReviewLogs([log, ...reviewLogs]);
  }

  function updateSettings(patch: Partial<Settings>) {
    persistSettings({ ...settings, ...patch });
  }

  function importData(data: { notes: Note[]; cards: Card[]; reviewLogs: ReviewLog[] }) {
    persistNotes(data.notes);
    persistCards(data.cards);
    persistReviewLogs(data.reviewLogs);
  }

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const n of notes) for (const t of n.tags) set.add(t);
    for (const c of cards) for (const t of c.tags) set.add(t);
    return Array.from(set).sort();
  }, [notes, cards]);

  const value: StoreValue = {
    notes,
    cards,
    reviewLogs,
    settings,
    addNote,
    updateNote,
    deleteNote,
    addCard,
    addCards,
    updateCard,
    deleteCard,
    reviewCard,
    updateSettings,
    importData,
    allTags,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
