import { useMemo, useState } from "react";
import { isDue } from "../lib/srs";
import { currentStreak, lastNDaysBuckets, retentionRate } from "../lib/stats";
import { useStore } from "../store/StoreContext";

const DAYS = 14;
const CHART_HEIGHT = 140;
const BAND = 30;
const BAR_WIDTH = 18;

function formatDayLabel(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
}

export default function StatsPage() {
  const { notes, cards, reviewLogs } = useStore();
  const [hover, setHover] = useState<number | null>(null);

  const dueToday = cards.filter((c) => isDue(c)).length;
  const retention = retentionRate(reviewLogs);
  const streak = currentStreak(reviewLogs);
  const buckets = useMemo(() => lastNDaysBuckets(reviewLogs, DAYS), [reviewLogs]);

  const maxTotal = Math.max(1, ...buckets.map((b) => b.correct + b.incorrect));
  const chartWidth = DAYS * BAND;

  function barHeight(count: number) {
    return (count / maxTotal) * (CHART_HEIGHT - 24);
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-xl font-semibold">Statistiques</h1>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Cartes dues aujourd'hui" value={String(dueToday)} />
        <StatTile label="Total de cartes" value={String(cards.length)} />
        <StatTile label="Total de notes" value={String(notes.length)} />
        <StatTile
          label="Taux de rétention"
          value={retention === null ? "—" : `${retention}%`}
        />
      </div>

      <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="text-sm font-medium">
            {streak > 0
              ? `${streak} jour${streak > 1 ? "s" : ""} de suite`
              : "Pas encore de série en cours"}
          </p>
          <p className="text-xs text-slate-400">
            Révise chaque jour pour construire ta série.
          </p>
        </div>
      </div>

      <div className="viz-root rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium">Révisions des {DAYS} derniers jours</h2>
          <Legend />
        </div>

        {reviewLogs.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Aucune révision pour l'instant. Les statistiques apparaîtront ici.
          </p>
        ) : (
          <div className="relative">
            <svg
              viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
              width="100%"
              height={CHART_HEIGHT}
              role="img"
              aria-label={`Révisions correctes et à revoir des ${DAYS} derniers jours`}
            >
              <line
                x1={0}
                y1={CHART_HEIGHT - 20}
                x2={chartWidth}
                y2={CHART_HEIGHT - 20}
                stroke="var(--viz-grid)"
                strokeWidth={1}
              />
              {buckets.map((b, i) => {
                const x = i * BAND + (BAND - BAR_WIDTH) / 2;
                const correctH = barHeight(b.correct);
                const incorrectH = barHeight(b.incorrect);
                const gap = b.correct > 0 && b.incorrect > 0 ? 2 : 0;
                const baseline = CHART_HEIGHT - 20;
                return (
                  <g
                    key={b.date}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                  >
                    <rect x={x} y={0} width={BAR_WIDTH} height={CHART_HEIGHT - 20} fill="transparent" />
                    {b.incorrect > 0 && (
                      <rect
                        x={x}
                        y={baseline - correctH - gap - incorrectH}
                        width={BAR_WIDTH}
                        height={incorrectH}
                        rx={3}
                        fill="var(--viz-critical)"
                      />
                    )}
                    {b.correct > 0 && (
                      <rect
                        x={x}
                        y={baseline - correctH}
                        width={BAR_WIDTH}
                        height={correctH}
                        rx={3}
                        fill="var(--viz-good)"
                      />
                    )}
                    <text
                      x={x + BAR_WIDTH / 2}
                      y={CHART_HEIGHT - 6}
                      textAnchor="middle"
                      fontSize={9}
                      fill="var(--viz-text-muted)"
                    >
                      {formatDayLabel(b.date)}
                    </text>
                  </g>
                );
              })}
            </svg>
            {hover !== null && (
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md dark:border-slate-700 dark:bg-slate-800"
                style={{
                  left: `${((hover + 0.5) / DAYS) * 100}%`,
                  top: 0,
                }}
              >
                <p className="font-medium">
                  {new Date(`${buckets[hover].date}T00:00:00`).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p style={{ color: "var(--viz-good)" }}>{buckets[hover].correct} correctes</p>
                <p style={{ color: "var(--viz-critical)" }}>{buckets[hover].incorrect} à revoir</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Legend() {
  return (
    <div className="viz-root flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
      <span className="flex items-center gap-1">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--viz-good)" }}
        />
        Correctes
      </span>
      <span className="flex items-center gap-1">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--viz-critical)" }}
        />
        À revoir
      </span>
    </div>
  );
}
