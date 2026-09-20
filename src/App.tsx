import { BarChart3, BookOpen, Layers, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import NotesPage from "./pages/NotesPage";
import ReviewPage from "./pages/ReviewPage";
import SettingsPage from "./pages/SettingsPage";
import StatsPage from "./pages/StatsPage";
import { useStore } from "./store/StoreContext";
import { isDue } from "./lib/srs";

type View = "notes" | "review" | "stats" | "settings";

const NAV: { id: View; label: string; icon: typeof BookOpen }[] = [
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "review", label: "Révision", icon: Layers },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "settings", label: "Réglages", icon: SettingsIcon },
];

export default function App() {
  const [view, setView] = useState<View>("notes");
  const { cards } = useStore();
  const dueCount = cards.filter((c) => isDue(c)).length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="flex w-20 flex-col items-center gap-2 border-r border-slate-200 bg-white py-4 dark:border-slate-800 dark:bg-slate-900 sm:w-56 sm:items-stretch sm:px-3">
        <div className="mb-4 hidden px-2 text-lg font-bold text-indigo-600 sm:block dark:text-indigo-400">
          Memo
        </div>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`relative flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition sm:justify-start ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              <span className="hidden sm:inline">{label}</span>
              {id === "review" && dueCount > 0 && (
                <span
                  className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold sm:static sm:ml-auto ${
                    active ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
                  }`}
                >
                  {dueCount}
                </span>
              )}
            </button>
          );
        })}
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto">
        {view === "notes" && <NotesPage onGenerateGoReview={() => setView("review")} />}
        {view === "review" && <ReviewPage />}
        {view === "stats" && <StatsPage />}
        {view === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}
