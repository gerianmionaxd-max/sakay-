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
              <svg className="h-6 w-6 text-ink" viewBox="0 0 200 200" fill="currentColor" fillRule="evenodd" aria-hidden="true">
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
            <div className="leading-tight">
              <p className="font-display text-lg">
                Sakay<span className="text-tri-yellow">!</span>
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/50">
                General Santos City · Gerian Miona
              </p>
            </div>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
            Built with respeto para sa mga tricycle drivers — salamat heneral!
          </p>
        </div>
      </div>
    </footer>
  );
}
