import { useRef, useState } from "react";
import type { LatLng } from "./FareMap";

interface SearchHit {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationCardProps {
  role: "start" | "end";
  value: LatLng | null;
  label: string;
  active: boolean;
  onSelect: (pos: LatLng, label: string) => void;
  onClear: () => void;
}

export default function LocationCard({
  role,
  value,
  label,
  active,
  onSelect,
  onClear,
}: LocationCardProps) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  async function runSearch(q: string) {
    if (q.trim().length < 3) {
      setHits([]);
      setOpen(false);
      return;
    }
    const mySeq = ++seq.current;
    setSearching(true);
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=ph&viewbox=125.08,6.0,125.28,6.22&q=${encodeURIComponent(
        q
      )}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("search failed");
      const data: SearchHit[] = await res.json();
      if (mySeq !== seq.current) return;
      setHits(data);
      setOpen(true);
    } catch {
      if (mySeq !== seq.current) return;
      setError("Search unavailable. Try clicking the map instead.");
      setHits([]);
      setOpen(true);
    } finally {
      if (mySeq === seq.current) setSearching(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setOpen(true);
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (
          (latitude < 5.9 || latitude > 6.4) &&
          (longitude < 124.9 || longitude > 125.4)
        ) {
          setError("You appear to be outside GenSan — pin on the map instead.");
          return;
        }
        onSelect(
          { lat: latitude, lng: longitude },
          "My current location"
        );
      },
      () => setError("Location permission denied — click the map instead."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  const isStart = role === "start";
  const dotColor = isStart ? "bg-tri-yellow" : "bg-tri-red";

  return (
    <div
      className={`relative rounded-xl border-2 bg-cream p-3.5 transition-all duration-300 ${
        active
          ? "border-ink shadow-[5px_5px_0_rgba(27,36,64,0.18)] -translate-y-0.5"
          : "border-line hover:border-line-strong"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full border-2 border-ink ${dotColor} ${
              active ? "blink-dot" : ""
            }`}
          />
          <span className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-ink-soft">
            {isStart ? "01 · Start here" : "02 · Drop-off"}
          </span>
        </div>
        {value && (
          <button
            onClick={onClear}
            className="rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft underline decoration-dotted underline-offset-2 hover:bg-paper hover:text-tri-red"
            title="Remove pin"
          >
            clear
          </button>
        )}
      </div>

      <p className="mt-1.5 min-h-[3.4rem] text-sm leading-snug">
        {value ? (
          <>
            <span className="font-bold">{label || "Pinned location"}</span>
            <span className="mt-0.5 block font-mono text-[10px] text-ink-soft">
              {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
            </span>
          </>
        ) : (
          <span className="text-ink-soft">
            {active
              ? "Click anywhere on the map to drop this pin…"
              : "Not set yet."}
          </span>
        )}
      </p>

      {/* search */}
      <div className="relative mt-2">
        <div className="flex gap-1.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (hits[0] && open) {
                  pick(hits[0]);
                } else runSearch(query);
              }
              if (e.key === "Escape") setOpen(false);
            }}
            onBlur={() => setTimeout(() => setOpen(false), 180)}
            placeholder="Search “Bulaong”, “Labangal”…"
            className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-tri-yellow/60"
          />
          <button
            onClick={useMyLocation}
            title="Use my current location"
            className="group flex shrink-0 items-center gap-1 rounded-lg border border-line bg-paper px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink transition hover:border-ink hover:bg-tri-yellow"
          >
            <svg
              className="hover-wiggle h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3.2" />
              <path d="M12 2v3.5M12 18.5V22M2 12h3.5M18.5 12H22" />
            </svg>
            here
          </button>
        </div>

        {open && (
          <ul className="absolute left-0 right-0 top-full z-[1200] mt-1.5 overflow-hidden rounded-lg border border-line bg-cream shadow-xl">
            {searching && (
              <li className="flex items-center gap-2 px-3 py-2.5 text-xs text-ink-soft">
                <span className="spin-slow inline-block h-3.5 w-3.5 rounded-full border-2 border-line border-t-ink" />
                Searching General Santos…
              </li>
            )}
            {!searching && error && (
              <li className="px-3 py-2.5 text-xs text-tri-red">{error}</li>
            )}
            {!searching && !error && hits.length === 0 && (
              <li className="px-3 py-2.5 text-xs text-ink-soft">
                No matches in the Philippines. Press Enter to retry, or click the map.
              </li>
            )}
            {hits.map((h, i) => (
              <li key={`${h.lat},${h.lon},${i}`}>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(h)}
                  className="block w-full px-3 py-2.5 text-left text-xs leading-snug hover:bg-tri-yellow/25"
                >
                  <span className="font-semibold">
                    {h.display_name.split(",").slice(0, 2).join(",")}
                  </span>
                  <span className="block truncate text-[10px] text-ink-soft">
                    {h.display_name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {active && (
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor} blink-dot`}
          />
          map clicks set this pin
        </p>
      )}
    </div>
  );

  function pick(h: SearchHit) {
    const name = h.display_name.split(",").slice(0, 2).join(",").trim();
    onSelect({ lat: parseFloat(h.lat), lng: parseFloat(h.lon) }, name);
    setOpen(false);
  }
}
