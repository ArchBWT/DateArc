import { getLookById } from './lookTrends';

/**
 * Рекламные подборки образов.
 * Включение: VITE_LOOK_ADS_ENABLED=true в .env
 *
 * Каждая запись привязана к lookId из lookTrends.js — при клике «Применить»
 * подставляются советы этого образа; кнопка CTA ведёт на ссылку партнёра.
 *
 * Пример рекламодателя: ad-artmolodost → https://artmolodost.shop/
 *
 * logoUrl — путь в public/ (например /sponsors/brand.svg) или полный URL.
 * logoAlt — подпись для доступности.
 */
export const SPONSORED_LOOKS = [
  {
    id: 'ad-founder-vibe',
    sponsor: 'TalArc',
    logoUrl: 'https://i.ibb.co/pBxdrs2c/Chat-GPT-Image-30-2026-12-05-17-1.png',
    logoAlt: 'TalArc — Javascriptiz',
    lookId: 'Javascriptiz',
    title: 'По кайфу',
    description:
      'Мой аутфит - это эксклюзивный дроп от Яндекса, Сбера и X5. Чистый IT-кутюр, спонсируемый алгоритмами и капитализацией.',
    cta: 'Прикольный тип',
    url: 'https://t.me/b2why',
    imageGradient: 'linear-gradient(135deg, #1a0505 0%, #3d0d0d 30%, #7c1a1a 55%, #4a1010 80%, #2a0505 100%)',
    vibes: ['cultural', 'adventure'],
    gender: 'male',
    weather: null,
    times: null,
    active: true,
  },
  {
    id: 'ad-artmolodost',
    sponsor: 'Арт.Молодость',
    logoUrl: '/sponsors/art-molodost.svg',
    logoAlt: 'Арт.Молодость',
    lookId: 'art-cultural-merch',
    title: 'Одежда с культурным кодом',
    description:
      'Худи, футболки и свитеры от арт-кластера «Таврида». Промокод АМ10 — скидка 10%',
    cta: 'На artmolodost.shop',
    url: 'https://artmolodost.shop/?utm_source=datesite&utm_medium=look_ad&utm_campaign=art_molodost',
    imageGradient: 'linear-gradient(135deg, #1a1828 0%, #5c4a8a 45%, #2a4a62 100%)',
    vibes: ['cultural', 'cozy', 'adventure'],
    weather: null,
    times: null,
    active: true,
  },
  {
    id: 'ad-lamoda-quiet',
    sponsor: 'LAMODA',
    logoUrl: '/sponsors/lamoda.svg',
    logoAlt: 'Lamoda',
    lookId: 'quiet-luxury',
    title: 'Подборка Quiet Luxury',
    description: 'Нейтральные тона, идеальная посадка — готовый лук на вечер',
    cta: 'Собрать на Lamoda',
    url: 'https://www.lamoda.ru/?utm_source=datesite&utm_medium=look_ad&utm_campaign=quiet_luxury',
    imageGradient: 'linear-gradient(135deg, #2a2a32 0%, #4a4035 100%)',
    vibes: ['cozy', 'cultural'],
    weather: null,
    times: ['evening', 'night'],
    active: true,
  },
  {
    id: 'ad-sport-sportchic',
    sponsor: 'Sportmaster',
    logoUrl: '/sponsors/sportmaster.svg',
    logoAlt: 'Sportmaster',
    lookId: 'sport-chic',
    title: 'Sport Chic на свидание',
    description: 'Премиум спорт без ощущения зала',
    cta: 'В каталог',
    url: 'https://www.sportmaster.ru/?utm_source=datesite&utm_medium=look_ad&utm_campaign=sport_chic',
    imageGradient: 'linear-gradient(135deg, #1a2420 0%, #2d4a3e 100%)',
    vibes: ['active'],
    weather: null,
    times: null,
    active: true,
  },
  {
    id: 'ad-firstblood-gallery',
    sponsor: 'First Blood',
    logoUrl: '/sponsors/firstblood.png',
    logoAlt: 'First Blood Store',
    lookId: 'gallery-smart',
    title: 'Тёмная элегантность',
    description:
      'Офицальный мерч Slaughter To Prevail и других банд. Худи, футболки, аксессуары — собери образ в духе modern deathcore',
    cta: 'Firstblood.store',
    url: 'https://firstblood.store/en-de/collections/all?utm_source=datesite&utm_medium=look_ad&utm_campaign=firstblood_gallery',
    imageGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 40%, #2d0a3e 70%, #0a0a1a 100%)',
    vibes: ['cultural', 'adventure'],
    weather: null,
    times: null,
    active: true,
  },
];

export function isLookAdsEnabled() {
  return import.meta.env.VITE_LOOK_ADS_ENABLED === 'true';
}

function matchesTargeting(ad, { vibe, weather, timeOfDay, gender }) {
  if (!ad.active) return false;
  if (ad.vibes && !ad.vibes.includes(vibe)) return false;
  if (ad.weather && weather && !ad.weather.includes(weather)) return false;
  if (ad.times && timeOfDay && !ad.times.includes(timeOfDay)) return false;
  if (ad.gender && gender && ad.gender !== gender) return false;
  return true;
}

/** Активная реклама с привязанным образом.
 * Если пользователь — мужчина, TalArc ('ad-founder-vibe') всегда идёт первым
 * и показывается независимо от выбранного вайба/погоды/времени. */
export function getSponsoredLooksForContext(context) {
  if (!isLookAdsEnabled()) return [];

  const matched = SPONSORED_LOOKS.filter((ad) => matchesTargeting(ad, context))
    .map((ad) => ({
      ...ad,
      look: getLookById(ad.lookId),
    }))
    .filter((ad) => ad.look);

  if (context.gender === 'male') {
    // TalArc показывается всегда при мужском поле — не зависит от vibes/weather/times
    const alreadyIn = matched.some((ad) => ad.id === 'ad-founder-vibe');
    if (!alreadyIn) {
      const talarc = SPONSORED_LOOKS.find((ad) => ad.id === 'ad-founder-vibe');
      if (talarc && talarc.active) {
        const look = getLookById(talarc.lookId);
        if (look) matched.unshift({ ...talarc, look });
      }
    } else {
      // Если уже есть — поднять на первое место
      const idx = matched.findIndex((ad) => ad.id === 'ad-founder-vibe');
      if (idx > 0) {
        const [talarc] = matched.splice(idx, 1);
        matched.unshift(talarc);
      }
    }
  }

  return matched;
}
