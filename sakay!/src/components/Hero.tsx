import { Reveal } from "../hooks";

const DESTINATIONS = [
  "Bulaong Terminal",
  "Lagao",
  "San Isidro",
  "City Heights",
  "Bula",
  "Baluan",
  "Labangal",
  "Gensan Port",
  "Mabuhay",
  "Conel",
  "Olympog",
  "Tambler",
  "Fatima",
  "Bawing–Siguel",
  "Upper Labay",
  "NLSA Junction",
];

function TricycleArt() {
  return (
    <svg
      viewBox="0 0 340 240"
      className="floaty h-auto w-full max-w-[420px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Painted GenSan tricycle"
    >
      {/* fare board on roof */}
      <g>
        <rect x="58" y="18" width="150" height="40" rx="7" fill="#1b2440" stroke="#0e1526" strokeWidth="3" />
        <text x="133" y="38" textAnchor="middle" fontFamily="'Space Mono', monospace" fontWeight="700" fontSize="13" fill="#ffc531">
          ₱15 + ₱1 / km
        </text>
        <text x="133" y="52" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="8.5" fill="#f9f3e6" letterSpacing="2">
          GENSAN CITY
        </text>
        <rect x="76" y="58" width="8" height="16" fill="#1b2440" />
        <rect x="186" y="58" width="8" height="16" fill="#1b2440" />
      </g>

      {/* cart body */}
      <path d="M40 178 L58 74 Q60 66 68 66 L214 66 Q222 66 222 74 L222 178 Z" fill="#d8453e" stroke="#1b2440" strokeWidth="4" />
      {/* yellow skirt stripe */}
      <path d="M43 158 L219 158 L222 178 L40 178 Z" fill="#ffc531" stroke="#1b2440" strokeWidth="3" />
      {/* porthole window */}
      <path d="M78 88 Q78 82 84 82 L196 82 Q202 82 202 88 L202 128 Q202 134 196 134 L84 134 Q78 134 78 128 Z" fill="#f9f3e6" stroke="#1b2440" strokeWidth="3.5" />
      <path d="M92 82 L92 134" stroke="#1b2440" strokeWidth="2.5" />
      <path d="M186 82 L186 134" stroke="#1b2440" strokeWidth="2.5" />
      {/* side star decal */}
      <path d="M140 143 l4.8 9.7 10.7 1.6 -7.7 7.5 1.8 10.7 -9.6-5.1 -9.6 5.1 1.8-10.7 -7.7-7.5 10.7-1.6 Z" fill="#ffc531" stroke="#1b2440" strokeWidth="2" />

      {/* motorcycle front */}
      <path d="M222 108 Q258 96 278 104 L288 112" stroke="#1b2440" strokeWidth="5" strokeLinecap="round" />
      <circle cx="284" cy="112" r="7" fill="#ffc531" stroke="#1b2440" strokeWidth="3" />
      {/* handlebar */}
      <path d="M266 92 L274 104" stroke="#1b2440" strokeWidth="4" strokeLinecap="round" />

      {/* wheels */}
      <g>
        <circle cx="96" cy="186" r="30" fill="#1b2440" />
        <circle cx="96" cy="186" r="14" fill="#f9f3e6" stroke="#ffc531" strokeWidth="4" />
        <circle cx="96" cy="186" r="3.5" fill="#1b2440" />
      </g>
      <g>
        <circle cx="252" cy="186" r="30" fill="#1b2440" />
        <circle cx="252" cy="186" r="14" fill="#f9f3e6" stroke="#ffc531" strokeWidth="4" />
        <circle cx="252" cy="186" r="3.5" fill="#1b2440" />
      </g>
      {/* mudguard over back wheel */}
      <path d="M62 172 A40 40 0 0 1 130 164" stroke="#2f6ba7" strokeWidth="8" strokeLinecap="round" />

      {/* ground */}
      <path d="M18 218 H322" stroke="#1b2440" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 16" />
      {/* speed lines */}
      <path d="M14 120 H44 M6 140 H30 M14 160 H40" stroke="#ffc531" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

const chips = [
  { label: "Base fare", value: "₱15.00", note: "first 4 km" },
  { label: "Per km after", value: "+₱1.00", note: "each succeeding km" },
  { label: "Clusters", value: "3", note: "White · Green · Red" },
];

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      {/* faint giant peso watermark */}
      <span className="pointer-events-none absolute -right-10 -top-16 select-none font-display text-[26rem] leading-none text-ink/[0.045]">
        ₱
      </span>

      {/* nav */}
      <nav className="sticky top-0 z-[1300] border-b-2 border-ink/80 bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-tri-yellow shadow-[3px_3px_0_rgba(27,36,64,1)] transition-transform group-hover:-rotate-6">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="#1b2440" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 19h14" />
                <circle cx="7.5" cy="19" r="2.4" />
                <circle cx="16.5" cy="19" r="2.4" />
                <path d="M9 16.5V9.5Q9 8.5 10 8.5h6.5q1 0 1 1V13q0 1-1 1l-3.5.5" />
                <path d="M13.5 8.5 15 5.5h2.5" />
              </svg>
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl tracking-tight">
                Sakay<span className="text-tri-red">!</span>
              </span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-ink-soft">
                GenSan fare meter
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-6 font-mono text-[11px] font-bold uppercase tracking-widest md:flex">
            <a href="#calculator" className="underline-offset-4 transition hover:underline hover:decoration-tri-yellow hover:decoration-4">
              Calculate
            </a>
            <a href="#how" className="underline-offset-4 transition hover:underline hover:decoration-tri-yellow hover:decoration-4">
              How it works
            </a>
            <a href="#clusters" className="underline-offset-4 transition hover:underline hover:decoration-tri-yellow hover:decoration-4">
              Clusters
            </a>
            <a href="#matrix" className="underline-offset-4 transition hover:underline hover:decoration-tri-yellow hover:decoration-4">
              Fare matrix
            </a>
          </div>

          <span className="rounded-full border-2 border-ink bg-cream px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_rgba(27,36,64,0.9)]">
            Ord. No. 8 s. 2023
          </span>
        </div>
      </nav>

      {/* hero body */}
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-16">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] shadow-[3px_3px_0_rgba(27,36,64,0.85)]">
              <span className="blink-dot inline-block h-2 w-2 rounded-full bg-tri-green" />
              General Santos City · Sarangani
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.04] sm:text-6xl">
              <span className="text-tri-red">Pamasahe?</span>
              <br />
              Sakay na
              <span className="text-tri-green-deep"> —</span> know your
              <br />
              fare before going{" "}
              <span className="relative inline-block pb-1">
                anywhere
                <svg className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full sm:-bottom-3 sm:h-4" viewBox="0 0 120 12" preserveAspectRatio="none">
                  <path d="M3 8 Q 30 3 60 7 T 117 5" fill="none" stroke="#ffc531" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Pin your start and drop-off on the map, and <strong className="text-ink">Sakay!</strong>{" "}
              measures the actual road, estimates your ETA, and prints the exact
              tricycle fare the city ordinance says you should pay. No more
              <em> “dungagi lang singko.”</em>
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#calculator"
                className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-ink bg-tri-yellow px-6 py-3.5 font-display text-lg tracking-wide shadow-[6px_6px_0_rgba(27,36,64,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_9px_0_rgba(27,36,64,1)] active:translate-y-0 active:shadow-[3px_3px_0_rgba(27,36,64,1)]"
              >
                Compute my fare
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h15m0 0-6-6m6 6-6 6" />
                </svg>
              </a>
              <a
                href="#matrix"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-5 py-3.5 font-display text-base tracking-wide transition-all hover:-translate-y-1 hover:bg-ink hover:text-tri-yellow"
              >
                Browse the matrix
              </a>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
              {chips.map((c, i) => (
                <div
                  key={c.label}
                  className="group rounded-xl border-2 border-ink bg-cream p-3 shadow-[4px_4px_0_rgba(27,36,64,0.15)] transition-all hover:-translate-y-1 hover:shadow-[5px_6px_0_rgba(27,36,64,0.25)]"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                    {c.label}
                  </p>
                  <p className="mt-1 font-display text-2xl text-ink sm:text-[1.7rem]">{c.value}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-ink-soft">{c.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-full border-4 border-dashed border-tri-yellow/70" />
            <TricycleArt />
          </div>
        </Reveal>
      </div>

      {/* destination marquee */}
      <div className="marquee overflow-hidden border-y-2 border-ink bg-ink py-3" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {DESTINATIONS.map((d, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="flex items-center font-mono text-xs font-bold uppercase tracking-[0.22em]"
                  style={{ color: i % 3 === 0 ? "#ffc531" : i % 3 === 1 ? "#7cc48f" : "#e8877f" }}
                >
                  <span className="px-5">{d}</span>
                  <span className="text-cream/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
