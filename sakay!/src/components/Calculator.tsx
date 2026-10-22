import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FareMap, { type LatLng } from "./FareMap";
import LocationCard from "./LocationCard";
import ResultTicket from "./ResultTicket";
import { guessCluster, haversineKm, isWithinCity } from "../data/fareData";
import { Reveal } from "../hooks";

interface RouteResult {
  km: number;
  etaMin: number;
  source: "osrm" | "approx";
  coords: [number, number][] | null;
}

const TRICYCLE_SPEED_FACTOR = 1.25; // tricycles stop/start more than cars

export default function Calculator() {
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [startLabel, setStartLabel] = useState("");
  const [endLabel, setEndLabel] = useState("");
  const [activePin, setActivePin] = useState<"start" | "end">("start");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fly, setFly] = useState<{ pos: [number, number]; ts: number } | null>(null);
  const [pinNotice, setPinNotice] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // auto-advance: once start is set, map clicks target the drop-off
  useEffect(() => {
    if (start && !end) setActivePin("end");
  }, [start, end]);

  // clear the out-of-area notice a few seconds after it appears
  useEffect(() => {
    if (!pinNotice) return;
    const t = setTimeout(() => setPinNotice(null), 5000);
    return () => clearTimeout(t);
  }, [pinNotice]);

  const handlePin = useCallback(
    (pos: LatLng) => {
      if (!isWithinCity(pos.lat, pos.lng)) {
        setPinNotice("Outside General Santos City — pick a spot inside the city.");
        return;
      }
      setPinNotice(null);
      if (activePin === "start") {
        setStart(pos);
        setStartLabel("Pinned location");
      } else {
        setEnd(pos);
        setEndLabel("Pinned location");
      }
    },
    [activePin]
  );

  const handleSearchSelect = useCallback(
    (role: "start" | "end") =>
      (pos: LatLng, label: string) => {
        if (role === "start") {
          setStart(pos);
          setStartLabel(label);
        } else {
          setEnd(pos);
          setEndLabel(label);
        }
        setFly({ pos: [pos.lat, pos.lng], ts: Date.now() });
      },
    []
  );

  // fetch the actual road route (OSRM), fall back to straight-line estimate
  useEffect(() => {
    if (!start || !end) {
      setRoute(null);
      setLoading(false);
      return;
    }
    if (
      start.lat === end.lat &&
      start.lng === end.lng
    ) {
      setRoute(null);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);

    (async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error("route request failed");
        const data = await res.json();
        const r = data.routes?.[0];
        if (!r) throw new Error("no route found");
        if (ctrl.signal.aborted) return;
        const km = r.distance / 1000;
        setRoute({
          km,
          etaMin: Math.max(2, (r.duration * TRICYCLE_SPEED_FACTOR) / 60),
          source: "osrm",
          coords: r.geometry?.coordinates?.map(
            ([lon, lat]: [number, number]) => [lat, lon] as [number, number]
          ) ?? null,
        });
      } catch (err) {
        if (ctrl.signal.aborted || (err as Error).name === "AbortError") return;
        const km = haversineKm([start.lat, start.lng], [end.lat, end.lng]) * 1.35;
        setRoute({
          km,
          etaMin: Math.max(2, (km / 18) * 60),
          source: "approx",
          coords: null,
        });
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [start, end]);

  const cluster = useMemo(
    () => (end ? guessCluster([end.lat, end.lng]) : null),
    [end]
  );

  const swap = () => {
    setStart(end);
    setEnd(start);
    setStartLabel(endLabel);
    setEndLabel(startLabel);
    setActivePin(activePin === "start" ? "end" : "start");
  };

  const clearAll = () => {
    setStart(null);
    setEnd(null);
    setStartLabel("");
    setEndLabel("");
    setActivePin("start");
    setRoute(null);
  };

  return (
    <section id="calculator" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-tri-red">
              · The calculator
            </p>
            <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
              Pin it. Ride it.
              <span className="relative inline-block">
                {" "}
                Pay it.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 120 10"
                  preserveAspectRatio="none"
                >
                  <path d="M2 7 Q 30 2 60 6 T 118 4" fill="none" stroke="#ffc531" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            Tap the map to place your <strong className="text-ink">start</strong> and{" "}
            <strong className="text-ink">drop-off</strong> — or search a barangay. We
            trace the actual road and compute the ordinance fare.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* MAP */}
        <Reveal delay={80} className="relative">
          <div className="relative h-[380px] overflow-hidden rounded-2xl border-2 border-ink shadow-[10px_10px_0_rgba(27,36,64,0.14)] sm:h-[520px]">
            <FareMap
              start={start}
              end={end}
              activePin={activePin}
              route={route}
              fly={fly}
              onPin={handlePin}
              cluster={cluster}
            />

            {/* mode pill */}
            <div className="absolute left-3 top-3 z-[1100] flex overflow-hidden rounded-full border-2 border-ink bg-cream shadow-md">
              <button
                onClick={() => setActivePin("start")}
                className={`px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition ${
                  activePin === "start"
                    ? "bg-tri-yellow text-ink"
                    : "text-ink-soft hover:bg-paper"
                }`}
              >
                ● Start
              </button>
              <button
                onClick={() => setActivePin("end")}
                className={`px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition ${
                  activePin === "end"
                    ? "bg-tri-red text-cream"
                    : "text-ink-soft hover:bg-paper"
                }`}
              >
                ● Drop-off
              </button>
            </div>

            {/* helper / out-of-area notice */}
            {pinNotice ? (
              <div
                role="status"
                className="pointer-events-none absolute bottom-6 left-3 z-[1100] max-w-[calc(100%-1.5rem)] rounded-lg bg-tri-red px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-cream shadow-md"
              >
                {pinNotice}
              </div>
            ) : (
              <div className="pointer-events-none absolute bottom-6 left-3 z-[1100] hidden rounded-lg bg-ink/85 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-tri-yellow backdrop-blur-sm sm:block">
                {start && end
                  ? "both pins set — switch modes above to move one"
                  : `click the map to place ${activePin === "start" ? "the START pin" : "the DROP-OFF pin"}`}
              </div>
            )}
          </div>
        </Reveal>

        {/* CONTROLS */}
        <Reveal delay={160} className="flex flex-col gap-3">
          <LocationCard
            role="start"
            value={start}
            label={startLabel}
            active={activePin === "start"}
            onSelect={handleSearchSelect("start")}
            onClear={() => {
              setStart(null);
              setStartLabel("");
              if (!end) setActivePin("start");
            }}
          />
          <LocationCard
            role="end"
            value={end}
            label={endLabel}
            active={activePin === "end"}
            onSelect={handleSearchSelect("end")}
            onClear={() => {
              setEnd(null);
              setEndLabel("");
            }}
          />

          <div className="flex gap-2">
            <button
              onClick={swap}
              disabled={!start && !end}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-ink bg-cream px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition hover:-translate-y-0.5 hover:bg-tri-yellow disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-cream"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21 16-4 4-4-4" />
                <path d="M17 20V4" />
                <path d="m3 8 4-4 4 4" />
                <path d="M7 4v16" />
              </svg>
              Swap
            </button>
            <button
              onClick={clearAll}
              disabled={!start && !end}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-ink bg-cream px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-tri-red transition hover:-translate-y-0.5 hover:bg-tri-red hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-cream"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Start over
            </button>
          </div>

          <ResultTicket
            route={route}
            cluster={cluster}
            hasBoth={!!start && !!end}
            loading={loading}
          />

          <p className="font-mono text-[10px] leading-relaxed text-ink-soft/80">
            * Fares follow §120, City Ordinance No. 8 s. 2023: ₱15.00 flat for the
            first 4 km + ₱1.00 per succeeding km. Zone badge estimates which cluster
            covers your drop-off area.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
