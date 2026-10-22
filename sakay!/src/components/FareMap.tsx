import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { CITY_CENTER, type Cluster } from "../data/fareData";

export interface LatLng {
  lat: number;
  lng: number;
}

function pinIcon(color: string, label: string, pulsing: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="pin-wrap ${pulsing ? "pulsing" : ""}" style="--pin:${color}">
      <span class="pin-ring"></span>
      <span class="pin-tag">${label}</span>
      <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 1.5C8.7 1.5 2 8.2 2 16.4 2 27.4 17 42.5 17 42.5S32 27.4 32 16.4C32 8.2 25.3 1.5 17 1.5Z" fill="${color}" stroke="#1b2440" stroke-width="2.5"/>
        <circle cx="17" cy="16.5" r="6" fill="#fffdf6" stroke="#1b2440" stroke-width="2"/>
      </svg>
    </div>`,
    iconSize: [34, 44],
    iconAnchor: [17, 42],
  });
}

function MapClicker({ onPin }: { onPin: (p: LatLng) => void }) {
  useMapEvents({
    click: (e) => onPin({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
}

function FlyTo({
  target,
}: {
  target: { pos: [number, number]; ts: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target.pos, Math.max(map.getZoom(), 14), { duration: 0.9 });
  }, [target?.ts]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

interface FareMapProps {
  start: LatLng | null;
  end: LatLng | null;
  activePin: "start" | "end";
  route: { coords: [number, number][] | null } | null;
  fly: { pos: [number, number]; ts: number } | null;
  onPin: (p: LatLng) => void;
  cluster: Cluster | null;
}

export default function FareMap({
  start,
  end,
  activePin,
  route,
  fly,
  onPin,
  cluster,
}: FareMapProps) {
  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full outline-none"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <MapClicker onPin={onPin} />
      <FlyTo target={fly} />

      {start && (
        <Marker
          position={[start.lat, start.lng]}
          icon={pinIcon("#ffc531", "START", activePin === "start")}
          zIndexOffset={500}
        />
      )}
      {end && (
        <Marker
          position={[end.lat, end.lng]}
          icon={pinIcon("#d8453e", "DROP-OFF", activePin === "end")}
          zIndexOffset={500}
        />
      )}

      {route?.coords && route.coords.length > 1 && (
        <>
          <Polyline
            positions={route.coords}
            pathOptions={{ color: "#1b2440", weight: 8, opacity: 0.85 }}
          />
          <Polyline
            positions={route.coords}
            pathOptions={{
              className: "route-line",
              color: cluster ? cluster.color : "#ffc531",
              weight: 4,
              opacity: 1,
            }}
          />
        </>
      )}
    </MapContainer>
  );
}
