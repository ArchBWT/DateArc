import { describe, it, expect } from 'vitest';
import { mapTimeToCategory } from '../utils/time';

describe('mapTimeToCategory — A/B тест маппинга времени', () => {

  // ─── Группа A: Утро (07:00–11:59) ─────────────────
  describe('A: Утро', () => {
    it.each([
      ['07:00', 'morning'],
      ['08:00', 'morning'],
      ['09:30', 'morning'],
      ['11:59', 'morning'],
    ])('время %s → %s', (input, expected) => {
      expect(mapTimeToCategory(input)).toBe(expected);
    });
  });

  // ─── Группа B: День (12:00–16:59) ─────────────────
  describe('B: День', () => {
    it.each([
      ['12:00', 'afternoon'],
      ['13:15', 'afternoon'],
      ['15:45', 'afternoon'],
      ['16:59', 'afternoon'],
    ])('время %s → %s', (input, expected) => {
      expect(mapTimeToCategory(input)).toBe(expected);
    });
  });

  // ─── Группа C: Вечер (17:00–21:59) ────────────────
  describe('C: Вечер', () => {
    it.each([
      ['17:00', 'evening'],
      ['19:00', 'evening'],
      ['20:30', 'evening'],
      ['21:59', 'evening'],
    ])('время %s → %s', (input, expected) => {
      expect(mapTimeToCategory(input)).toBe(expected);
    });
  });

  // ─── Группа D: Ночь (22:00–06:59) ─────────────────
  describe('D: Ночь', () => {
    it.each([
      ['22:00', 'night'],
      ['23:00', 'night'],
      ['00:00', 'night'],
      ['03:45', 'night'],
      ['06:59', 'night'],
    ])('время %s → %s', (input, expected) => {
      expect(mapTimeToCategory(input)).toBe(expected);
    });
  });

  // ─── Граничные случаи ──────────────────────────────
  describe('Граничные случаи', () => {
    it('null → evening (дефолт)', () => {
      expect(mapTimeToCategory(null)).toBe('evening');
    });

    it('пустая строка → evening (дефолт)', () => {
      expect(mapTimeToCategory('')).toBe('evening');
    });
  });
});
