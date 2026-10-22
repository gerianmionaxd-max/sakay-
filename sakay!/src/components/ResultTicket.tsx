import { useCountUp } from "../hooks";
import {
  BASE_FARE,
  BASE_KM,
  computeFare,
  pes,
  type Cluster,
} from "../data/fareData";

interface ResultTicketProps {
  route: { km: number; etaMin: number; source: "osrm" | "approx" } | null;
  cluster: Cluster | null;
  hasBoth: boolean;
  loading: boolean;
}

function Num({
  value,
  format,
}: {
  value: number | null;
  format: (n: number) => string;
}) {
  const v = useCountUp(value ?? 0);
  if (value === null) return <span>—</span>;
  return <>{format(v)}</>;
}

export default function ResultTicket({
  route,
  cluster,
  hasBoth,
  loading,
}: ResultTicketProps) {
  const fare = route ? computeFare(route.km) : null;

  return (
    <div className="ticket rounded-xl border-2 border-dashed border-ink/70 p-5 shadow-[8px_8px_0_rgba(27,36,64,0.12)]">
      <div className="flex items-center justify-between border-b border-dashed border-line-strong pb-3">
        <p className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase">
          GenSan Trike Fare
        </p>
        <p className="font-mono text-[10px] tracking-wider text-ink-soft">
          {new Date().toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-3 py-4">
        {/* distance */}
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Distance
            </p>
            <p className="font-mono text-3xl font-bold leading-tight">
              <Num value={route ? route.km : null} format={(n) => n.toFixed(2)} />
              <span className="ml-1 text-base font-bold text-ink-soft">km</span>
            </p>
          </div>
          <svg className="mb-1 h-7 w-7 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17c4-8 6-2 9-6s5-1 9-7" strokeDasharray="3 3" />
            <circle cx="3" cy="17" r="1.8" fill="currentColor" />
            <path d="M21 4l-3.5 1 2.5 2.5L21 4Z" fill="currentColor" stroke="none" />
          </svg>
        </div>

        {/* eta */}
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Estimated travel time
            </p>
            <p className="font-mono text-3xl font-bold leading-tight">
              <Num value={route ? route.etaMin : null} format={(n) => String(Math.round(n))} />
              <span className="ml-1 text-base font-bold text-ink-soft">min</span>
            </p>
          </div>
          <svg className="mb-1 h-7 w-7 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.8 2M9 2h6" />
          </svg>
        </div>

        {/* fare */}
        <div className="flex items-end justify-between rounded-lg bg-ink px-4 py-3 text-tri-yellow">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-tri-yellow/70">
              Total fare
            </p>
            <p className="font-display text-4xl leading-none">
              <Num value={fare ? fare.total : null} format={(n) => pes(Math.round(n))} />
            </p>
          </div>
          <svg className="mb-1 h-8 w-8 text-tri-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9.2" />
            <path d="M14.8 7.2c-.6-.9-1.7-1.4-3-1.4-2.2 0-3.6 1.3-3.6 3s1.4 2.4 3.6 3 3.6 1.3 3.6 3-1.4 3-3.6 3c-1.3 0-2.4-.5-3-1.4" />
            <path d="M8.6 6v12" strokeWidth="1.4" />
          </svg>
        </div>

        {/* breakdown */}
        {fare && (
          <div className="space-y-1 font-mono text-[11px] leading-relaxed text-ink-soft">
            <div className="flex justify-between">
              <span>
                Base fare · first {BASE_KM} km
              </span>
              <span className="font-bold text-ink">{pes(BASE_FARE, 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                + {fare.extraKm} km × ₱1.00 (succeeding km)
              </span>
              <span className="font-bold text-ink">{pes(fare.extra, 2)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-line-strong pt-1 text-sm font-bold text-ink">
              <span>Pay your driver</span>
              <span>{pes(fare.total, 2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* footer strip */}
      <div className="border-t border-dashed border-line-strong pt-3">
        {loading && (
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            <span className="spin-slow inline-block h-3 w-3 rounded-full border-2 border-line border-t-ink" />
            Measuring the road…
          </p>
        )}
        {!loading && !route && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            {hasBoth
              ? "Computing…"
              : "Pin a start and drop-off to print your fare."}
          </p>
        )}
        {route && !loading && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {cluster ? (
              <span
                className="rounded-full border-2 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: cluster.colorDeep,
                  borderColor: cluster.color,
                  background: cluster.soft,
                }}
              >
                {cluster.name} zone
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                zone unknown
              </span>
            )}
            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft/70">
              {route.source === "osrm"
                ? "route via OpenStreetMap roads"
                : "approx. straight-line × 1.35"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
