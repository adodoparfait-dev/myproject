import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store/StoreContext";

const MODELS = [
  { id: "claude-sonnet-5", label: "Claude Sonnet 5 (équilibré, recommandé)" },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (rapide, économique)" },
  { id: "claude-opus-5", label: "Claude Opus 5 (le plus capable)" },
];

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [showKey, setShowKey] = useState(false);

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

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
    </div>
  );
}
