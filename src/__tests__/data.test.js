import { describe, it, expect } from 'vitest';
import { DRESSCODES } from '../data/dresscodes';
import { LOOK_TRENDS, getLookById, getMatchingTrendLooks } from '../data/lookTrends';
import { VIBES } from '../data/vibes';

// ─── Проверка целостности данных ─────────────────────
describe('Целостность данных — dresscodes', () => {
  const vibes = ['cozy', 'active', 'cultural', 'adventure'];
  const weathers = ['sunny', 'rainy', 'snowy', 'cloudy'];
  const times = ['morning', 'afternoon', 'evening', 'night'];

  it.each(vibes)('вайб "%s" существует в DRESSCODES', (vibe) => {
    expect(DRESSCODES[vibe]).toBeDefined();
  });

  it.each(vibes.flatMap(v => weathers.map(w => [v, w])))(
    'вайб %s + погода %s имеет все времена',
    (vibe, weather) => {
      const entry = DRESSCODES[vibe]?.[weather];
      expect(entry).toBeDefined();
      times.forEach(t => {
        expect(entry[t]).toBeDefined();
        expect(entry[t].style).toBeTruthy();
        expect(entry[t].male.length).toBeGreaterThan(0);
        expect(entry[t].female.length).toBeGreaterThan(0);
      });
    }
  );
});

describe('Целостность данных — lookTrends', () => {
  it('все образы имеют обязательные поля', () => {
    LOOK_TRENDS.forEach(look => {
      expect(look.id).toBeTruthy();
      expect(look.name).toBeTruthy();
      expect(look.tagline).toBeTruthy();
      expect(look.vibes.length).toBeGreaterThan(0);
      expect(look.male.length).toBeGreaterThan(0);
      expect(look.female.length).toBeGreaterThan(0);
    });
  });

  it('getLookById возвращает существующий образ', () => {
    expect(getLookById('quiet-luxury')).not.toBeNull();
    expect(getLookById('nonexistent')).toBeNull();
  });

  it('getMatchingTrendLooks возвращает массив', () => {
    const result = getMatchingTrendLooks({ vibe: 'cozy', weather: 'sunny', timeOfDay: '19:00' });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('getMatchingTrendLooks работает с пустыми параметрами', () => {
    const result = getMatchingTrendLooks({ vibe: null, weather: null, timeOfDay: null });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('Целостность данных — vibes', () => {
  it('все вайбы имеют обязательные поля', () => {
    VIBES.forEach(vibe => {
      expect(vibe.id).toBeTruthy();
      expect(vibe.label).toBeTruthy();
      expect(vibe.emoji).toBeTruthy();
    });
  });

  it('уникальные ID', () => {
    const ids = VIBES.map(v => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── Поиск багов ─────────────────────────────────────
describe('Баг-хантинг — данные', () => {
  it('нет дублирующихся ID образов', () => {
    const ids = LOOK_TRENDS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('все times в lookTrends — валидные категории', () => {
    const validTimes = ['morning', 'afternoon', 'evening', 'night'];
    LOOK_TRENDS.forEach(look => {
      look.times.forEach(t => {
        expect(validTimes).toContain(t);
      });
    });
  });

  it('все vibes в lookTrends — валидные', () => {
    const validVibes = ['cozy', 'active', 'cultural', 'adventure'];
    LOOK_TRENDS.forEach(look => {
      look.vibes.forEach(v => {
        expect(validVibes).toContain(v);
      });
    });
  });

  it('все weather в lookTrends — валидные', () => {
    const validWeather = ['sunny', 'cloudy', 'rainy', 'snowy'];
    LOOK_TRENDS.forEach(look => {
      look.weather.forEach(w => {
        expect(validWeather).toContain(w);
      });
    });
  });
});
