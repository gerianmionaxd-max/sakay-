import { useState } from "react";
import logoMark from "../assets/logo-mark.png";
import tricyclesInTraffic from "../assets/tricycles-in-traffic-jam.webp";
import { Reveal } from "../hooks";

const NAV_LINKS = [
  { href: "#calculator", label: "Calculate" },
  { href: "#how", label: "How it works" },
  { href: "#clusters", label: "Clusters" },
  { href: "#matrix", label: "Fare matrix" },
] as const;

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
  "Siguel–Bawing",
  "Upper Labay",
  "NLSA Junction",
];

const chips = [
  { label: "Base fare", value: "₱15.00", note: "first 4 km" },
  { label: "Per km after", value: "+₱1.00", note: "each succeeding km" },
  { label: "Clusters", value: "3", note: "White · Green · Red" },
];

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative overflow-x-clip">
      {/* faint giant peso watermark — clipped in its own layer so the header
          itself never becomes a scroll container (which would break sticky) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -right-10 -top-16 select-none font-display text-[26rem] leading-none text-ink/[0.045]">
          ₱
        </span>
      </div>

      {/* nav */}
      <nav className="sticky top-0 z-[1300] border-b-2 border-ink/80 bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="group flex items-center gap-2.5">
            <img
              src={logoMark}
              alt=""
              width={128}
              height={128}
              className="h-10 w-10 rounded-[0.6rem] transition-transform group-hover:-rotate-6"
            />
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
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="underline-offset-4 transition hover:underline hover:decoration-tri-yellow hover:decoration-4"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border-2 border-ink bg-cream px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_rgba(27,36,64,0.9)] sm:inline-block">
              Ord. No. 8 s. 2023
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-cream shadow-[2px_2px_0_rgba(27,36,64,0.9)] transition active:translate-y-0.5 active:shadow-[1px_1px_0_rgba(27,36,64,0.9)] md:hidden"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <>
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div id="mobile-nav" className="border-t-2 border-ink/15 bg-paper md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
              <ul className="divide-y divide-line">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-[52px] items-center justify-between font-mono text-xs font-bold uppercase tracking-widest text-ink"
                    >
                      {l.label}
                      <svg className="h-4 w-4 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 12h15m0 0-6-6m6 6-6 6" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                Ord. No. 8 s. 2023 · ₱15 + ₱1/km
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* hero body */}
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] shadow-[3px_3px_0_rgba(27,36,64,0.85)]">
              <span className="blink-dot inline-block h-2 w-2 rounded-full bg-tri-green" />
              General Santos City · Sarangani
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-5 font-display text-[2.1rem] leading-[1.05] min-[400px]:text-[2.35rem] sm:text-5xl lg:text-6xl">
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
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
              Pin your start and drop-off on the map, and <strong className="text-ink">Sakay!</strong>{" "}
              measures the actual road, estimates your ETA, and prints the exact
              tricycle fare the city ordinance says you should pay. No more
              <em> “dungagi lang singko.”</em>
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#calculator"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border-2 border-ink bg-tri-yellow px-6 py-3.5 font-display text-lg tracking-wide shadow-[6px_6px_0_rgba(27,36,64,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_9px_0_rgba(27,36,64,1)] active:translate-y-0 active:shadow-[3px_3px_0_rgba(27,36,64,1)]"
              >
                Compute my fare
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h15m0 0-6-6m6 6-6 6" />
                </svg>
              </a>
              <a
                href="#matrix"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-cream px-5 py-3.5 font-display text-base tracking-wide transition-all hover:-translate-y-1 hover:bg-ink hover:text-tri-yellow"
              >
                Browse the matrix
              </a>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-2 sm:mt-9 sm:gap-3">
              {chips.map((c, i) => (
                <div
                  key={c.label}
                  className="group rounded-xl border-2 border-ink bg-cream p-2.5 shadow-[4px_4px_0_rgba(27,36,64,0.15)] transition-all hover:-translate-y-1 hover:shadow-[5px_6px_0_rgba(27,36,64,0.25)] sm:p-3"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                    {c.label}
                  </p>
                  <p className="mt-1 font-display text-lg text-ink min-[400px]:text-2xl sm:text-[1.7rem]">{c.value}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-ink-soft sm:text-[11px]">{c.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[640px]">
            {/* dashed ring carried over from the old illustration, now framing the photo */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 -z-10 rounded-[1.6rem] border-4 border-dashed border-tri-yellow/70"
            />
            <figure className="overflow-hidden rounded-2xl border-[3px] border-ink bg-ink">
              <img
                src={tricyclesInTraffic}
                alt="A queue of blue GenSan tricycles packed into traffic, with motorcycle riders weaving between them"
                width={580}
                height={499}
                decoding="async"
                className="aspect-[7/6] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </figure>
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
