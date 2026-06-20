"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT: [number, number] = [32.0853, 34.7818]; // Tel Aviv fallback

type Hub = { id: number; lat: number; lng: number; name: string };

type OverpassEl = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string };
};

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

async function fetchHubs(lat: number, lng: number): Promise<Hub[]> {
  const q = `[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="jewish"](around:4000,${lat},${lng});way["amenity"="place_of_worship"]["religion"="jewish"](around:4000,${lat},${lng}););out center 80;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(q),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { elements?: OverpassEl[] };
    return (data.elements ?? [])
      .map((el) => ({
        id: el.id,
        lat: el.lat ?? el.center?.lat,
        lng: el.lon ?? el.center?.lon,
        name: el.tags?.name || "בית כנסת",
      }))
      .filter((h): h is Hub => typeof h.lat === "number" && typeof h.lng === "number");
  } catch {
    return [];
  }
}

export default function HubsMap() {
  const [center, setCenter] = useState<[number, number]>(DEFAULT);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    function load(lat: number, lng: number) {
      fetchHubs(lat, lng).then((h) => {
        if (!active) return;
        setHubs(h);
        setLoading(false);
      });
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!active) return;
          const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCenter(c);
          load(c[0], c[1]);
        },
        () => {
          if (active) load(DEFAULT[0], DEFAULT[1]);
        },
        { timeout: 8000 },
      );
    } else {
      load(DEFAULT[0], DEFAULT[1]);
    }
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative">
      <MapContainer
        center={DEFAULT}
        zoom={14}
        scrollWheelZoom
        className="h-[62vh] w-full overflow-hidden rounded-2xl border"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />
        <CircleMarker
          center={center}
          radius={8}
          pathOptions={{ color: "#234e70", fillColor: "#234e70", fillOpacity: 0.9 }}
        >
          <Popup>המיקום שלך</Popup>
        </CircleMarker>
        {hubs.map((h) => (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lng]}
            radius={7}
            pathOptions={{ color: "#be5a37", fillColor: "#be5a37", fillOpacity: 0.85 }}
          >
            <Popup>{h.name}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {loading && (
        <div className="absolute right-3 top-3 z-[1000] rounded-lg border bg-surface px-3 py-1.5 text-xs text-muted">
          טוען מוקדים...
        </div>
      )}
    </div>
  );
}
