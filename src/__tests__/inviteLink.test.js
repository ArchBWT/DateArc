import { describe, it, expect } from 'vitest';
import { encodeInvite, decodeInvite } from '../utils/inviteLink';

function extractHash(encodedUrl) {
  const idx = encodedUrl.indexOf('#');
  return idx >= 0 ? encodedUrl.slice(idx) : '';
}

describe('encodeInvite / decodeInvite — A/B тест кодирования', () => {
  const fullState = {
    initiatorName: 'Анна',
    guestName: 'Максим',
    date: '2026-06-15',
    timeOfDay: '19:30',
    weather: 'sunny',
    vibe: 'cozy',
    location: { name: 'Кафе Пушкинъ', address: 'ул. Тверская, 26а' },
    cardTheme: 'romantic',
    cardMessage: 'С нетерпением жду!',
    selectedLookId: 'quiet-luxury',
  };

  // ─── Группа A: Полное кодирование ─────────────────
  describe('A: Полное кодирование и декодирование', () => {
    it('кодирует и декодирует полное состояние', () => {
      const encoded = encodeInvite(fullState);
      const hash = extractHash(encoded);
      const decoded = decodeInvite(hash);

      expect(decoded).not.toBeNull();
      expect(decoded.initiatorName).toBe('Анна');
      expect(decoded.guestName).toBe('Максим');
      expect(decoded.date).toBe('2026-06-15');
      expect(decoded.timeOfDay).toBe('19:30');
      expect(decoded.weather).toBe('sunny');
      expect(decoded.vibe).toBe('cozy');
      expect(decoded.location.name).toBe('Кафе Пушкинъ');
      expect(decoded.cardTheme).toBe('romantic');
      expect(decoded.cardMessage).toBe('С нетерпением жду!');
      expect(decoded.selectedLookId).toBe('quiet-luxury');
    });
  });

  // ─── Группа B: Минимальное состояние ───────────────
  describe('B: Минимальное состояние (без опциональных)', () => {
    it('декодирует без локации и сообщения', () => {
      const minimal = {
        initiatorName: 'А',
        guestName: 'Б',
        date: '2026-07-01',
        timeOfDay: '15:00',
        weather: null,
        vibe: null,
        location: null,
        cardTheme: 'noir',
        cardMessage: '',
        selectedLookId: null,
      };

      const encoded = encodeInvite(minimal);
      const hash = extractHash(encoded);
      const decoded = decodeInvite(hash);

      expect(decoded).not.toBeNull();
      expect(decoded.location).toBeNull();
      expect(decoded.cardMessage).toBe('');
      expect(decoded.selectedLookId).toBeNull();
    });
  });

  // ─── Невалидные данные ─────────────────────────────
  describe('Невалидные входные данные', () => {
    it('null → null', () => {
      expect(decodeInvite(null)).toBeNull();
    });

    it('пустая строка → null', () => {
      expect(decodeInvite('')).toBeNull();
    });

    it('невалидный хеш → null', () => {
      expect(decodeInvite('#something=abc')).toBeNull();
    });

    it('битые данные → null', () => {
      expect(decodeInvite('#invite=!!!not-base64!!!')).toBeNull();
    });
  });

  // ─── Unicode и спецсимволы ─────────────────────────
  describe('Unicode и спецсимволы', () => {
    it('кириллица сохраняется', () => {
      const state = {
        ...fullState,
        initiatorName: 'Жанна-Мария',
        guestName: 'Александр',
        cardMessage: 'Привет! Как дела? 🌹',
      };
      const encoded = encodeInvite(state);
      const hash = extractHash(encoded);
      const decoded = decodeInvite(hash);

      expect(decoded.initiatorName).toBe('Жанна-Мария');
      expect(decoded.guestName).toBe('Александр');
      expect(decoded.cardMessage).toBe('Привет! Как дела? 🌹');
    });

    it('спецсимволы в названии места', () => {
      const state = {
        ...fullState,
        location: { name: 'Kafe "Пушкинъ"', address: 'ул. Ленина, 1' },
      };
      const encoded = encodeInvite(state);
      const hash = extractHash(encoded);
      const decoded = decodeInvite(hash);

      expect(decoded.location.name).toBe('Kafe "Пушкинъ"');
    });
  });

  // ─── Стабильность версий ───────────────────────────
  describe('Версионирование', () => {
    it('старая версия возвращает null', () => {
      const data = { v: 0, i: 'A', g: 'B', d: '', t: '19:00' };
      const encoded = btoa(JSON.stringify(data));
      expect(decodeInvite(`#invite=${encoded}`)).toBeNull();
    });

    it('отсутствие версии возвращает null', () => {
      const data = { i: 'A', g: 'B', d: '', t: '19:00' };
      const encoded = btoa(JSON.stringify(data));
      expect(decodeInvite(`#invite=${encoded}`)).toBeNull();
    });
  });
});
