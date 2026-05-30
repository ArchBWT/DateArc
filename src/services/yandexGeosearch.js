/** Ключ: https://developer.tech.yandex.ru/ → Геосаджест + API Геокодера (+ JavaScript API для карты) */
export function getYandexApiKey() {
  return (import.meta.env.VITE_YANDEX_MAPS_API_KEY || '').trim();
}

export function hasYandexApiKey() {
  return Boolean(getYandexApiKey());
}

const SUGGEST_PATH = import.meta.env.DEV
  ? '/yandex-api/suggest'
  : '/api/yandex/suggest';

const GEOCODE_PATH = import.meta.env.DEV
  ? '/yandex-api/geocode'
  : '/api/yandex/geocode';

/**
 * Подсказки адресов и организаций (Geosuggest).
 * @param {string} text
 * @param {{ lat: number, lon: number }} bias — центр поиска (город)
 */
export async function fetchYandexSuggest(text, { lat, lon }, signal) {
  const apikey = getYandexApiKey();
  if (!apikey) {
    throw new Error('NO_API_KEY');
  }

  const query = text.trim();
  if (query.length < 2) return [];

  const params = new URLSearchParams({
    text: query,
    lang: 'ru_RU',
    results: '8',
    print_address: '1',
    attrs: 'uri',
    types: 'biz,street,house,metro',
    ll: `${lon},${lat}`,
    spn: '0.45,0.35',
  });

  if (import.meta.env.DEV) {
    params.set('apikey', apikey);
  }

  const res = await fetch(`${SUGGEST_PATH}?${params}`, { signal });
  if (!res.ok) {
    const err = new Error(`Suggest HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return (data.results || []).map((item, index) => ({
    id: item.uri || `${item.title?.text || 'item'}-${index}`,
    title: item.title?.text || '',
    subtitle:
      item.subtitle?.text ||
      item.address?.formatted_address ||
      '',
    uri: item.uri || null,
    formattedAddress: item.address?.formatted_address || null,
  }));
}

/**
 * Координаты по uri из подсказки (HTTP Геокодер).
 */
export async function resolveYandexSuggestItem(item, signal) {
  const apikey = getYandexApiKey();
  if (!apikey) throw new Error('NO_API_KEY');

  const params = new URLSearchParams({
    format: 'json',
    lang: 'ru_RU',
    results: '1',
  });

  if (import.meta.env.DEV) {
    params.set('apikey', apikey);
  }

  if (item.uri) {
    params.set('uri', item.uri);
  } else {
    const q = item.formattedAddress || item.title;
    if (!q) throw new Error('EMPTY_QUERY');
    params.set('geocode', q);
  }

  const res = await fetch(`${GEOCODE_PATH}?${params}`, { signal });
  if (!res.ok) {
    const err = new Error(`Geocode HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const geo =
    data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
  if (!geo?.Point?.pos) {
    throw new Error('GEOCODE_NOT_FOUND');
  }

  const [lon, lat] = geo.Point.pos.split(/\s+/).map(Number);
  const meta = geo.metaDataProperty?.GeocoderMetaData;

  return {
    name: geo.name || item.title,
    address:
      meta?.Address?.formatted ||
      meta?.text ||
      item.formattedAddress ||
      item.subtitle ||
      item.title,
    coords: [lat, lon],
  };
}
