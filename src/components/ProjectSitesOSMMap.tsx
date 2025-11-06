import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { projectSites, wasteLogs } from '@/lib/data';

const defaultPosition = projectSites.length
  ? [projectSites[0].lat, projectSites[0].lng]
  : [0, 0];

export default function ProjectSitesOSMMap() {
  const [selected, setSelected] = useState<any | null>(null);

  // Helper to get site by name
  const getSiteByName = (name: string) => projectSites.find(s => s.name === name);

  return (
    <MapContainer center={defaultPosition as [number, number]} zoom={10} style={{ width: '100%', height: 500 }}>
      <TileLayer
        attribution={"© OpenStreetMap contributors"}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Project Sites (red markers) */}
      {projectSites.map(site => (
        <Marker
          key={site.id}
          position={[site.lat, site.lng]}
          eventHandlers={{
            click: () => setSelected({ type: 'site', ...site })
          }}
        >
          {selected && selected.type === 'site' && selected.id === site.id && (
            <Popup eventHandlers={{ remove: () => setSelected(null) }}>
              <div>
                <strong>{site.name}</strong><br />
                {site.location}<br />
                Manager: {site.manager}<br />
                Area: {site.squareMeters} m²
              </div>
            </Popup>
          )}
        </Marker>
      ))}
      {/* Waste Logs (blue markers) */}
      {wasteLogs.map(log => {
        const site = getSiteByName(log.site);
        if (!site) return null;
        return (
          <Marker
            key={log.id}
            position={[site.lat, site.lng]}
            eventHandlers={{
              click: () => setSelected({ type: 'waste', ...log })
            }}
          >
            {selected && selected.type === 'waste' && selected.id === log.id && (
              <Popup eventHandlers={{ remove: () => setSelected(null) }}>
                <div>
                  <strong>Waste Log</strong><br />
                  Site: {log.site}<br />
                  Material: {log.materialType}<br />
                  Quantity: {log.quantity} kg<br />
                  Date: {log.date.toLocaleDateString()}<br />
                  Method: {log.disposalMethod}
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </MapContainer>
  );
}
