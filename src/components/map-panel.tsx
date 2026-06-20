"use client";

import dynamic from "next/dynamic";

// Leaflet touches the window, so load the map only on the client.
const HubsMap = dynamic(() => import("./hubs-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[62vh] w-full animate-pulse rounded-2xl border bg-surface-2" />
  ),
});

export function MapPanel() {
  return <HubsMap />;
}
