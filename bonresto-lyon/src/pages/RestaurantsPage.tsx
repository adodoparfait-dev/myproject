import { Clock, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { View } from "../App";
import { CUISINES, QUARTIERS, RESTAURANTS } from "../data/restaurants";

export default function RestaurantsPage({ navigate }: { navigate: (v: View) => void }) {
  const [query, setQuery] = useState("");
  const [quartier, setQuartier] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESTAURANTS.filter((r) => {
      if (quartier && r.quartier !== quartier) return false;
      if (cuisine && r.cuisine !== cuisine) return false;
      if (q && !r.name.toLowerCase().includes(q) && !r.cuisine.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [query, quartier, cuisine]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">
        Restaurants à Lyon
      </h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        {RESTAURANTS.length} établissements partenaires, click &amp; collect sans frais de livraison.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher un restaurant ou une cuisine..."
            className="w-full rounded-full border border-[var(--wine)]/15 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[var(--wine)]/40"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip label="Tous les quartiers" active={quartier === null} onClick={() => setQuartier(null)} />
        {QUARTIERS.map((q) => (
          <FilterChip key={q} label={q} active={quartier === q} onClick={() => setQuartier(q)} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <FilterChip label="Toutes les cuisines" active={cuisine === null} onClick={() => setCuisine(null)} subtle />
        {CUISINES.map((c) => (
          <FilterChip key={c} label={c} active={cuisine === c} onClick={() => setCuisine(c)} subtle />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-[var(--ink-soft)]">
          Aucun restaurant ne correspond à ta recherche.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate({ name: "detail", restaurantId: r.id })}
              className="group overflow-hidden rounded-2xl border border-[var(--wine)]/10 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="flex h-28 items-center justify-center font-display text-3xl font-semibold text-white"
                style={{ background: r.color }}
              >
                {r.name.slice(0, 1)}
              </div>
              <div className="p-4">
                <p className="font-semibold text-[var(--ink)]">{r.name}</p>
                <p className="mt-0.5 text-sm text-[var(--ink-soft)]">{r.cuisine}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-[var(--ink-soft)]">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {r.quartier}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> ~{r.pickupMinutes} min
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  subtle,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-[var(--wine)] bg-[var(--wine)] text-[var(--cream)]"
          : subtle
            ? "border-[var(--wine)]/10 bg-white text-[var(--ink-soft)] hover:border-[var(--wine)]/30"
            : "border-[var(--wine)]/20 bg-white text-[var(--ink)] hover:border-[var(--wine)]/40"
      }`}
    >
      {label}
    </button>
  );
}
