import { ChevronRight, Heart, Smartphone, TrendingDown, UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import type { View } from "../App";
import { RESTAURANTS } from "../data/restaurants";

export default function HomePage({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--wine)]/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--wine)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--wine)]">
              <UtensilsCrossed size={13} /> Fait à Lyon
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-5xl">
              La commande en ligne qui profite aux restaurants lyonnais,
              <span className="text-[var(--wine)]"> pas aux plateformes.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-[var(--ink-soft)]">
              Click &amp; collect, prix fixe plutôt que 30&nbsp;% de commission, et des
              outils pour que chaque restaurateur garde la main sur sa clientèle.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ name: "restaurants" })}
                className="rounded-full bg-[var(--wine)] px-6 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--wine-dark)]"
              >
                Découvrir les restaurants
              </button>
              <button
                onClick={() => navigate({ name: "rejoindre" })}
                className="flex items-center gap-1 rounded-full border border-[var(--wine)]/30 px-6 py-3 text-sm font-semibold text-[var(--wine)] transition hover:bg-[var(--wine)]/5"
              >
                Je suis restaurateur <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {RESTAURANTS.slice(0, 4).map((r) => (
              <button
                key={r.id}
                onClick={() => navigate({ name: "detail", restaurantId: r.id })}
                className="group overflow-hidden rounded-2xl border border-[var(--wine)]/10 bg-white text-left shadow-sm transition hover:shadow-md"
              >
                <div
                  className="flex h-20 items-center justify-center text-2xl font-display font-semibold text-white"
                  style={{ background: r.color }}
                >
                  {r.name.slice(0, 1)}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-[var(--ink)]">{r.name}</p>
                  <p className="truncate text-xs text-[var(--ink-soft)]">{r.quartier}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Problème / solution */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--wine)]/10 bg-white p-6">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
              Le problème des grandes plateformes
            </h2>
            <ul className="mt-4 space-y-3 text-[var(--ink-soft)]">
              <li>— Jusqu'à 30&nbsp;% de commission prélevée sur chaque commande.</li>
              <li>— Les données clients restent chez la plateforme, pas chez le restaurant.</li>
              <li>— Des milliers d'établissements mis en concurrence sans visibilité locale.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--wine)]/10 bg-[var(--wine)] p-6 text-[var(--cream)]">
            <h2 className="font-display text-xl font-semibold">Ce que propose LeBonResto</h2>
            <ul className="mt-4 space-y-3 text-[var(--cream)]/90">
              <li>— Un prix fixe mensuel, jamais de commission sur les ventes.</li>
              <li>— Le restaurateur garde ses clients : emails, promos, fidélité.</li>
              <li>— Une plateforme pensée pour Lyon, pas noyée dans une offre nationale.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="border-y border-[var(--wine)]/10 bg-[var(--cream-soft)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl font-semibold text-[var(--ink)]">
            Plus humain, plus local
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <Feature
              icon={<TrendingDown size={22} />}
              title="Prix fixe"
              description="49 à 149 €/mois selon la formule, quel que soit le nombre de commandes."
            />
            <Feature
              icon={<Heart size={22} />}
              title="Fidélisation"
              description="Emailing et promos pour faire revenir vos clients, sans intermédiaire."
            />
            <Feature
              icon={<Smartphone size={22} />}
              title="Click & collect simple"
              description="Les clients commandent et récupèrent sur place, sans frais de livraison."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
          Vous tenez un restaurant à Lyon ?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[var(--ink-soft)]">
          Rejoignez les premiers établissements partenaires et gardez la relation
          avec vos clients.
        </p>
        <button
          onClick={() => navigate({ name: "rejoindre" })}
          className="mt-6 rounded-full bg-[var(--wine)] px-6 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--wine-dark)]"
        >
          Voir les formules
        </button>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wine)]/10 text-[var(--wine)]">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">{description}</p>
    </div>
  );
}
