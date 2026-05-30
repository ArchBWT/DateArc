/**
 * Кодирует данные приглашения в URL-хеш для шаринга.
 * Декодирует обратно при открытии ссылки.
 */

const INVITE_VERSION = 1;

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
  const encoded = btoa(unescape(encodeURIComponent(json)));
  return `${window.location.origin}${window.location.pathname}#invite=${encoded}`;
}

export function decodeInvite(hash) {
  try {
    if (!hash || !hash.startsWith('#invite=')) return null;
    const encoded = hash.slice('#invite='.length);
    const json = decodeURIComponent(escape(atob(encoded)));
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
