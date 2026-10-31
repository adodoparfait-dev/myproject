import { ArrowLeft, Check, Clock, Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import type { View } from "../App";
import { RESTAURANTS } from "../data/restaurants";

export default function RestaurantDetailPage({
  restaurantId,
  navigate,
}: {
  restaurantId: string;
  navigate: (v: View) => void;
}) {
  const restaurant = RESTAURANTS.find((r) => r.id === restaurantId);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [confirmed, setConfirmed] = useState(false);

  const categories = useMemo(() => {
    if (!restaurant) return [];
    const seen = new Set<string>();
    const order: string[] = [];
    for (const item of restaurant.menu) {
      if (!seen.has(item.category)) {
        seen.add(item.category);
        order.push(item.category);
      }
    }
    return order;
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-[var(--ink-soft)]">Ce restaurant n'existe pas (ou plus).</p>
        <button
          onClick={() => navigate({ name: "restaurants" })}
          className="mt-4 text-sm font-semibold text-[var(--wine)] underline"
        >
          Retour aux restaurants
        </button>
      </div>
    );
  }

  const itemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = restaurant.menu.reduce((sum, item) => sum + (cart[item.id] ?? 0) * item.price, 0);

  function addItem(itemId: string) {
    setCart((c) => ({ ...c, [itemId]: (c[itemId] ?? 0) + 1 }));
  }
  function removeItem(itemId: string) {
    setCart((c) => {
      const next = { ...c, [itemId]: Math.max(0, (c[itemId] ?? 0) - 1) };
      if (next[itemId] === 0) delete next[itemId];
      return next;
    });
  }

  if (confirmed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--wine)]/10 text-[var(--wine)]">
          <Check size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-[var(--ink)]">
          Commande envoyée (démo)
        </h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Dans la vraie plateforme, {restaurant.name} recevrait ta commande de{" "}
          {total.toFixed(2)}&nbsp;€ et la préparerait pour un retrait dans ~{restaurant.pickupMinutes} minutes.
        </p>
        <button
          onClick={() => navigate({ name: "restaurants" })}
          className="mt-6 rounded-full bg-[var(--wine)] px-6 py-3 text-sm font-semibold text-[var(--cream)]"
        >
          Voir d'autres restaurants
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="h-36 sm:h-44" style={{ background: restaurant.color }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <button
          onClick={() => navigate({ name: "restaurants" })}
          className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--wine)]"
        >
          <ArrowLeft size={15} /> Tous les restaurants
        </button>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--wine)]/10 pb-6">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">{restaurant.name}</h1>
            <p className="mt-1 text-[var(--ink-soft)]">{restaurant.pitch}</p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{restaurant.address}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[var(--cream-soft)] px-3 py-1.5 text-sm text-[var(--ink-soft)]">
            <Clock size={14} /> Retrait en ~{restaurant.pickupMinutes} min
          </span>
        </div>

        <div className="grid gap-10 py-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="font-display text-lg font-semibold text-[var(--ink)]">{category}</h2>
                <div className="mt-3 divide-y divide-[var(--wine)]/10 rounded-2xl border border-[var(--wine)]/10 bg-white">
                  {restaurant.menu
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-4">
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--ink)]">{item.name}</p>
                          <p className="text-sm text-[var(--ink-soft)]">{item.description}</p>
                          <p className="mt-1 text-sm font-semibold text-[var(--wine)]">
                            {item.price.toFixed(2)} €
                          </p>
                        </div>
                        {cart[item.id] ? (
                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--wine)]/20 text-[var(--wine)]"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center text-sm font-semibold">{cart[item.id]}</span>
                            <button
                              onClick={() => addItem(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--wine)] text-[var(--cream)]"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(item.id)}
                            className="shrink-0 rounded-full border border-[var(--wine)]/20 px-3 py-1.5 text-xs font-semibold text-[var(--wine)] hover:bg-[var(--wine)]/5"
                          >
                            Ajouter
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-[var(--wine)]/10 bg-white p-5 lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
              <ShoppingBag size={18} /> Votre commande
            </h2>
            {itemCount === 0 ? (
              <p className="mt-3 text-sm text-[var(--ink-soft)]">
                Ajoute des plats depuis le menu pour commencer ta commande en click &amp; collect.
              </p>
            ) : (
              <>
                <div className="mt-3 space-y-2 text-sm">
                  {restaurant.menu
                    .filter((item) => cart[item.id])
                    .map((item) => (
                      <div key={item.id} className="flex justify-between text-[var(--ink)]">
                        <span>
                          {cart[item.id]} × {item.name}
                        </span>
                        <span>{(item.price * cart[item.id]).toFixed(2)} €</span>
                      </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-[var(--wine)]/10 pt-3 font-semibold text-[var(--ink)]">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <button
                  onClick={() => setConfirmed(true)}
                  className="mt-4 w-full rounded-full bg-[var(--wine)] py-2.5 text-sm font-semibold text-[var(--cream)] hover:bg-[var(--wine-dark)]"
                >
                  Commander — retrait sur place
                </button>
                <p className="mt-2 text-center text-xs text-[var(--ink-soft)]">
                  Démo : aucun paiement réel n'est déclenché.
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
