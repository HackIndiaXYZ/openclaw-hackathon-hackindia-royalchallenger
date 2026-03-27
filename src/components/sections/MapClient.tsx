import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase, type Issue } from "@/lib/supabase";
import * as React from "react";

// Custom colored markers
function createIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 14px; height: 14px;
      background: ${color};
      border: 2px solid ${color}66;
      border-radius: 50%;
      box-shadow: 0 0 10px ${color}66;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const statusColorMap: Record<string, string> = {
  open: "#FF3B3B",
  "in-progress": "#FF3B3B",
  resolved: "#00FF88",
};

function MapBounds({ issues }: { issues: any[] }) {
  const map = useMap();
  React.useEffect(() => {
    if (issues && issues.length > 0) {
      const validIssues = issues.filter(i => i.latitude && i.longitude);
      if (validIssues.length > 0) {
        const bounds = L.latLngBounds(validIssues.map(i => [i.latitude, i.longitude]));
        // Lower maxZoom (12) ensures we see surrounding cities and context instead of an extreme close-up.
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    }
  }, [issues, map]);
  return null;
}

export default function MapClient({ issues }: { issues: any[] }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "var(--color-bg-base)" }}
      >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapBounds issues={issues} />
          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createIcon(statusColorMap[issue.status] || "#7A8BAD")}
            >
              <Popup>
                <div style={{ fontFamily: "Inter, sans-serif", minWidth: 180 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-bg-base)", marginBottom: 4 }}>
                    {issue.title}
                  </p>
                  <p style={{ fontSize: 11, color: "#5A6A88" }}>
                    Status:{" "}
                    <span style={{ color: statusColorMap[issue.status], fontWeight: 600 }}>
                      {issue.status.toUpperCase()}
                    </span>
                  </p>
                  <p style={{ fontSize: 10, color: "#9A9A9A", marginTop: 4 }}>
                    {new Date(issue.created_at).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
    </div>
  );
}
