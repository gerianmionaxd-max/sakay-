import { useState } from "react";
import { BASE_KM, BASE_FARE, computeFare, pes } from "../data/fareData";
import { Reveal, useCountUp } from "../hooks";

/**
 * Step icons: Lucide (ISC) — "map-pin", "map-pinned", "philippine-peso".
 * Inlined at a 24px grid so they stay crisp at the 40px display size and
 * inherit `currentColor` from the yellow step tile.
 */
const STEP_ICON_CLASS = "h-10 w-10";

const stepIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: STEP_ICON_CLASS,
  "aria-hidden": true,
};

const STEPS = [
  {
    n: "1",
    title: "Pin your start",
    body: "Click the map, search a barangay, or use your phone's live location to drop the yellow START pin.",
    icon: (
      <svg {...stepIconProps}>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    n: "2",
    title: "Pin your drop-off",
    body: "Place the red DROP-OFF pin where you're headed. Sakay! traces the real street route between them.",
    icon: (
      <svg {...stepIconProps}>
        <path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0" />
        <path d="M4.474 15h-.197a1 1 0 0 0-.969.753l-1.097 4.35a1.5 1.5 0 0 0 1.444 1.898L20.344 22a1.5 1.5 0 0 0 1.446-1.897l-1.098-4.35a1 1 0 0 0-.969-.753h-.197" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
  },
  {
    n: "3",
    title: "Get km · ETA · fare",
    body: "Distance, estimated travel time, and the exact peso fare — computed from the city's own fare matrix rule.",
    icon: (
      <svg {...stepIconProps}>
        <path d="M20 11H4" />
        <path d="M20 7H4" />
        <path d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const [km, setKm] = useState(9);
  const fare = computeFare(km);
  const animFare = useCountUp(fare.total);
  const animKm = useCountUp(km);
  const fill = (km / 25) * 100;

  return (
    <section id="how" className="border-y-2 border-ink/80 bg-cream/70 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-tri-blue-deep">
                · How it works
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                Three taps, zero haggling
              </h2>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              rule: {pes(BASE_FARE)} + ₱1 / km after {BASE_KM} km
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* steps */}
          <ol className="space-y-5">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 110}>
                <div className="group flex gap-4 rounded-2xl border-2 border-line bg-cream p-4 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-[7px_7px_0_rgba(27,36,64,0.14)] sm:gap-5 sm:p-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-tri-yellow font-display text-xl shadow-[3px_3px_0_rgba(27,36,64,0.9)] transition-transform group-hover:-rotate-6">
                    {s.icon}
                  </span>
                  <div>
                    <p className="font-display text-lg leading-snug">
                      <span className="mr-2 text-tri-red">{s.n}.</span>
                      {s.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* interactive formula playground */}
          <Reveal delay={150}>
            <div className="rounded-2xl border-2 border-ink bg-ink p-6 text-cream shadow-[9px_9px_0_rgba(255,197,49,0.9)]">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-tri-yellow">
                Try the formula
              </p>
              <p className="mt-1 text-sm text-cream/70">
                Drag to any distance in the city and watch the fare climb, peso by peso.
              </p>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50">
                    Distance
                  </p>
                  <p className="font-mono text-4xl font-bold">
                    {animKm.toFixed(1)}
                    <span className="ml-1 text-lg text-cream/60">km</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50">
                    Fare
                  </p>
                  <p className="font-display text-5xl text-tri-yellow">
                    {pes(Math.round(animFare))}
                  </p>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={25}
                step={0.1}
                value={km}
                onChange={(e) => setKm(parseFloat(e.target.value))}
                className="fare-slider mt-5"
                style={{ ["--fill" as string]: `${fill}%` }}
                aria-label="Distance in kilometers"
              />
              <div className="mt-1.5 flex justify-between font-mono text-[9px] text-cream/50">
                <span>0 km</span>
                <span className="text-tri-yellow">4 km = {pes(BASE_FARE)} flat</span>
                <span>25 km</span>
              </div>

              <div className="mt-5 rounded-lg border border-cream/20 bg-cream/5 p-3.5 font-mono text-[11px] leading-relaxed text-cream/80">
                <div className="flex justify-between">
                  <span>Base (first {BASE_KM} km)</span>
                  <span className="font-bold text-cream">{pes(BASE_FARE, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Succeeding km × ₱1.00</span>
                  <span className="font-bold text-cream">
                    {fare.extraKm} km = {pes(fare.extra, 2)}
                  </span>
                </div>
                <div className="mt-1.5 flex justify-between border-t border-dashed border-cream/25 pt-1.5 text-sm font-bold text-tri-yellow">
                  <span>Total</span>
                  <span>{pes(fare.total, 2)}</span>
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-cream/50">
                Longest posted run in the matrix: CBD → Brgy. Hall Upper Labay,
                25 km for <span className="font-bold text-cream">₱36</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
