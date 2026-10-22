export type ClusterId = "white" | "green" | "red";

export interface MatrixRow {
  route: string;
  km: number;
  fare: number;
}

export interface Cluster {
  id: ClusterId;
  name: string;
  tagline: string;
  color: string;
  colorDeep: string;
  soft: string;
  areas: string[];
  basis: string;
  rows: MatrixRow[];
  /** approximate reference points [lat, lng] used to guess the cluster of a drop-off pin */
  refs: [number, number][];
}

export const BASE_FARE = 15;
export const BASE_KM = 4;
export const PER_KM = 1;
export const CITY_CENTER: [number, number] = [6.1112, 125.1735];

export interface FareBreakdown {
  base: number;
  extraKm: number;
  extra: number;
  total: number;
}

/**
 * General Santos City tricycle fare rule (City Ordinance No. 8, s. 2023, §120):
 * ₱15.00 for the first 4 km + ₱1.00 for every succeeding kilometer.
 */
export function computeFare(distKm: number): FareBreakdown {
  const extraKm = Math.max(0, Math.ceil(distKm - BASE_KM - 1e-9));
  return {
    base: BASE_FARE,
    extraKm,
    extra: extraKm * PER_KM,
    total: BASE_FARE + extraKm * PER_KM,
  };
}

export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180;
  const la2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function guessCluster(pos: [number, number]): Cluster {
  let best: Cluster = CLUSTERS[0];
  let bestD = Infinity;
  for (const c of CLUSTERS) {
    for (const ref of c.refs) {
      const d = haversineKm(pos, ref);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
  }
  return best;
}

export const CLUSTERS: Cluster[] = [
  {
    id: "white",
    name: "White Cluster",
    tagline: "North & City Heights runs",
    color: "#2f6ba7",
    colorDeep: "#245483",
    soft: "#e8eff6",
    areas: [
      "Lagao",
      "San Isidro",
      "City Heights",
      "Mabuhay",
      "Katangawan",
      "Conel",
      "Olympog",
      "Upper Labay",
      "Bulaong Terminal",
    ],
    basis: "City Ordinance No. 8, Series of 2023",
    refs: [
      [6.125, 125.164], // Lagao
      [6.1215, 125.1745], // San Isidro
      [6.117, 125.181], // City Heights
      [6.145, 125.176], // Mabuhay
      [6.132, 125.193], // Conel
      [6.138, 125.205], // Olympog
      [6.093, 125.152], // Upper Labay
      [6.1185, 125.1685], // Bulaong
    ],
    rows: [
      { route: "SM to Bulaong Terminal", km: 2.5, fare: 15 },
      { route: "KCC/Gaisano/SM to Bulaong Terminal", km: 3.14, fare: 15 },
      { route: "CBD/Public Market/SM to Leon Lledo St. – NLSA Junction (Brgy. Lagao)", km: 3.42, fare: 15 },
      { route: "Plaza General Santos to Lagao Gym", km: 3.55, fare: 15 },
      { route: "SM via Aparente St. to Mindanao Medical Center (Brgy. City Heights)", km: 3.68, fare: 15 },
      { route: "SM to SM Save More (Brgy. San Isidro)", km: 3.7, fare: 15 },
      { route: "KCC/Robinson via Digos Makar Rd. to Greenfield Residence (Brgy. Lagao)", km: 3.83, fare: 15 },
      { route: "KCC/Gaisano/SM via Aparente St. to Lagao National High School (Brgy. San Isidro)", km: 3.91, fare: 15 },
      { route: "Plaza General Santos to Dacera Ave. Yumang Junction (Brgy. San Isidro)", km: 3.93, fare: 15 },
      { route: "CBD/Public Market via Pioneer Ave., Aparente St. to Salvani St. (Brgy. City Heights)", km: 3.97, fare: 15 },
      { route: "KCC/Robinson via G. Misa St. to Sea Oil, Yumang St. corner Aparente St. (Brgy. City Heights)", km: 4, fare: 15 },
      { route: "CBD/Public Market to Purok Malakas Satellite Market (Brgy. San Isidro)", km: 4, fare: 15 },
      { route: "CBD/Public Market to Brgy. Hall – San Isidro", km: 4, fare: 15 },
      { route: "KCC/Robinson via G. Misa St. to Lessandra (Brgy. San Isidro)", km: 4, fare: 15 },
      { route: "CBD/Public Market to Habitat Phase B (Brgy. Mabuhay)", km: 8, fare: 19 },
      { route: "CBD/Public Market to VSM Heights (Brgy. San Isidro)", km: 8, fare: 19 },
      { route: "CBD/Public Market to Habitat Phase A (Brgy. Mabuhay)", km: 9, fare: 20 },
      { route: "CBD/Public Market to Brgy. Hall – Katangawan", km: 9, fare: 20 },
      { route: "CBD/Public Market to Brgy. Hall – Mabuhay", km: 13, fare: 24 },
      { route: "CBD/Public Market to Brgy. Hall – Conel", km: 15, fare: 26 },
      { route: "CBD/Public Market to Brgy. Hall – Olympog", km: 16, fare: 27 },
      { route: "CBD/Public Market to Brgy. Hall – Upper Labay", km: 25, fare: 36 },
    ],
  },
  {
    id: "green",
    name: "Apple Green Cluster",
    tagline: "East & coastal barangays",
    color: "#379a5e",
    colorDeep: "#2a7a49",
    soft: "#e9f4ec",
    areas: ["Bula", "Gensanville", "Baluan", "Ligaya", "Buayan", "Tinagacan"],
    basis: "City Ordinance No. 8, Series of 2023",
    refs: [
      [6.1105, 125.182], // Bula
      [6.112, 125.178], // Gensanville
      [6.099, 125.176], // Baluan
      [6.107, 125.19], // Ligaya
      [6.101, 125.183], // Buayan
      [6.092, 125.187], // Tinagacan
    ],
    rows: [
      { route: "CBD/Public Market to Brgy. Hall – Bula", km: 2.1, fare: 15 },
      { route: "KCC via Arriola St. to Gensanville (Brgy. Bula)", km: 2.86, fare: 15 },
      { route: "CBD/Public Market/Gaisano/KCC/Robinson to Lagao Public Market", km: 3.1, fare: 15 },
      { route: "SM via Public Market to Gensanville (Brgy. Bula)", km: 3.59, fare: 15 },
      { route: "Plaza GenSan/SM/Gaisano/KCC/Robinson to Lagao Public Market", km: 3.92, fare: 15 },
      { route: "SM/Gaisano/KCC/Robinson to VSM Estate (Brgy. Lagao)", km: 4, fare: 15 },
      { route: "KCC/Robinson to Balut Park (Brgy. Baluan)", km: 4, fare: 15 },
      { route: "Plaza General Santos to Gensanville (Brgy. Bula)", km: 4, fare: 15 },
      { route: "CBD/Public Market to Agan (Brgy. Ligaya)", km: 5, fare: 16 },
      { route: "CBD/Public Market to Brgy. Hall – Baluan", km: 6, fare: 17 },
      { route: "CBD/Public Market to Brgy. Hall – Buayan", km: 7, fare: 18 },
      { route: "CBD/Public Market to Brgy. Hall – Ligaya", km: 8, fare: 19 },
      { route: "CBD/Public Market to Brgy. Hall – Tinagacan", km: 16, fare: 27 },
    ],
  },
  {
    id: "red",
    name: "Red Cluster",
    tagline: "South & port district",
    color: "#d8453e",
    colorDeep: "#b2332d",
    soft: "#f9e9e7",
    areas: [
      "Labangal",
      "Calumpang",
      "Apopong",
      "Tambler",
      "Fatima",
      "Sinawal",
      "Siguel–Bawing",
      "Gensan Port",
    ],
    basis: "City Ordinance No. 37, s. 2018 (as amended, 2023)",
    refs: [
      [6.106, 125.166], // Labangal
      [6.108, 125.172], // Calumpang
      [6.101, 125.174], // Apopong
      [6.104, 125.181], // Tambler
      [6.1035, 125.177], // Fatima
      [6.099, 125.171], // Sinawal
      [6.088, 125.172], // Siguel-Bawing
    ],
    rows: [
      { route: "KCC via Public Market to Petronas Gas Station (Brgy. Labangal)", km: 3.9, fare: 15 },
      { route: "Plaza General Santos to King Solomon Institute (Brgy. Labangal)", km: 3.95, fare: 15 },
      { route: "SM to Labangal Rd., Gensan Port North Gate (Brgy. Labangal)", km: 3.96, fare: 15 },
      { route: "CBD/Public Market to Bloomfields Subdivision (Brgy. Labangal)", km: 3.98, fare: 15 },
      { route: "CBD/Public Market to King Solomon Institute (Brgy. Labangal)", km: 3.99, fare: 15 },
      { route: "CBD/Public Market to Brgy. Hall – Calumpang", km: 6, fare: 17 },
      { route: "CBD/Public Market to Pk. Barrio Bloan (Brgy. Labangal)", km: 6, fare: 17 },
      { route: "CBD/Public Market to Brgy. Hall – Apopong", km: 8, fare: 19 },
      { route: "CBD/Public Market to Brgy. Hall – Tambler", km: 10, fare: 21 },
      { route: "CBD/Public Market to Lanton (Brgy. Apopong)", km: 11, fare: 22 },
      { route: "CBD/Public Market to Fishport Complex (Brgy. Tambler)", km: 11, fare: 22 },
      { route: "CBD/Public Market to Brgy. Hall – Fatima", km: 12, fare: 23 },
      { route: "CBD/Public Market to Brgy. Hall – Sinawal", km: 13, fare: 24 },
      { route: "CBD/Public Market to Brgy. Hall – Siguel/Bawing", km: 18, fare: 29 },
    ],
  },
];

export const pes = (n: number, decimals = 0) =>
  `₱${n.toLocaleString("en-PH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
