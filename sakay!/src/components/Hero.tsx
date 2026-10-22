import tricyclesInTraffic from "../assets/tricycles-in-traffic-jam.webp";
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
              <svg className="h-7 w-7 text-ink" viewBox="0 0 200 200" fill="currentColor" fillRule="evenodd" aria-hidden="true">
                <path d="M 126 15 C 126 15, 125 15, 125 15 C 124 15, 119 20, 119 21 C 119 21, 119 22, 119 22 C 118 23,
    118 24, 118 28 L 118 34 75 34 C 27 34, 32 34, 29 36 C 24 39, 22 42, 22 48 C 22 54, 25 58, 29 60
    C 29 61, 30 61, 30 61 C 30 62, 30 119, 30 119 C 30 119, 29 119, 29 119 C 27 118, 21 118, 19 119
    C 16 120, 12 124, 11 127 C 10 129, 10 175, 11 177 C 15 188, 30 190, 36 180 C 38 177, 38 177, 38
    166 L 38 156 89 156 L 140 156 140 166 C 140 175, 140 176, 141 177 C 145 188, 160 190, 166 180 C
    168 177, 168 177, 168 166 C 168 156, 168 156, 170 156 C 172 156, 174 154, 176 152 C 177 150, 177
    112, 176 110 C 176 110, 175 109, 175 109 C 175 108, 171 103, 170 103 C 169 103, 169 103, 168 103
    C 167 102, 167 102, 163 102 C 161 102, 159 102, 159 102 C 159 102, 159 101, 160 101 C 162 101,
    167 96, 167 94 C 168 92, 168 92, 173 92 C 179 92, 180 92, 180 88 C 180 85, 179 84, 173 84 C 168
    84, 168 84, 167 83 C 167 80, 162 75, 160 75 C 160 75, 159 75, 159 75 C 157 74, 151 74, 150 75 C
    149 75, 149 75, 148 75 C 147 75, 141 81, 141 83 C 141 84, 140 84, 135 84 C 129 84, 128 85, 128
    88 C 128 92, 129 92, 135 92 C 140 92, 141 92, 141 94 C 141 96, 146 101, 149 101 C 150 102, 149
    102, 145 102 C 142 102, 141 102, 140 103 C 140 103, 139 103, 139 103 C 138 103, 133 108, 133 109
    C 133 109, 133 110, 133 110 C 132 111, 132 112, 132 119 L 132 128 125 128 L 118 128 118 95 L 118
    62 126 62 C 133 62, 134 62, 134 62 C 135 61, 137 61, 138 62 C 139 63, 145 63, 146 62 C 147 61,
    149 61, 150 62 C 151 63, 157 63, 158 62 C 159 61, 161 61, 162 62 C 163 63, 169 63, 170 62 C 171
    61, 173 61, 174 62 C 175 62, 176 62, 178 62 C 181 62, 181 62, 182 62 C 183 62, 183 61, 184 61 C
    184 61, 184 61, 184 61 C 184 61, 185 60, 185 60 C 186 59, 188 58, 188 57 C 188 57, 189 56, 189
    56 C 189 56, 189 56, 189 56 C 189 55, 190 55, 190 54 C 190 53, 190 53, 190 38 C 190 24, 190 23,
    190 22 C 190 22, 189 21, 189 21 C 189 20, 185 15, 184 15 C 183 15, 183 15, 182 15 C 181 14, 127
    14, 126 15 M 129 22 C 129 23, 129 23, 129 23 C 128 23, 128 23, 128 23 C 128 23, 127 23, 127 24 C
    127 24, 127 24, 127 25 C 126 25, 126 26, 126 30 L 126 34 154 34 L 182 34 182 30 C 182 25, 182
    24, 180 23 C 179 22, 132 22, 129 22 M 35 43 C 30 44, 29 51, 34 53 C 35 54, 117 54, 118 54 C 118
    54, 118 52, 118 48 L 118 42 77 42 C 54 42, 36 42, 35 43 M 126 43 C 126 44, 126 51, 127 52 C 129
    54, 130 54, 134 52 C 135 51, 137 51, 138 52 C 141 54, 141 54, 142 54 C 143 54, 144 54, 146 52 C
    147 51, 149 51, 150 52 C 153 54, 153 54, 154 54 C 155 54, 156 54, 158 52 C 159 51, 161 51, 162
    52 C 165 54, 165 54, 166 54 C 167 54, 168 54, 170 52 C 172 51, 173 51, 175 52 C 180 56, 182 54,
    182 46 L 182 42 154 42 C 130 42, 127 42, 126 43 M 38 63 C 38 63, 38 82, 38 105 L 38 148 74 148 L
    110 148 110 105 L 110 62 74 62 C 46 62, 39 62, 38 63 M 47 71 C 45 73, 45 113, 47 115 C 49 117,
    99 117, 101 115 C 103 113, 103 73, 101 71 C 99 69, 49 69, 47 71 M 54 79 C 54 79, 54 85, 54 93 L
    54 108 74 108 L 94 108 94 93 L 94 78 74 78 C 59 78, 55 78, 54 79 M 153 83 C 148 84, 147 91, 152
    93 C 157 96, 162 89, 158 84 C 157 83, 155 82, 153 83 M 143 110 C 143 111, 143 111, 143 111 C 142
    111, 142 111, 142 111 C 142 111, 141 111, 141 112 C 141 112, 141 112, 141 113 C 140 113, 140
    115, 140 131 L 140 148 154 148 L 168 148 168 131 C 168 108, 170 110, 154 110 C 149 110, 144 110,
    143 110 M 23 127 C 19 128, 18 129, 18 140 L 18 148 24 148 L 30 148 30 140 C 30 131, 30 131, 29
    130 C 28 128, 25 126, 23 127 M 47 129 C 46 130, 46 130, 46 132 C 46 134, 46 134, 47 135 C 49
    137, 99 137, 101 135 C 103 133, 103 131, 101 129 C 99 127, 49 127, 47 129 M 118 137 C 118 137,
    118 139, 118 142 L 118 148 125 148 L 132 148 132 142 L 132 136 125 136 C 120 136, 119 136, 118
    137 M 18 157 C 18 158, 18 173, 19 175 C 21 179, 27 179, 29 174 C 30 173, 30 173, 30 165 L 30 156
    24 156 C 20 156, 19 156, 18 157 M 148 157 C 148 158, 148 173, 149 175 C 151 179, 157 179, 159
    174 C 160 173, 160 173, 160 165 L 160 156 154 156 C 150 156, 149 156, 148 157" />
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
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
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
