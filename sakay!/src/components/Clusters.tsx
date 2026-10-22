import { CLUSTERS, pes } from "../data/fareData";
import { Reveal } from "../hooks";

export default function Clusters() {
  return (
    <section id="clusters" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="mb-10 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-tri-red">
            · The three clusters
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
            Which tricycle runs your barangay?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-soft">
            GenSan's tricycles are grouped into three fare clusters — you'll know
            which one it is by the color of its painted board. All three follow the
            same rule: <strong className="text-ink">₱15.00 first 4 km + ₱1.00 per succeeding km.</strong>
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {CLUSTERS.map((c, i) => {
          const top = [...c.rows].sort((a, b) => b.fare - a.fare || b.km - a.km).slice(0, 4);
          return (
            <Reveal key={c.id} delay={i * 120}>
              <article
                className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-cream transition-all duration-300 hover:-translate-y-1.5"
                style={{ borderColor: c.colorDeep, boxShadow: `0 0 0 rgba(0,0,0,0)` }}
              >
                {/* painted board header */}
                <div
                  className="relative px-5 py-4 text-cream"
                  style={{ background: `linear-gradient(135deg, ${c.color} 0%, ${c.colorDeep} 100%)` }}
                >
                  <div className="absolute right-4 top-4 opacity-25 transition-transform duration-500 group-hover:rotate-12">
                    <svg className="h-10 w-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 38h32M14 38a6 6 0 1 0 0.01 0M34 38a6 6 0 1 0 0.01 0" />
                      <path d="M20 35V20q0-3 3-3h10q3 0 3 3v7q0 3-3 3l-6 5" />
                    </svg>
                  </div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] opacity-80">
                    Cluster {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-0.5 font-display text-2xl leading-tight">{c.name}</h3>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest opacity-80">
                    {c.tagline}
                  </p>
                </div>

                <div className="flex grow flex-col p-5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                    Covered areas
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.areas.map((a) => (
                      <span
                        key={a}
                        className="rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors"
                        style={{ borderColor: c.color, color: c.colorDeep, background: c.soft }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                    Longest posted runs
                  </p>
                  <ul className="mt-2 grow space-y-1.5">
                    {top.map((r) => (
                      <li
                        key={r.route}
                        className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper/60 px-3 py-2 text-xs transition-all hover:border-ink hover:bg-cream"
                      >
                        <span className="truncate leading-snug" title={r.route}>
                          {r.route}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-bold">
                          <span className="text-ink-soft">{r.km}km</span>
                          <span
                            className="rounded px-1.5 py-0.5 text-cream"
                            style={{ background: c.color }}
                          >
                            {pes(r.fare)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#matrix"
                    className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 transition hover:gap-3"
                    style={{ color: c.colorDeep }}
                  >
                    View all {c.rows.length} routes
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12h15m0 0-6-6m6 6-6 6" />
                    </svg>
                  </a>
                </div>

                <div
                  className="px-5 py-2.5 font-mono text-[9px] uppercase tracking-wider"
                  style={{ background: c.soft, color: c.colorDeep }}
                >
                  {c.basis}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
