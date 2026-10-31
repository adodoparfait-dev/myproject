import { Megaphone, Smartphone, Store, UtensilsCrossed } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { View } from "../App";

export default function HowItWorksPage({ navigate }: { navigate: (v: View) => void }) {
  const [tab, setTab] = useState<"clients" | "restaurateurs">("clients");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-center font-display text-3xl font-semibold text-[var(--ink)]">
        Comment ça marche
      </h1>

      <div className="mx-auto mt-6 flex w-fit rounded-full border border-[var(--wine)]/15 bg-white p-1">
        <button
          onClick={() => setTab("clients")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            tab === "clients" ? "bg-[var(--wine)] text-[var(--cream)]" : "text-[var(--ink-soft)]"
          }`}
        >
          Pour les clients
        </button>
        <button
          onClick={() => setTab("restaurateurs")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            tab === "restaurateurs" ? "bg-[var(--wine)] text-[var(--cream)]" : "text-[var(--ink-soft)]"
          }`}
        >
          Pour les restaurateurs
        </button>
      </div>

      {tab === "clients" ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <Step
            icon={<UtensilsCrossed size={20} />}
            step="1"
            title="Choisissez un restaurant"
            description="Parcourez les établissements lyonnais partenaires, par quartier ou par cuisine."
          />
          <Step
            icon={<Smartphone size={20} />}
            step="2"
            title="Commandez en ligne"
            description="Composez votre commande, réglez en ligne, aucun compte compliqué à créer."
          />
          <Step
            icon={<Store size={20} />}
            step="3"
            title="Récupérez sur place"
            description="Passez récupérer votre commande à l'heure indiquée, sans file d'attente."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <Step
            icon={<Store size={20} />}
            step="1"
            title="Créez votre page"
            description="Votre menu, vos photos et votre identité, mis en ligne avec vous en quelques jours."
          />
          <Step
            icon={<Smartphone size={20} />}
            step="2"
            title="Recevez les commandes"
            description="Les commandes arrivent directement chez vous, à prix fixe, sans commission variable."
          />
          <Step
            icon={<Megaphone size={20} />}
            step="3"
            title="Fidélisez vos clients"
            description="Emailing et promotions pour faire revenir votre clientèle, à vous de la garder."
          />
        </div>
      )}

      <div className="mt-14 text-center">
        <button
          onClick={() => navigate(tab === "clients" ? { name: "restaurants" } : { name: "rejoindre" })}
          className="rounded-full bg-[var(--wine)] px-6 py-3 text-sm font-semibold text-[var(--cream)] hover:bg-[var(--wine-dark)]"
        >
          {tab === "clients" ? "Voir les restaurants" : "Voir les formules restaurateurs"}
        </button>
      </div>
    </div>
  );
}

function Step({
  icon,
  step,
  title,
  description,
}: {
  icon: ReactNode;
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--wine)]/10 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--wine)]/10 text-[var(--wine)]">
          {icon}
        </span>
        <span className="font-display text-sm font-semibold text-[var(--wine)]">Étape {step}</span>
      </div>
      <h3 className="mt-3 font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">{description}</p>
    </div>
  );
}
