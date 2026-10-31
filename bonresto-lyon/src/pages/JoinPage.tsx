import { Check, Mail, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";

const FORMULAS = [
  {
    name: "Visibilité",
    price: 49,
    description: "Une page vitrine professionnelle pour être trouvé en ligne.",
    features: ["Page restaurant avec menu et photos", "Référencement local Lyon", "Fiche mise à jour en continu"],
  },
  {
    name: "Commande en ligne",
    price: 99,
    description: "Le click & collect, sans commission sur les ventes.",
    features: ["Tout Visibilité", "Commande et paiement en ligne", "Gestion des créneaux de retrait"],
    highlight: true,
  },
  {
    name: "Premium",
    price: 149,
    description: "Pour développer une vraie relation avec vos clients.",
    features: ["Tout Commande en ligne", "Mise en avant sur la plateforme", "Emailing et promotions ciblées"],
  },
];

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
          Rejoignez les restaurants partenaires
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--ink-soft)]">
          Un prix fixe, pas de commission, et vos clients qui restent les vôtres.
          Frais d'installation unique de 200 à 300&nbsp;€ selon la formule.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {FORMULAS.map((f) => (
          <div
            key={f.name}
            className={`rounded-2xl border p-6 ${
              f.highlight
                ? "border-[var(--wine)] bg-[var(--wine)] text-[var(--cream)] shadow-md"
                : "border-[var(--wine)]/10 bg-white text-[var(--ink)]"
            }`}
          >
            {f.highlight && (
              <span className="rounded-full bg-[var(--cream)]/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                Le plus choisi
              </span>
            )}
            <h2 className="mt-2 font-display text-xl font-semibold">{f.name}</h2>
            <p className={`mt-1 text-sm ${f.highlight ? "text-[var(--cream)]/85" : "text-[var(--ink-soft)]"}`}>
              {f.description}
            </p>
            <p className="mt-4">
              <span className="font-display text-3xl font-semibold">{f.price} €</span>
              <span className={f.highlight ? "text-[var(--cream)]/80" : "text-[var(--ink-soft)]"}> /mois</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {f.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-xl">
        <h2 className="text-center font-display text-2xl font-semibold text-[var(--ink)]">
          On en discute ?
        </h2>
        <p className="mt-2 text-center text-[var(--ink-soft)]">
          Laissez vos coordonnées, on vous recontacte pour en parler — sans engagement.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-[var(--wine)]/10 bg-white p-6 text-center">
            <Check className="mx-auto text-[var(--wine)]" size={28} />
            <p className="mt-2 font-semibold text-[var(--ink)]">Merci ! (démo)</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              Dans la vraie plateforme, ce formulaire enverrait une demande de contact.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-2xl border border-[var(--wine)]/10 bg-white p-6">
            <input
              required
              placeholder="Nom du restaurant"
              className="w-full rounded-lg border border-[var(--wine)]/15 px-3 py-2.5 text-sm outline-none focus:border-[var(--wine)]/40"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-lg border border-[var(--wine)]/15 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--wine)]/40"
                />
              </div>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
                <input
                  required
                  type="tel"
                  placeholder="Téléphone"
                  className="w-full rounded-lg border border-[var(--wine)]/15 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--wine)]/40"
                />
              </div>
            </div>
            <textarea
              placeholder="Quelques mots sur votre restaurant (optionnel)"
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--wine)]/15 px-3 py-2.5 text-sm outline-none focus:border-[var(--wine)]/40"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[var(--wine)] py-2.5 text-sm font-semibold text-[var(--cream)] hover:bg-[var(--wine-dark)]"
            >
              Être recontacté
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
