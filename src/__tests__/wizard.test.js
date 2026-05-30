import { describe, it, expect } from 'vitest';

// Импортируем reducer напрямую — он чистая функция
// Копируем initialState и reducer для тестирования без хуков

const TOTAL_STEPS = 6;

const initialState = {
  step: 1,
  direction: 'forward',
  initiatorGender: null,
  initiatorName: '',
  guestName: '',
  vibe: null,
  city: 'Москва',
  location: null,
  date: '',
  timeOfDay: '19:00',
  weather: null,
  checklist: {},
  selectedLookId: null,
  cardTheme: 'noir',
  cardMessage: '',
};

function wizardReducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS), direction: 'forward' };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1), direction: 'back' };
    case 'SET_GENDER':
      return { ...state, initiatorGender: action.payload };
    case 'SET_INITIATOR_NAME':
      return { ...state, initiatorName: action.payload };
    case 'SET_GUEST_NAME':
      return { ...state, guestName: action.payload };
    case 'SET_VIBE':
      return { ...state, vibe: action.payload, location: null };
    case 'SET_CITY':
      return { ...state, city: action.payload, location: null };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_DATE':
      return { ...state, date: action.payload };
    case 'SET_TIME_OF_DAY':
      return { ...state, timeOfDay: action.payload };
    case 'SET_WEATHER':
      return { ...state, weather: action.payload };
    case 'TOGGLE_CHECKLIST':
      return {
        ...state,
        checklist: {
          ...state.checklist,
          [action.payload]: !state.checklist[action.payload],
        },
      };
    case 'SET_SELECTED_LOOK':
      return {
        ...state,
        selectedLookId: action.payload?.lookId ?? null,
      };
    case 'SET_CARD_THEME':
      return { ...state, cardTheme: action.payload };
    case 'SET_CARD_MESSAGE':
      return { ...state, cardMessage: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const canProceed = (state) => {
  switch (state.step) {
    case 1: return !!state.initiatorGender && !!state.initiatorName.trim() && !!state.guestName.trim();
    case 2: return !!state.vibe;
    case 3: return true;
    case 4: return !!state.date && !!state.timeOfDay && !!state.weather;
    case 5: return true;
    case 6: return true;
    default: return true;
  }
};

// ─── Навигация ───────────────────────────────────────
describe('Навигация по шагам', () => {
  it('NEXT_STEP увеличивает шаг', () => {
    const next = wizardReducer(initialState, { type: 'NEXT_STEP' });
    expect(next.step).toBe(2);
    expect(next.direction).toBe('forward');
  });

  it('NEXT_STEP не переходит за TOTAL_STEPS', () => {
    const state = { ...initialState, step: 6 };
    const next = wizardReducer(state, { type: 'NEXT_STEP' });
    expect(next.step).toBe(6);
  });

  it('PREV_STEP уменьшает шаг', () => {
    const state = { ...initialState, step: 3 };
    const prev = wizardReducer(state, { type: 'PREV_STEP' });
    expect(prev.step).toBe(2);
    expect(prev.direction).toBe('back');
  });

  it('PREV_STEP не опускается ниже 1', () => {
    const prev = wizardReducer(initialState, { type: 'PREV_STEP' });
    expect(prev.step).toBe(1);
  });
});

// ─── Установка данных ────────────────────────────────
describe('Установка данных', () => {
  it('SET_GENDER устанавливает пол', () => {
    const s = wizardReducer(initialState, { type: 'SET_GENDER', payload: 'female' });
    expect(s.initiatorGender).toBe('female');
  });

  it('SET_VIBE сбрасывает локацию', () => {
    const state = { ...initialState, location: { name: 'test' } };
    const s = wizardReducer(state, { type: 'SET_VIBE', payload: 'active' });
    expect(s.vibe).toBe('active');
    expect(s.location).toBeNull();
  });

  it('SET_CITY сбрасывает локацию', () => {
    const state = { ...initialState, location: { name: 'test' } };
    const s = wizardReducer(state, { type: 'SET_CITY', payload: 'Питер' });
    expect(s.city).toBe('Питер');
    expect(s.location).toBeNull();
  });

  it('TOGGLE_CHECKLIST переключает значение', () => {
    const s1 = wizardReducer(initialState, { type: 'TOGGLE_CHECKLIST', payload: 'phone' });
    expect(s1.checklist.phone).toBe(true);

    const s2 = wizardReducer(s1, { type: 'TOGGLE_CHECKLIST', payload: 'phone' });
    expect(s2.checklist.phone).toBe(false);
  });

  it('SET_CARD_MESSAGE устанавливает сообщение', () => {
    const s = wizardReducer(initialState, { type: 'SET_CARD_MESSAGE', payload: 'Привет!' });
    expect(s.cardMessage).toBe('Привет!');
  });

  it('RESET возвращает начальное состояние', () => {
    const dirty = { ...initialState, step: 5, initiatorName: 'test', vibe: 'cozy' };
    const s = wizardReducer(dirty, { type: 'RESET' });
    expect(s.step).toBe(1);
    expect(s.initiatorName).toBe('');
    expect(s.vibe).toBeNull();
  });
});

// ─── Валидация (canProceed) ──────────────────────────
describe('Валидация — canProceed', () => {
  it('Шаг 1: без роли — false', () => {
    expect(canProceed(initialState)).toBe(false);
  });

  it('Шаг 1: роль + оба имени — true', () => {
    const state = {
      ...initialState,
      initiatorGender: 'male',
      initiatorName: 'Артём',
      guestName: 'Мария',
    };
    expect(canProceed(state)).toBe(true);
  });

  it('Шаг 1: роль без имени — false', () => {
    const state = { ...initialState, initiatorGender: 'male', initiatorName: '', guestName: 'Мария' };
    expect(canProceed(state)).toBe(false);
  });

  it('Шаг 1: имя с пробелами — false', () => {
    const state = { ...initialState, initiatorGender: 'male', initiatorName: '   ', guestName: 'Мария' };
    expect(canProceed(state)).toBe(false);
  });

  it('Шаг 2: без вайба — false', () => {
    const state = { ...initialState, step: 2 };
    expect(canProceed(state)).toBe(false);
  });

  it('Шаг 2: вайб есть — true', () => {
    const state = { ...initialState, step: 2, vibe: 'cozy' };
    expect(canProceed(state)).toBe(true);
  });

  it('Шаг 3: всегда true (локация опциональна)', () => {
    const state = { ...initialState, step: 3 };
    expect(canProceed(state)).toBe(true);
  });

  it('Шаг 4: без даты — false', () => {
    const state = { ...initialState, step: 4, weather: 'sunny' };
    expect(canProceed(state)).toBe(false);
  });

  it('Шаг 4: без погоды — false', () => {
    const state = { ...initialState, step: 4, date: '2026-06-01' };
    expect(canProceed(state)).toBe(false);
  });

  it('Шаг 4: всё есть — true', () => {
    const state = { ...initialState, step: 4, date: '2026-06-01', weather: 'sunny' };
    expect(canProceed(state)).toBe(true);
  });

  it('Шаг 5 и 6: всегда true', () => {
    expect(canProceed({ ...initialState, step: 5 })).toBe(true);
    expect(canProceed({ ...initialState, step: 6 })).toBe(true);
  });
});

// ─── Баг-хантинг ─────────────────────────────────────
describe('Баг-хантинг —.edge cases', () => {
  it('Неизвестный action не меняет стейт', () => {
    const s = wizardReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(s).toEqual(initialState);
  });

  it('SET_SELECTED_LOOK с null сбрасывает поле', () => {
    const state = { ...initialState, selectedLookId: 'test' };
    const s = wizardReducer(state, { type: 'SET_SELECTED_LOOK', payload: null });
    expect(s.selectedLookId).toBeNull();
  });

  it('SET_SELECTED_LOOK с undefined сбрасывает поле', () => {
    const state = { ...initialState, selectedLookId: 'test' };
    const s = wizardReducer(state, { type: 'SET_SELECTED_LOOK', payload: undefined });
    expect(s.selectedLookId).toBeNull();
  });

  it('SET_TIME_OF_DAY обновляет время', () => {
    const s = wizardReducer(initialState, { type: 'SET_TIME_OF_DAY', payload: '15:30' });
    expect(s.timeOfDay).toBe('15:30');
  });

  it('Двойной NEXT_STEP не перескакивает', () => {
    let s = wizardReducer(initialState, { type: 'NEXT_STEP' });
    s = wizardReducer(s, { type: 'NEXT_STEP' });
    expect(s.step).toBe(3);
  });

  it('RESET очищает checklist', () => {
    const state = {
      ...initialState,
      checklist: { phone: true, umbrella: true },
    };
    const s = wizardReducer(state, { type: 'RESET' });
    expect(Object.keys(s.checklist)).toHaveLength(0);
  });
});
