import { useMemo, useState } from "react";
import { CLUSTERS, pes, type ClusterId } from "../data/fareData";
import { Reveal } from "../hooks";

export default function FareMatrix() {
  const [tab, setTab] = useState<ClusterId>("white");
  const [q, setQ] = useState("");

  const cluster = CLUSTERS.find((c) => c.id === tab)!;
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return cluster.rows;
    return cluster.rows.filter((r) => r.route.toLowerCase().includes(needle));
  }, [cluster, q]);

  return (
    <section id="matrix" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="mb-8 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-tri-green-deep">
            · Official fare matrix
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
            The whole matrix, in one place
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-soft">
            Minimum fare of <strong className="text-ink">₱15.00 for the first four (4) kilometers</strong>,
            plus <strong className="text-ink">₱1.00 for every succeeding kilometer</strong> — as posted by the
            city's tricycle clusters.
          </p>
        </div>
      </Reveal>

      {/* tabs */}
      <Reveal delay={80}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {CLUSTERS.map((c) => {
              const active = tab === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setTab(c.id)}
                  className="rounded-full border-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
                  style={
                    active
                      ? { background: c.color, borderColor: c.colorDeep, color: "#fffdf6", boxShadow: `4px 4px 0 ${c.colorDeep}` }
                      : { background: "transparent", borderColor: "#cbbb96", color: "#5a6478" }
                  }
                >
                  {c.name}
                </button>
              );
            })}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${cluster.name.toLowerCase()} routes…`}
            className="w-full rounded-lg border border-line bg-cream px-3.5 py-2 text-base placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-tri-yellow/60 sm:w-64 sm:text-sm"
          />
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div
          className="overflow-hidden rounded-2xl border-2 transition-colors duration-300"
          style={{ borderColor: cluster.colorDeep }}
        >
          {/* board header — styled like a painted tricycle fare board */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-cream"
            style={{ background: cluster.colorDeep }}
          >
            <div>
              <p className="font-display text-lg leading-tight">
                {cluster.name} — Fare Matrix
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] opacity-80">
                {cluster.tagline} · {cluster.basis}
              </p>
            </div>
            <p className="rounded-md bg-cream/15 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider">
              {cluster.rows.length} posted routes
            </p>
          </div>

          <div className="max-h-[60vh] overflow-auto bg-cream sm:max-h-[480px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="font-mono text-[10px] uppercase tracking-[0.18em]">
                  <th
                    className="sticky top-0 z-10 hidden border-b-2 px-3 py-3 sm:table-cell sm:px-5"
                    style={{ background: cluster.soft, color: cluster.colorDeep, borderColor: cluster.color }}
                  >
                    #
                  </th>
                  <th
                    className="sticky top-0 z-10 border-b-2 px-5 py-3"
                    style={{ background: cluster.soft, color: cluster.colorDeep, borderColor: cluster.color }}
                  >
                    Route
                  </th>
                  <th
                    className="sticky top-0 z-10 border-b-2 px-3 py-3 text-right sm:px-5"
                    style={{ background: cluster.soft, color: cluster.colorDeep, borderColor: cluster.color }}
                  >
                    Distance
                  </th>
                  <th
                    className="sticky top-0 z-10 border-b-2 px-3 py-3 text-right sm:px-5"
                    style={{ background: cluster.soft, color: cluster.colorDeep, borderColor: cluster.color }}
                  >
                    Fare
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.route}
                    className="group border-b border-line/70 text-sm transition-colors"
                    style={{ background: i % 2 ? "rgba(0,0,0,0.018)" : "transparent" }}
                  >
                    <td className="hidden px-3 py-2.5 font-mono text-xs text-ink-soft sm:table-cell sm:px-5">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="px-3 py-2.5 leading-snug sm:px-5">
                      <span className="transition-colors group-hover:text-ink">
                        {r.route}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-xs font-bold sm:px-5">
                      {r.km} km
                    </td>
                    <td className="px-3 py-2.5 text-right sm:px-5">
                      <span
                        className="inline-block rounded-md px-2.5 py-0.5 font-mono text-xs font-bold text-cream transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105"
                        style={{ background: cluster.color }}
                      >
                        {pes(r.fare)}
                      </span>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-sm text-ink-soft sm:px-5">
                      No routes match “{q}” in the {cluster.name}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            className="px-5 py-3 font-mono text-[10px] leading-relaxed text-ink-soft"
            style={{ background: cluster.soft }}
          >
            Legal basis: {cluster.basis}. “When the origin–destination is only CBD–CBD,
            minimum fare is still ₱15.00, as the shortest distance from any point never
            exceeds four (4) kilometers.”
          </div>
        </div>
      </Reveal>
    </section>
  );
}
