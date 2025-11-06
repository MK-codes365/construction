// GIS Service API integration
import { projectSites } from '@/lib/data';

function siteToFeature(site) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [site.lng, site.lat],
    },
    properties: {
      id: site.id,
      name: site.name,
      location: site.location,
      manager: site.manager,
      squareMeters: site.squareMeters,
      startDate: site.startDate,
    },
  };
}

// Fetch waste logs from the Next.js API and map them to GeoJSON features using site coordinates
export const fetchMapData = async () => {
  try {
    // Fetch waste logs from Next API
    const res = await fetch('/api/ar/waste-logs');
    const payload = await res.json();

    const sitesFC = {
      type: 'FeatureCollection',
      features: projectSites.map(siteToFeature),
    };

    const wasteFeatures = [];
    if (payload && payload.status === 'ok' && Array.isArray(payload.logs)) {
      const logs = payload.logs;
      // Build a quick lookup for site coordinates by name
      const siteByName = projectSites.reduce((acc, s) => {
        acc[s.name] = s; return acc;
      }, {});

      logs.forEach(log => {
        const site = siteByName[log.site];
        if (!site) return; // skip logs with unknown site
        const feat = {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [site.lng, site.lat] },
          properties: {
            id: log.id,
            materialType: log.materialType,
            quantity: log.quantity,
            date: log.date,
            site: log.site,
            disposalMethod: log.disposalMethod,
            binId: log.binId,
            cause: log.cause,
          }
        };
        wasteFeatures.push(feat);
      });
    }

    const wasteFC = { type: 'FeatureCollection', features: wasteFeatures };

    return { status: 'ok', sites: sitesFC, waste: wasteFC };
  } catch (e) {
    return { status: 'error', error: String(e) };
  }
};

export const fetchSitesGeoJSON = async () => ({ type: 'FeatureCollection', features: projectSites.map(siteToFeature) });

export const fetchWasteGeoJSON = async () => {
  const map = await fetchMapData();
  if (map.status === 'ok') return map.waste;
  return { type: 'FeatureCollection', features: [] };
};
