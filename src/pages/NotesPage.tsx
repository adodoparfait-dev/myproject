import { Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ClaudeApiError, generateFlashcardsFromNote, type GeneratedCard } from "../lib/claude";
import { renderMarkdown } from "../lib/markdown";
import { useStore } from "../store/StoreContext";
import type { Card, Note } from "../types";

function parseTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export default function NotesPage({ onGenerateGoReview }: { onGenerateGoReview: () => void }) {
  const { notes, cards, addNote, updateNote, deleteNote, addCard, addCards, updateCard, deleteCard, settings } =
    useStore();
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [pendingCards, setPendingCards] = useState<GeneratedCard[] | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.includes(q)),
    );
  }, [notes, query]);

  const selected = notes.find((n) => n.id === selectedId) ?? null;
  const noteCards = useMemo(
    () => cards.filter((c) => c.noteId === selectedId),
    [cards, selectedId],
  );

  function handleAddManualCard() {
    if (!selected) return;
    addCard({ noteId: selected.id, front: "", back: "", tags: selected.tags });
  }

  function handleCreateNote() {
    const note = addNote("Nouvelle note", "", []);
    setSelectedId(note.id);
    setPreview(false);
  }

  function handleDeleteNote(note: Note) {
    if (!confirm(`Supprimer la note "${note.title}" ?`)) return;
    deleteNote(note.id);
    if (selectedId === note.id) setSelectedId(null);
  }

  async function handleGenerate() {
    if (!selected) return;
    setGenError(null);
    setGenerating(true);
    try {
      const cards = await generateFlashcardsFromNote(
        settings.anthropicApiKey,
        settings.model,
        selected.title,
        selected.content,
      );
      if (cards.length === 0) {
        setGenError("Aucune flashcard n'a pu être extraite de cette note.");
      } else {
        setPendingCards(cards);
      }
    } catch (err) {
      setGenError(err instanceof ClaudeApiError ? err.message : "Erreur inattendue.");
    } finally {
      setGenerating(false);
    }
  }

  function confirmAddCards(cardsToAdd: GeneratedCard[]) {
    if (!selected) return;
    addCards(
      cardsToAdd.map((c) => ({
        noteId: selected.id,
        front: c.front,
        back: c.back,
        tags: selected.tags,
      })),
    );
    setPendingCards(null);
  }

  return (
    <div className="flex h-full">
      <div className="flex w-full max-w-xs flex-col border-r border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <button
            onClick={handleCreateNote}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            title="Nouvelle note"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="p-4 text-center text-sm text-slate-400">
              Aucune note. Crée-en une pour commencer.
            </p>
          )}
          {filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setSelectedId(n.id);
                setPreview(false);
                setPendingCards(null);
                setGenError(null);
              }}
              className={`block w-full border-b border-slate-100 px-4 py-3 text-left dark:border-slate-800/60 ${
                n.id === selectedId
                  ? "bg-indigo-50 dark:bg-indigo-950/40"
                  : "hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <div className="truncate text-sm font-medium">{n.title || "Sans titre"}</div>
              <div className="mt-0.5 truncate text-xs text-slate-400">
                {n.content.slice(0, 60) || "Note vide"}
              </div>
              {n.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {n.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {!selected && (
          <div className="flex h-full items-center justify-center text-slate-400">
            Sélectionne ou crée une note pour commencer.
          </div>
        )}
        {selected && (
          <>
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
              <input
                value={selected.title}
                onChange={(e) => updateNote(selected.id, { title: e.target.value })}
                placeholder="Titre de la note"
                className="flex-1 bg-transparent text-lg font-semibold outline-none"
              />
              <button
                onClick={() => setPreview((p) => !p)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {preview ? "Éditer" : "Aperçu"}
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || !selected.content.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles size={14} />
                {generating ? "Génération..." : "Générer des flashcards"}
              </button>
              <button
                onClick={() => handleDeleteNote(selected)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                title="Supprimer la note"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-800">
              <input
                defaultValue={selected.tags.join(", ")}
                onBlur={(e) => updateNote(selected.id, { tags: parseTags(e.target.value) })}
                placeholder="tags séparés par des virgules (ex: histoire, chapitre-3)"
                className="w-full bg-transparent text-xs text-slate-500 outline-none placeholder:text-slate-400 dark:text-slate-400"
              />
            </div>

            {genError && (
              <div className="mx-3 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {genError}
              </div>
            )}

            {pendingCards && (
              <GeneratedCardsReview
                cards={pendingCards}
                onCancel={() => setPendingCards(null)}
                onConfirm={(cards) => {
                  confirmAddCards(cards);
                  onGenerateGoReview();
                }}
              />
            )}

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {preview ? (
                <div
                  className="prose-note max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.content) }}
                />
              ) : (
                <textarea
                  value={selected.content}
                  onChange={(e) => updateNote(selected.id, { content: e.target.value })}
                  placeholder="Écris ta note en markdown..."
                  className="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
                />
              )}
            </div>

            <div className="max-h-64 shrink-0 overflow-y-auto border-t border-slate-200 p-3 dark:border-slate-800">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Cartes ({noteCards.length})
                </h3>
                <button
                  onClick={handleAddManualCard}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  <Plus size={12} /> Ajouter une carte
                </button>
              </div>
              {noteCards.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Aucune carte pour cette note. Génère-les avec l'IA ou ajoute-en une manuellement.
                </p>
              ) : (
                <div className="space-y-2">
                  {noteCards.map((card) => (
                    <CardRow
                      key={card.id}
                      card={card}
                      onUpdate={(patch) => updateCard(card.id, patch)}
                      onDelete={() => deleteCard(card.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CardRow({
  card,
  onUpdate,
  onDelete,
}: {
  card: Card;
  onUpdate: (patch: Partial<Pick<Card, "front" | "back">>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-start gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
      <div className="min-w-0 flex-1 space-y-1">
        <input
          defaultValue={card.front}
          onBlur={(e) => onUpdate({ front: e.target.value })}
          placeholder="Question"
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-slate-400"
        />
        <input
          defaultValue={card.back}
          onBlur={(e) => onUpdate({ back: e.target.value })}
          placeholder="Réponse"
          className="w-full bg-transparent text-sm text-slate-500 outline-none placeholder:text-slate-400 dark:text-slate-400"
        />
      </div>
      <button
        onClick={onDelete}
        className="shrink-0 rounded-md p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-red-950/40"
        title="Supprimer la carte"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function GeneratedCardsReview({
  cards,
  onConfirm,
  onCancel,
}: {
  cards: GeneratedCard[];
  onConfirm: (cards: GeneratedCard[]) => void;
  onCancel: () => void;
}) {
  const [items, setItems] = useState(cards.map((c, i) => ({ ...c, id: i, keep: true })));

  return (
    <div className="mx-3 mt-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-900 dark:bg-indigo-950/30">
      <p className="mb-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {items.filter((i) => i.keep).length} flashcard(s) proposée(s) — relis et décoche ce que tu ne veux pas garder.
      </p>
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-start gap-2 rounded-lg bg-white p-2 text-sm shadow-sm dark:bg-slate-900"
          >
            <input
              type="checkbox"
              checked={item.keep}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((i) => (i.id === item.id ? { ...i, keep: e.target.checked } : i)),
                )
              }
              className="mt-1"
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium">{item.front}</div>
              <div className="text-slate-500 dark:text-slate-400">{item.back}</div>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Annuler
        </button>
        <button
          onClick={() => onConfirm(items.filter((i) => i.keep))}
          disabled={items.every((i) => !i.keep)}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Ajouter aux révisions
        </button>
      </div>
    </div>
  );
}
