import { Reveal } from "../hooks";

export default function Footer() {
  return (
    <footer id="legal" className="border-t-2 border-ink/80 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-tri-yellow">
                · Legal basis
              </p>
              <h2 className="mt-2 font-display text-2xl leading-snug sm:text-3xl">
                Section 120 — Fares and Fare Matrix
              </h2>
              <blockquote className="mt-5 max-w-2xl border-l-4 border-tri-yellow pl-4 text-sm leading-relaxed text-cream/75">
                “The minimum fare of MTH in the city is at fifteen pesos (₱15.00) per
                passenger for the first four (4) kilometers and an additional fare of
                ₱1.00 per kilometer, if the distance traversed exceeds 4 kilometers.
                Provided, that the prevailing transportation fare privileges granted by
                law to students, senior citizens, and persons with disability (PWD)
                shall continue to apply. Shortchanging the passenger, as defined under
                'No Short Changing Act of 2016' (Republic Act No. 10099) shall
                constitute a violation of this section.”
              </blockquote>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-cream/50">
                City Ordinance No. 8, Series of 2023 · Red cluster: Ord. No. 37 s. 2018, as amended
              </p>
              <ul className="mt-6 grid max-w-2xl gap-2 sm:grid-cols-3">
                {[
                  "CBD → CBD stays at ₱15.00 — no trip in town exceeds 4 km from any point.",
                  "Fare privileges for students, senior citizens & PWDs continue to apply.",
                  "Shortchanging riders violates R.A. 10099 (No Short Changing Act of 2016).",
                ].map((t) => (
                  <li
                    key={t}
                    className="rounded-lg border border-cream/15 bg-cream/5 p-3 text-[11px] leading-relaxed text-cream/70"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border-2 border-dashed border-tri-yellow/60 p-6">
              <p className="font-display text-xl text-tri-yellow">A quick heads-up</p>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">
                Sakay! computes <strong className="text-cream">estimates</strong> using
                the official matrix formula and OpenStreetMap road data. Actual
                operator routes (and the fare you pay) can differ slightly depending
                on the road taken. When in doubt, show this fare to your driver —{" "}
                <em className="text-tri-yellow">tunay na rate ito, kuya.</em>
              </p>
              <div className="mt-5 space-y-1.5 font-mono text-[10px] uppercase tracking-wider text-cream/50">
                <p>Map data © OpenStreetMap contributors</p>
                <p>Routing © Project OSRM · Search © Nominatim</p>
                <p>Fare data: Gensan City tricycle fare matrices, 2023</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-cream/15 pt-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-cream/30 bg-tri-yellow">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#1b2440" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 19h14" />
                <circle cx="7.5" cy="19" r="2.4" />
                <circle cx="16.5" cy="19" r="2.4" />
                <path d="M9 16.5V9.5Q9 8.5 10 8.5h6.5q1 0 1 1V13q0 1-1 1l-3.5.5" />
                <path d="M13.5 8.5 15 5.5h2.5" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg">
                Sakay<span className="text-tri-yellow">!</span>
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/50">
                General Santos City · 6.1141° N, 125.1728° E
              </p>
            </div>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
            Built with respeto para sa mga tricycle drivers — salamat sa pagpasaher!
          </p>
        </div>
      </div>
    </footer>
  );
}
