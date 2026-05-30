/**
 * Трендовые образы для свиданий (2025–2026).
 */

import { mapTimeToCategory } from '../utils/time';

export const LOOK_TRENDS = [
  {
    id: 'quiet-luxury',
    name: 'Quiet Luxury',
    tagline: 'Тихая роскошь — главный тренд 2026',
    emoji: '🤍',
    accent: '#c9a96e',
    vibes: ['cozy', 'cultural'],
    weather: ['sunny', 'cloudy', 'rainy'],
    times: ['afternoon', 'evening', 'night'],
    male: ['Брюки с идеальной посадкой, без логотипов — шерсть, креп, тонкий хлопок. Тёмно-синий, графит, бежевый', 'Рубашка или тонкий свитер нейтрального тона — белый, серый, кремовый. Кашемир или тонкая шерсть', 'Лоферы или минималистичные кеды — кожа без блеска, тонкая подошва. Носки — тонкие, в тон брюк'],
    female: ['Slip-платье или юбка-миди из атласа/шёлка — мягкий силуэт, без деталей. Шампань, пыльная роза, тёмно-синий', 'Кашемировый кардиган или тренч — длина до бедра, тонкий кашемир. Можно набросить на плечи', 'Балетки или kitten heels — кожа, острые носки. Nude, чёрный или в тон платья'],
    hashtags: ['#quietluxury', '#oldmoney'],
  },
  {
    id: 'slip-and-leather',
    name: 'Slip + кожа',
    tagline: 'Романтика с характером — хит весны 2026',
    emoji: '🖤',
    accent: '#e8836a',
    vibes: ['cozy', 'adventure'],
    weather: ['sunny', 'cloudy'],
    times: ['evening', 'night'],
    male: ['Тёмные джинсы — прямые, без потёртостей', 'Чёрная рубашка или водолазка — тонкий хлопок, без принтов', 'Кожаные кеды или челси — матовая кожа, без декора'],
    female: ['Slip-платье из сатина/шёлка — до колена или миди, тонкие бретели. Чёрный, бордовый, изумрудный', 'Кожаная куртка или жакет — классическая мото. Можно набросить на плечи для контраста', 'Плоские туфли с заострённым носом — лодочки или мюли. Чёрный, nude'],
    hashtags: ['#slipdress', '#datenight'],
  },
  {
    id: 'denim-silk',
    name: 'Denim × Silk',
    tagline: 'Винтажный деним + лёгкий шёлк',
    emoji: '👖',
    accent: '#7ec8a0',
    vibes: ['cozy', 'cultural', 'adventure'],
    weather: ['sunny', 'cloudy'],
    times: ['morning', 'afternoon', 'evening'],
    male: ['Relaxed-fit джинсы — светлый или винтажный wash, прямые. Лёгкий винтаж приветствуется', 'Шёлковая рубашка навыпуск — тонкий шёлк, можно с принтом или однотонная', 'Балетки или лоферы — кожа или замша. Коричневый, бежевый'],
    female: ['High-rise джинсы relaxed — прямые, средней длины. Светлый или винтажный wash', 'Асимметричный шёлковый топ — интересный крой, пастельный или яркий акцент', 'Скульптурные балетки — кожа или замша, заострённый мыс. Nude, белый или акцент'],
    hashtags: ['#denimlook', '#effortless'],
  },
  {
    id: 'monochrome-set',
    name: 'Монохромный сет',
    tagline: 'Готовый лук за 30 секунд',
    emoji: '🫧',
    accent: '#9b7ec8',
    vibes: ['cozy', 'cultural', 'active'],
    weather: ['sunny', 'cloudy', 'rainy'],
    times: ['afternoon', 'evening'],
    male: ['Костюмный сет или matching knit — серый, бежевый, тёмно-синий. Тонкая шерсть, трикотаж', 'Белые кеды или лоферы — чистые, минималистичные', 'Минимум аксессуаров — только часы, тонкий браслет'],
    female: ['Органза или трикотаж: топ + юбка в одном тоне — разная текстура, один цвет. Юбка миди', 'Маленькая сумка-структура — жёсткая форма, без длинного ремня', 'Балетки или мюли — кожа, плоская подошва. В тон сета или nude'],
    hashtags: ['#matchingset', '#monochrome'],
  },
  {
    id: 'romantic-midi',
    name: 'Romantic Midi',
    tagline: 'Мягкая романтика без перегруза',
    emoji: '🌸',
    accent: '#e8a0b4',
    vibes: ['cozy', 'cultural'],
    weather: ['sunny', 'cloudy', 'rainy'],
    times: ['afternoon', 'evening', 'night'],
    male: ['Чиносы — бежевые, песочные, тёмно-синие. Прямой крой, без блеска', 'Рубашка пастельного тона — лавандовый, мятный, кремовый. Тонкий хлопок или лён', 'Дерби или лоферы — кожа, тонкая подошва. Коричневый, коньячный'],
    female: ['Wrap-платье миди — на завязках или с поясом. Мелкий цветочный принт или однотонное. Шифон, креп', 'Лёгкая накидка — пашмина, тонкий шарф или кардиган. В тон платья или контрастный', 'Каблук 5–7 см или балетки — лодочки или с интересным мыском. Nude, пудровый'],
    hashtags: ['#mididress', '#romantic'],
  },
  {
    id: 'sport-chic',
    name: 'Sport Chic',
    tagline: 'Чистый спорт без «тренажёрки»',
    emoji: '⚡',
    accent: '#7ec8a0',
    vibes: ['active'],
    weather: ['sunny', 'cloudy', 'rainy'],
    times: ['morning', 'afternoon', 'evening'],
    male: ['Тёмные joggers premium — плотный трикотаж, без нашивок. Прямой или зауженный', 'Поло или облегающий лонгслив — тонкое пике, однотонное', 'Чистые белые кроссовки — без потёртостей. Nike Air Force, Adidas Stan Smith'],
    female: ['Леггинсы + укороченный свитшот — чёрные, плотные. Свитшот до талии из плотного хлопка', 'Ветровка cropped — до талии. Чёрный, белый или яркий акцент. Техническая ткань', 'Кроссовки в тон — белые. Nike Dunk, New Balance 550'],
    hashtags: ['#sportchic', '#athleisure'],
  },
  {
    id: 'art-cultural-merch',
    name: 'Band Merch',
    tagline: 'Мерч любимой группы — просто и по делу',
    emoji: '🤘',
    accent: '#8b0000',
    vibes: ['cultural', 'cozy', 'adventure'],
    weather: ['sunny', 'cloudy', 'rainy', 'snowy'],
    times: ['morning', 'afternoon', 'evening'],
    male: ['Футболка или худи с логотипом бренда — чёрный, плотный хлопок', 'Тёмные джинсы или чиносы — без потёртостей', 'Чистые кеды или ботинки — минимализм'],
    female: ['Футболка или худи оверсайз — чёрный', 'Джинсы relaxed или юбка-миди — тёмные тона', 'Кеды или ботинки — на плоской подошве'],
    hashtags: ['#bandmerch', '#metalmerch'],
  },
  {
    id: 'gallery-smart',
    name: 'Dark Metal',
    tagline: 'Тёмный стиль для вечернего выхода',
    emoji: '🖤',
    accent: '#2a2a2a',
    vibes: ['cultural'],
    weather: ['sunny', 'cloudy', 'rainy', 'snowy'],
    times: ['morning', 'afternoon', 'evening'],
    male: ['Тёмные брюки — чёрные, прямые. Шерсть или креп', 'Чёрная рубашка или водолазка — минимализм', 'Лоферы или ботинки — чёрные, кожаные'],
    female: ['Чёрное платье или юбка + топ — атлас или креп', 'Кожаная куртка или жакет — контраст с нежностью', 'Ботинки на каблуке или балетки — чёрные'],
    hashtags: ['#darkmetal', '#blackstyle'],
  },
  {
    id: 'urban-night',
    name: 'Urban Night',
    tagline: 'Городской вечер и крыши',
    emoji: '🌃',
    accent: '#6a8fc9',
    vibes: ['adventure', 'cozy'],
    weather: ['sunny', 'cloudy', 'rainy'],
    times: ['evening', 'night'],
    male: ['Чёрные джинсы — без потёртостей, прямые. Плотный деним', 'Свитшот + бомбер — тёмные тона, кожа или ткань', 'Кожаные кеды — чёрные, минималистичные'],
    female: ['Кожаные брюки или тёмные джинсы — прямые, средняя посадка', 'Боди + объёмный жакет — оверсайз, шерсть или техника. До бедра', 'Ботинки на тракторной подошве — чёрные, до щиколотки'],
    hashtags: ['#urbannight', '#streetstyle'],
  },
  {
    id: 'winter-cocoon',
    name: 'Winter Cocoon',
    tagline: 'Уютные слои для холода',
    emoji: '❄️',
    accent: '#a8c4e8',
    vibes: ['cozy', 'cultural', 'active', 'adventure'],
    weather: ['snowy', 'rainy', 'cloudy'],
    times: ['morning', 'afternoon', 'evening', 'night'],
    male: ['Водолазка + шерстяное пальто — тонкая шерсть или кашемир. Прямой крой, до бедра', 'Утеплённые брюки — тёмные, шерсть или смесь. Прямые', 'Зимние ботинки — кожаные, утеплённые, толстая подошва'],
    female: ['Платье + колготки 80–100 den — тёплый трикотаж или шерсть, миди', 'Пуховое пальто или кокон — объёмное, до бедра. Чёрный, серый, бежевый', 'Сапоги на низком каблуке — кожаные, утеплённые. До колена'],
    hashtags: ['#winterlayers', '#cozydate'],
  },
  {
    id: 'reformation-silk',
    name: 'Bias-cut Silk',
    tagline: 'Вечер в потоке ткани',
    emoji: '✨',
    accent: '#c9a96e',
    vibes: ['cozy', 'cultural'],
    weather: ['sunny', 'cloudy'],
    times: ['evening', 'night'],
    male: ['Брюки из крепа или сатина — тёмные, лёгкий блеск. Прямые, без ремня', 'Рубашка с открытым воротом — тонкий хлопок, белая. Без галстука', 'Лоферы без носка — кожа, тонкая подошва. Чёрный или тёмно-коричневый'],
    female: ['Платье bias-cut из шёлка/сатина — крой по косой, обтекает фигуру. Миди или до пола. Шампань, чёрный, бордовый', 'Лёгкий дастер — прозрачная ткань или тонкий шёлк. Можно набросить на плечи', 'Босоножки на тонком каблуке — ремешки, открытый нос. 7–10 см. Nude, золотой'],
    hashtags: ['#biascut', '#eveninglook'],
  },
  {
    id: 'Javascriptiz',
    name: 'Founder Casual',
    tagline: 'В чём есть — в том и красавчик',
    emoji: '💻',
    accent: '#1a5c3a',
    vibes: ['cultural', 'adventure', 'cozy'],
    weather: ['sunny', 'cloudy', 'rainy', 'snowy'],
    times: ['morning', 'afternoon', 'evening', 'night'],
    male: ['Мерч от партнёров — Yandex, X5, Сбер. Главное — носить с уверенностью', 'Удобные брюки или джинсы — что надел утром, в том и победил', 'Кеды или кроссовки — главное чтобы ноги не уставали на нетворкинге'],
    female: ['Комфортный аутфит — практичность прежде всего', 'Брендированный мерч или любимые вещи', 'Удобная обувь — весь день на ногах'],
    hashtags: ['#founderstyle', '#techlife', '#корпоративноепрекрасное'],
  },
];

export function getLookById(id) {
  return LOOK_TRENDS.find((l) => l.id === id) ?? null;
}

/** Образы, подходящие под вайб, погоду и время */
export function getMatchingTrendLooks({ vibe, weather, timeOfDay }, limit = 6) {
  const v = vibe || 'cozy';
  const w = weather || 'sunny';
  const t = mapTimeToCategory(timeOfDay);

  const scored = LOOK_TRENDS.map((look) => {
    let score = 0;
    if (look.vibes.includes(v)) score += 3;
    if (look.weather.includes(w)) score += 2;
    if (look.times.includes(t)) score += 2;
    return { look, score };
  })
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score);

  const picked = scored.map(({ look }) => look);
  if (picked.length >= limit) return picked.slice(0, limit);

  const rest = LOOK_TRENDS.filter((l) => !picked.includes(l));
  return [...picked, ...rest].slice(0, limit);
}
