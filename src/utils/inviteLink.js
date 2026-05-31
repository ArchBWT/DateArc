/**
 * Кодирует данные приглашения в URL-хеш для шаринга.
 * Использует TextEncoder для корректной работы с Unicode (кириллица).
 * Base64url — без символов +/=//, безопасен в URL без экранирования.
 */

const INVITE_VERSION = 1;

function toBase64Url(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  return atob(pad ? padded + '='.repeat(4 - pad) : padded);
}

function encodeUnicode(str) {
  const bytes = new TextEncoder().encode(str);
  return String.fromCharCode(...bytes);
}

function decodeUnicode(str) {
  const bytes = Uint8Array.from(str, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeInvite(state) {
  const data = {
    _v: INVITE_VERSION,
    i: state.initiatorName,
    g: state.guestName,
    d: state.date,
    t: state.timeOfDay,
    w: state.weather,
    vb: state.vibe,
    l: state.location ? { n: state.location.name, a: state.location.address } : null,
    th: state.cardTheme,
    m: state.cardMessage || '',
    sk: state.selectedLookId || null,
  };
  const json = JSON.stringify(data);
  const encoded = toBase64Url(encodeUnicode(json));
  return `${window.location.origin}${window.location.pathname}#invite=${encoded}`;
}

export function decodeInvite(hash) {
  try {
    if (!hash || !hash.startsWith('#invite=')) return null;
    const encoded = hash.slice('#invite='.length);
    const json = decodeUnicode(fromBase64Url(encoded));
    const data = JSON.parse(json);
    if (data._v !== INVITE_VERSION) return null;
    return {
      initiatorName: data.i || '',
      guestName: data.g || '',
      date: data.d || '',
      timeOfDay: data.t || '19:00',
      weather: data.w || null,
      vibe: data.vb || null,
      location: data.l ? { name: data.l.n, address: data.l.a } : null,
      cardTheme: data.th || 'noir',
      cardMessage: data.m || '',
      selectedLookId: data.sk || null,
    };
  } catch {
    return null;
  }
}
