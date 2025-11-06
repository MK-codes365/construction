// Fix Leaflet's default icon URLs when bundlers (like Next.js) move assets
import L from 'leaflet';

// Prefer local images placed under `public/leaflet/` to avoid external CDN
// and to keep Next/Turbopack happy in dev. Please copy these files into:
//   public/leaflet/marker-icon.png
//   public/leaflet/marker-icon-2x.png
//   public/leaflet/marker-shadow.png
// If local files are missing, this helper will fall back to the Leaflet CDN
// so markers still render.
const LEAFLET_PUBLIC_BASE = '/leaflet';
const LEAFLET_CDN_BASE = 'https://unpkg.com/leaflet@1.9.4/dist/images';

export function configureLeafletDefaultIcon() {
  try {
    // @ts-ignore - mergeOptions exists on Icon.Default
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  } catch (e) {
    // ignore
  }

  // Helper to apply the chosen base URL to Leaflet's default icon options
  const applyBase = (base: string) => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: `${base}/marker-icon-2x.png`,
      iconUrl: `${base}/marker-icon.png`,
      shadowUrl: `${base}/marker-shadow.png`,
    });
  };

  // Inline SVG fallbacks encoded as data URLs so the map will show markers
  // even when no local files are present and to avoid external CDN calls.
  const inlineIconSvg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'>
    <path d='M12.5 0C5.6 0 0 5.6 0 12.5 0 22.1 12.5 41 12.5 41S25 22.1 25 12.5C25 5.6 19.4 0 12.5 0z' fill='#3388ff' stroke='#000' stroke-width='1'/>
  </svg>`;

  const inlineShadowSvg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' width='40' height='20' viewBox='0 0 40 20'>
    <ellipse cx='20' cy='10' rx='18' ry='6' fill='rgba(0,0,0,0.25)' />
  </svg>`;

  const INLINE_ICON_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(inlineIconSvg)}`;
  const INLINE_ICON_RETINA_URL = INLINE_ICON_URL;
  const INLINE_SHADOW_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(inlineShadowSvg)}`;

  const applyInline = () => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: INLINE_ICON_RETINA_URL,
      iconUrl: INLINE_ICON_URL,
      shadowUrl: INLINE_SHADOW_URL,
    });
  };

  // If running on the server (SSR) choose CDN to avoid relying on browser-only
  // asset checks. When in the browser, probe the local path and fall back to CDN
  // if the file is not present.
  if (typeof window === 'undefined') {
    applyBase(LEAFLET_CDN_BASE);
    return;
  }

  const testUrl = `${LEAFLET_PUBLIC_BASE}/marker-icon.png`;
  const img = new Image();
  img.onload = () => applyBase(LEAFLET_PUBLIC_BASE);
  // If local file missing, prefer the inline SVG fallback (no network) and
  // only then the CDN as a last-resort compatibility fallback.
  img.onerror = () => {
    try {
      applyInline();
    } catch (e) {
      applyBase(LEAFLET_CDN_BASE);
    }
  };
  img.src = testUrl;
}

export default configureLeafletDefaultIcon;
