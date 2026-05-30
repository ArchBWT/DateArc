import { useEffect, useRef, useState } from 'react';
import { getYandexApiKey, hasYandexApiKey } from '../services/yandexGeosearch';

const YMAPS_SCRIPT_ID = 'ymaps3-script';

let ymapsLoadPromise = null;

function loadYmaps3() {
  const apikey = getYandexApiKey();
  if (!apikey) {
    return Promise.reject(new Error('NO_API_KEY'));
  }

  if (window.ymaps3) {
    return window.ymaps3.ready.then(() => window.ymaps3);
  }

  if (!ymapsLoadPromise) {
    ymapsLoadPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById(YMAPS_SCRIPT_ID);
      if (existing) {
        const wait = setInterval(() => {
          if (window.ymaps3) {
            clearInterval(wait);
            window.ymaps3.ready.then(() => resolve(window.ymaps3));
          }
        }, 100);
        setTimeout(() => {
          clearInterval(wait);
          if (!window.ymaps3) reject(new Error('Yandex Maps load timeout'));
        }, 20000);
        return;
      }

      const script = document.createElement('script');
      script.id = YMAPS_SCRIPT_ID;
      script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apikey)}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        if (!window.ymaps3) {
          reject(new Error('Yandex Maps script loaded but ymaps3 is missing'));
          return;
        }
        window.ymaps3.ready
          .then(() => resolve(window.ymaps3))
          .catch(reject);
      };
      script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));
      document.head.appendChild(script);
    });
  }

  return ymapsLoadPromise;
}

/** Загрузка JavaScript API 3.0 Яндекс.Карт */
export function useYandexMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasYandexApiKey()) {
      setError('NO_API_KEY');
      setIsLoaded(false);
      return;
    }

    let cancelled = false;

    loadYmaps3()
      .then(() => {
        if (!cancelled) {
          setIsLoaded(true);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setIsLoaded(false);
          setError(err.message === 'NO_API_KEY' ? 'NO_API_KEY' : err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { isLoaded, error };
}

function getHeartIconHtml() {
  return `
    <div style="
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #e8836a, #c9a96e);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 20px rgba(232,131,106,0.5);
      border: 3px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center;
    ">
      <div style="transform: rotate(45deg); color: white; font-size: 14px;">♥</div>
    </div>
  `;
}

/** [широта, долгота] → [долгота, широта] для Yandex Maps */
function toLonLat(coords) {
  if (!coords) return null;
  if (Array.isArray(coords)) return [coords[1], coords[0]];
  return [coords.lng ?? coords[1], coords.lat ?? coords[0]];
}

function injectYandexMapStyles() {
  const styleId = 'yandex-map-custom-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    .map-container [class*="--main-engine-container"],
    .map-container [class*="--map-container"] {
      border-radius: inherit;
    }
    .yandex-map-marker {
      cursor: default;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Карта Яндекс (JavaScript API 3.0).
 * center — [долгота, широта]. markerCoords — [широта, долгота].
 * Ключ: VITE_YANDEX_MAPS_API_KEY + продукт «JavaScript API» в кабинете разработчика.
 */
export function YandexMap({ center, zoom = 14, markerCoords, onMapClick }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const listenerRef = useRef(null);

  const { isLoaded, error } = useYandexMaps();

  const defaultCenter = [37.618, 55.752];
  const viewCenter = center ?? defaultCenter;
  const markerLonLat = toLonLat(markerCoords);

  useEffect(() => {
    if (!isLoaded || !window.ymaps3 || !containerRef.current) return;

    let destroyed = false;

    const init = async () => {
      const ymaps3 = window.ymaps3;
      await ymaps3.ready;

      if (destroyed || !containerRef.current || mapRef.current) return;

      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
        YMapListener,
      } = ymaps3;

      injectYandexMapStyles();
      containerRef.current.replaceChildren();

      const map = new YMap(containerRef.current, {
        location: { center: viewCenter, zoom },
        mode: 'vector',
        behaviors: ['drag', 'scrollZoom', 'pinchZoom', 'dblClick'],
      });

      map.addChild(new YMapDefaultSchemeLayer({ theme: 'dark' }));
      map.addChild(new YMapDefaultFeaturesLayer());

      if (onMapClick) {
        const listener = new YMapListener({
          layer: 'any',
          onClick: (_object, event) => {
            if (event?.coordinates) {
              onMapClick(event.coordinates);
            }
          },
        });
        map.addChild(listener);
        listenerRef.current = listener;
      }

      mapRef.current = map;

      if (markerLonLat) {
        addMarker(ymaps3, markerLonLat);
      }
    };

    init();

    return () => {
      destroyed = true;
      destroyMap();
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!mapRef.current || !window.ymaps3) return;

    mapRef.current.update({
      location: {
        center: markerLonLat || viewCenter,
        zoom,
        duration: markerLonLat ? 500 : 400,
      },
    });
  }, [viewCenter[0], viewCenter[1], zoom, isLoaded]);

  useEffect(() => {
    if (!mapRef.current || !window.ymaps3) return;

    if (markerRef.current) {
      try {
        mapRef.current.removeChild(markerRef.current);
      } catch (_) {
        /* ignore */
      }
      markerRef.current = null;
    }

    if (markerLonLat) {
      addMarker(window.ymaps3, markerLonLat);
      mapRef.current.update({
        location: { center: markerLonLat, zoom, duration: 500 },
      });
    }
  }, [markerLonLat?.[0], markerLonLat?.[1], zoom, isLoaded]);

  function addMarker(ymaps3, coordinates) {
    const { YMapMarker } = ymaps3;
    if (!YMapMarker || !mapRef.current) return;

    const el = document.createElement('div');
    el.className = 'yandex-map-marker';
    el.innerHTML = getHeartIconHtml();

    const marker = new YMapMarker({ coordinates }, el);
    mapRef.current.addChild(marker);
    markerRef.current = marker;
  }

  function destroyMap() {
    if (markerRef.current && mapRef.current) {
      try {
        mapRef.current.removeChild(markerRef.current);
      } catch (_) {
        /* ignore */
      }
    }
    if (listenerRef.current && mapRef.current) {
      try {
        mapRef.current.removeChild(listenerRef.current);
      } catch (_) {
        /* ignore */
      }
    }
    if (mapRef.current) {
      try {
        mapRef.current.destroy();
      } catch (_) {
        /* ignore */
      }
    }
    mapRef.current = null;
    markerRef.current = null;
    listenerRef.current = null;
  }

  if (!hasYandexApiKey() || error === 'NO_API_KEY') {
    return (
      <div
        className="map-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 32 }}>🗺️</span>
        <span style={{ color: 'var(--text-color)', fontSize: 14, fontWeight: 600 }}>
          Нужен ключ Яндекс.Карт
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 12, maxWidth: 300, lineHeight: 1.5 }}>
          Добавьте <code>VITE_YANDEX_MAPS_API_KEY</code> в <code>.env</code> и включите
          JavaScript API на developer.tech.yandex.ru
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="map-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 32 }}>⚠️</span>
        <span style={{ color: 'var(--text-color)', fontSize: 14, fontWeight: 600 }}>
          Не удалось загрузить Яндекс.Карты
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 12, maxWidth: 280, lineHeight: 1.5 }}>
          {error}. Проверьте ключ, Referer (localhost) и интернет.
        </span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="map-container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            border: '2px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--accent-coral)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Загрузка Яндекс.Карт…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <div ref={containerRef} className="map-container" />;
}
