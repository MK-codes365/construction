"use client";

// This component requires browser-only APIs (Leaflet). Make it a client
// component so Next.js doesn't attempt to server-render it.
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchMapData } from '@/services/gisService';
import configureLeafletDefaultIcon from '@/lib/leafletIcon';

// ensure Leaflet default icon paths work under the bundler


const materialColors: Record<string, string> = {
  Concrete: '#888888',
  Wood: '#8d5524',
  Metal: '#00bcd4',
  Plastic: '#ff9800',
  Glass: '#90caf9',
  Other: '#43a047',
};

export default function GISMapExample() {
  const [sitesFC, setSitesFC] = useState<any | null>(null);
  const [wasteFC, setWasteFC] = useState<any | null>(null);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [materialFilter, setMaterialFilter] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [liveEnabled, setLiveEnabled] = useState<boolean>(true);

  useEffect(() => {
    // configure Leaflet icon paths on the client
    try {
      configureLeafletDefaultIcon();
    } catch (e) {
      // ignore - configuration is best-effort
    }
    let mounted = true;
    let intervalId: any = null;
    let ws: WebSocket | null = null;

    const load = async () => {
      try {
        const res = await fetchMapData();
        if (!mounted) return;
        if (res && res.status === 'ok') {
          setSitesFC(res.sites || { type: 'FeatureCollection', features: [] });
          setWasteFC(res.waste || { type: 'FeatureCollection', features: [] });
          setLastUpdated(new Date().toISOString());
          // center map at first site if available
          const first = (res.sites && res.sites.features && res.sites.features[0]);
          if (first && first.geometry && first.geometry.coordinates) {
            const [lng, lat] = first.geometry.coordinates;
            setCenter([lat, lng]);
          }
        } else {
          setSitesFC({ type: 'FeatureCollection', features: [] });
          setWasteFC({ type: 'FeatureCollection', features: [] });
        }
      } catch (e) {
        if (!mounted) return;
        setSitesFC({ type: 'FeatureCollection', features: [] });
        setWasteFC({ type: 'FeatureCollection', features: [] });
      }
    };

    // initial load
    load();
    // poll every 5s
    intervalId = setInterval(load, 5000);

    // WebSocket realtime (best-effort)
    try {
      const envBase = (process.env.NEXT_PUBLIC_GIS_BASE as string) || '';
      const hostBase = envBase || ((window.location.protocol === 'https:') ? 'https://' : 'http://') + window.location.hostname + ':4003';
      const wsUrl = hostBase.replace(/^http/, 'ws').replace(/^https/, 'wss') + '/gis/ws';
      ws = new WebSocket(wsUrl);
      ws.addEventListener('open', () => {
        console.debug('GIS WS connected', wsUrl);
      });
      ws.addEventListener('message', (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg && msg.type === 'waste' && msg.payload) {
            // create feature for incoming log
            const log = msg.payload;
            const site = (sitesFC && sitesFC.features || []).find((f: any) => (f.properties && f.properties.name) === log.site);
            if (!site) return;
            const [lng, lat] = site.geometry.coordinates;
            const feat = { type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] }, properties: { id: log.id, materialType: log.materialType, quantity: log.quantity, date: log.date, site: log.site, disposalMethod: log.disposalMethod, binId: log.binId, cause: log.cause } };
            setWasteFC((prev: any) => {
              if (!prev) return { type: 'FeatureCollection', features: [feat] };
              // avoid duplicates
              if (prev.features.find((f: any) => f.properties && f.properties.id === feat.properties.id)) return prev;
              return { ...prev, features: [feat, ...prev.features] };
            });
            setLastUpdated(new Date().toISOString());
          }
        } catch (e) {
          console.debug('Invalid GIS WS message', e);
        }
      });
    } catch (e) {
      console.debug('Could not connect GIS WS', e);
    }

    return () => { mounted = false; if (intervalId) clearInterval(intervalId); if (ws) try { ws.close(); } catch (e) {} };
  }, []);

  const defaultPos = center[0] === 0 && center[1] === 0 ? [20, 0] : center;

  // compute filtered features
  const visibleWaste = (wasteFC && wasteFC.features || []).filter((f: any) => {
    const p = f.properties || {};
    if (materialFilter && materialFilter !== 'All' && p.materialType !== materialFilter) return false;
    if (dateFrom) {
      const d = new Date(p.date);
      const from = new Date(dateFrom + 'T00:00:00');
      if (d < from) return false;
    }
    if (dateTo) {
      const d = new Date(p.date);
      const to = new Date(dateTo + 'T23:59:59');
      if (d > to) return false;
    }
    return true;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">GIS Map Example</h2>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <div style={{ color: '#999', fontSize: 12 }}>{lastUpdated ? `Last updated: ${new Date(lastUpdated).toLocaleTimeString()}` : 'Loading...'}</div>
        <label style={{ color: '#ddd', fontSize: 13 }}>Material:
          <select style={{ marginLeft: 8 }} value={materialFilter} onChange={e => setMaterialFilter(e.target.value)}>
            <option value="All">All</option>
            {Object.keys(materialColors).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label style={{ color: '#ddd', fontSize: 13 }}>From:
          <input style={{ marginLeft: 8 }} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </label>
        <label style={{ color: '#ddd', fontSize: 13 }}>To:
          <input style={{ marginLeft: 8 }} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </label>
        <label style={{ color: '#ddd', fontSize: 13 }}>Live:
          <input style={{ marginLeft: 8 }} type="checkbox" checked={liveEnabled} onChange={e => setLiveEnabled(e.target.checked)} />
        </label>
      </div>
      <div style={{ height: 520 }}>
        <MapContainer center={defaultPos as [number, number]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution={'© OpenStreetMap contributors'}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Sites */}
          {sitesFC && sitesFC.features && sitesFC.features.map((f: any) => {
            const [lng, lat] = f.geometry.coordinates;
            const props = f.properties || {};
            return (
              <Marker key={props.id || `${lng}_${lat}`} position={[lat, lng] as [number, number]}>
                <Popup>
                  <div>
                    <strong>{props.name}</strong><br />
                    {props.location}<br />
                    Manager: {props.manager}<br />
                    Area: {props.squareMeters} m²
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Waste logs as colored circle markers (filtered) */}
          {visibleWaste.map((f: any) => {
            const [lng, lat] = f.geometry.coordinates;
            const p = f.properties || {};
            const color = materialColors[p.materialType] || '#666';
            const radius = Math.min(20, Math.max(6, (Number(p.quantity) || 0) / 200));
            return (
              <CircleMarker
                key={p.id || `${lng}_${lat}_${p.materialType}`}
                center={[lat, lng] as [number, number]}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }}
                radius={radius}
              >
                <Popup>
                  <div>
                    <strong>Waste Log</strong><br />
                    Site: {p.site}<br />
                    Material: {p.materialType}<br />
                    Quantity: {p.quantity} kg<br />
                    Date: {new Date(p.date).toLocaleDateString()}<br />
                    Method: {p.disposalMethod}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        </MapContainer>
      </div>
    </div>
  );
}
