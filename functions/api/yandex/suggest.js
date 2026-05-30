export async function onRequestGet(context) {
  const { request, env } = context;
  const apikey = env.VITE_YANDEX_MAPS_API_KEY;
  if (!apikey) {
    return new Response(JSON.stringify({ error: 'NO_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const params = new URLSearchParams(url.searchParams);
  params.set('apikey', apikey);

  const upstream = `https://suggest-maps.yandex.ru/v1/suggest?${params}`;

  const res = await fetch(upstream, {
    headers: {
      'Accept': 'application/json',
      'Referer': 'https://datearc.maximkuznetsov612.workers.dev/',
    },
  });

  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
