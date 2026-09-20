import { PartyPopper } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { isDue } from "../lib/srs";
import { useStore } from "../store/StoreContext";
import type { ReviewQuality } from "../types";

const RATINGS: { quality: ReviewQuality; label: string; hint: string; className: string }[] = [
  { quality: 0, label: "Revoir", hint: "< 1 jour", className: "bg-red-500 hover:bg-red-400" },
  { quality: 3, label: "Difficile", hint: "", className: "bg-orange-500 hover:bg-orange-400" },
  { quality: 4, label: "Correct", hint: "", className: "bg-emerald-500 hover:bg-emerald-400" },
  { quality: 5, label: "Facile", hint: "", className: "bg-indigo-500 hover:bg-indigo-400" },
];

export default function ReviewPage() {
  const { cards, reviewCard } = useStore();
  const [revealed, setRevealed] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);

  const dueCards = useMemo(
    () => cards.filter((c) => isDue(c)).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [cards],
  );
  const current = dueCards[0];
  const totalDue = dueCards.length + sessionDone;

  function handleRate(quality: ReviewQuality) {
    if (!current) return;
    reviewCard(current.id, quality);
    setSessionDone((n) => n + 1);
    setRevealed(false);
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        title="Pas encore de flashcards"
        subtitle="Crée des notes et génère des flashcards depuis l'onglet Notes."
      />
    );
  }

  if (!current) {
    return (
      <EmptyState
        icon={<PartyPopper className="text-indigo-500" size={40} />}
        title="Tout est à jour !"
        subtitle="Aucune carte à réviser pour le moment. Reviens plus tard."
      />
    );
  }

  const progress = totalDue > 0 ? Math.round((sessionDone / totalDue) * 100) : 0;

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col p-6">
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>{sessionDone} révisées</span>
          <span>{dueCards.length} restantes</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <button
          onClick={() => setRevealed((r) => !r)}
          className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-lg font-medium">{current.front}</p>
          {revealed ? (
            <>
              <div className="my-4 h-px w-16 bg-slate-200 dark:bg-slate-700" />
              <p className="text-slate-600 dark:text-slate-300">{current.back}</p>
            </>
          ) : (
            <p className="mt-4 text-xs text-slate-400">Clique pour révéler la réponse</p>
          )}
        </button>

        {revealed ? (
          <div className="grid w-full grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.quality}
                onClick={() => handleRate(r.quality)}
                className={`rounded-xl px-2 py-3 text-sm font-medium text-white transition ${r.className}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            Révéler la réponse
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      {icon}
      <p className="text-lg font-medium">{title}</p>
      <p className="max-w-sm text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}
