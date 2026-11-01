import { Download, Eye, EyeOff, Monitor, Moon, Sun, TriangleAlert, Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useStore } from "../store/StoreContext";
import type { Theme } from "../types";

const MODELS = [
  { id: "claude-sonnet-5", label: "Claude Sonnet 5 (équilibré, recommandé)" },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (rapide, économique)" },
  { id: "claude-opus-5", label: "Claude Opus 5 (le plus capable)" },
];

const THEMES: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Clair", icon: Sun },
  { id: "dark", label: "Sombre", icon: Moon },
  { id: "system", label: "Système", icon: Monitor },
];

export default function SettingsPage() {
  const { settings, updateSettings, notes, cards, reviewLogs, importData } = useStore();
  const [showKey, setShowKey] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const payload = {
      exportedAt: new Date().toISOString(),
      notes,
      cards,
      reviewLogs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memo-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    setImportError(null);
    fileInputRef.current?.click();
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data.notes) || !Array.isArray(data.cards) || !Array.isArray(data.reviewLogs)) {
        throw new Error("Format invalide.");
      }
      const confirmed = confirm(
        `Importer ${data.notes.length} note(s) et ${data.cards.length} carte(s) ? Cela remplacera toutes tes données actuelles dans cette appli.`,
      );
      if (!confirmed) return;
      importData({ notes: data.notes, cards: data.cards, reviewLogs: data.reviewLogs });
    } catch {
      setImportError("Impossible de lire ce fichier. Vérifie qu'il s'agit bien d'un export Memo valide.");
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-xl font-semibold">Réglages</h1>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-1 text-sm font-medium">Clé API Anthropic</h2>
        <p className="mb-3 text-xs text-slate-400">
          Nécessaire uniquement pour la génération automatique de flashcards depuis
          tes notes. Obtiens une clé sur{" "}
          <a
            href="https://console.anthropic.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-500 underline"
          >
            console.anthropic.com
          </a>
          .
        </p>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={settings.anthropicApiKey}
            onChange={(e) => updateSettings({ anthropicApiKey: e.target.value })}
            placeholder="sk-ant-..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950"
          />
          <button
            onClick={() => setShowKey((s) => !s)}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
          <TriangleAlert size={28} className="shrink-0" />
          <p>
            Ta clé est stockée uniquement dans le stockage local de ce navigateur et
            appelle directement l'API Anthropic depuis ton appareil — elle n'est
            jamais envoyée ailleurs. Ne partage jamais cette clé, et ne déploie pas
            cette appli publiquement avec une clé enregistrée dedans.
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-medium">Modèle utilisé pour la génération</h2>
        <div className="space-y-2">
          {MODELS.map((m) => (
            <label
              key={m.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-sm has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50 dark:border-slate-700 dark:has-[:checked]:bg-indigo-950/30"
            >
              <input
                type="radio"
                name="model"
                checked={settings.model === m.id}
                onChange={() => updateSettings({ model: m.id })}
              />
              {m.label}
            </label>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-medium">Apparence</h2>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => updateSettings({ theme: id })}
              className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium ${
                settings.theme === id
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-1 text-sm font-medium">Sauvegarde des données</h2>
        <p className="mb-3 text-xs text-slate-400">
          Tes notes et cartes ne vivent que dans ce navigateur. Exporte-les
          régulièrement pour ne rien perdre, ou pour les transférer vers un autre
          appareil.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download size={14} />
            Exporter en JSON
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Upload size={14} />
            Importer un fichier
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
        {importError && <p className="mt-2 text-xs text-red-500">{importError}</p>}
      </section>
    </div>
  );
}
