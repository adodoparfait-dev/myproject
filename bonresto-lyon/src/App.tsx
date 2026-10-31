import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./components/Logo";
import HomePage from "./pages/HomePage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import JoinPage from "./pages/JoinPage";

export type View =
  | { name: "accueil" }
  | { name: "restaurants" }
  | { name: "detail"; restaurantId: string }
  | { name: "comment" }
  | { name: "rejoindre" };

const NAV: { view: View; label: string }[] = [
  { view: { name: "accueil" }, label: "Accueil" },
  { view: { name: "restaurants" }, label: "Restaurants" },
  { view: { name: "comment" }, label: "Comment ça marche" },
];

export default function App() {
  const [view, setView] = useState<View>({ name: "accueil" });
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(next: View) {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--wine)]/10 bg-[var(--cream)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate({ name: "accueil" })}
            className="flex items-center gap-2 font-display text-xl font-semibold text-[var(--wine)]"
          >
            <Logo size={26} />
            LeBonResto
          </button>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map(({ view: v, label }) => (
              <button
                key={label}
                onClick={() => navigate(v)}
                className={`text-sm font-medium transition hover:text-[var(--wine)] ${
                  view.name === v.name ? "text-[var(--wine)]" : "text-[var(--ink-soft)]"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => navigate({ name: "rejoindre" })}
              className="rounded-full bg-[var(--wine)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--wine-dark)]"
            >
              Rejoindre comme restaurateur
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--wine)] md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-[var(--wine)]/10 px-4 pb-4 md:hidden">
            {NAV.map(({ view: v, label }) => (
              <button
                key={label}
                onClick={() => navigate(v)}
                className="rounded-lg px-2 py-2.5 text-left text-sm font-medium text-[var(--ink)] hover:bg-[var(--cream-soft)]"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => navigate({ name: "rejoindre" })}
              className="mt-1 rounded-lg bg-[var(--wine)] px-2 py-2.5 text-left text-sm font-semibold text-[var(--cream)]"
            >
              Rejoindre comme restaurateur
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {view.name === "accueil" && <HomePage navigate={navigate} />}
        {view.name === "restaurants" && <RestaurantsPage navigate={navigate} />}
        {view.name === "detail" && (
          <RestaurantDetailPage restaurantId={view.restaurantId} navigate={navigate} />
        )}
        {view.name === "comment" && <HowItWorksPage navigate={navigate} />}
        {view.name === "rejoindre" && <JoinPage />}
      </main>

      <footer className="border-t border-[var(--wine)]/10 bg-[var(--cream-soft)] py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-[var(--ink-soft)] sm:px-6">
          <div className="flex items-center justify-center gap-1.5">
            <Logo size={18} />
            <p className="font-display text-base text-[var(--wine)]">LeBonResto</p>
          </div>
          <p className="mt-1">La commande locale, par et pour les restaurateurs lyonnais.</p>
          <p className="mt-3 text-xs">Prototype de démonstration — Lyon, France.</p>
        </div>
      </footer>
    </div>
  );
}
