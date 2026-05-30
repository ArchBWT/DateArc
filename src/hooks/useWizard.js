import { useReducer, useCallback } from 'react';

const TOTAL_STEPS = 6;

const initialState = {
  step: 1,
  direction: 'forward', // 'forward' | 'back'
  initiatorGender: null,  // 'male' | 'female'
  initiatorName: '',
  guestName: '',
  vibe: null,             // 'cozy' | 'active' | 'cultural' | 'adventure'
  city: 'Москва',
  location: null,         // { name, address, coords }
  date: '',               // 'YYYY-MM-DD'
  timeOfDay: '19:00',       // 'HH:MM' — конкретное время встречи
  weather: null,          // 'sunny' | 'rainy' | 'snowy' | 'cloudy'
  checklist: {},          // { [itemId]: boolean }
  selectedLookId: null,
  cardTheme: 'noir',       // 'noir' | 'romantic' | 'vibrant' | 'midnight' | 'nature' | 'sunset'
  cardMessage: '',         // пользовательское сообщение на карточке
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

export function useWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);
  const setGender = useCallback((g) => dispatch({ type: 'SET_GENDER', payload: g }), []);
  const setInitiatorName = useCallback((n) => dispatch({ type: 'SET_INITIATOR_NAME', payload: n }), []);
  const setGuestName = useCallback((n) => dispatch({ type: 'SET_GUEST_NAME', payload: n }), []);
  const setVibe = useCallback((v) => dispatch({ type: 'SET_VIBE', payload: v }), []);
  const setCity = useCallback((c) => dispatch({ type: 'SET_CITY', payload: c }), []);
  const setLocation = useCallback((l) => dispatch({ type: 'SET_LOCATION', payload: l }), []);
  const setDate = useCallback((d) => dispatch({ type: 'SET_DATE', payload: d }), []);
  const setTimeOfDay = useCallback((t) => dispatch({ type: 'SET_TIME_OF_DAY', payload: t }), []);
  const setWeather = useCallback((w) => dispatch({ type: 'SET_WEATHER', payload: w }), []);
  const toggleChecklist = useCallback((id) => dispatch({ type: 'TOGGLE_CHECKLIST', payload: id }), []);
  const setSelectedLook = useCallback(
    (lookId, adId = null) =>
      dispatch({ type: 'SET_SELECTED_LOOK', payload: { lookId, adId } }),
    [],
  );
  const setCardTheme = useCallback((t) => dispatch({ type: 'SET_CARD_THEME', payload: t }), []);
  const setCardMessage = useCallback((m) => dispatch({ type: 'SET_CARD_MESSAGE', payload: m }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const canProceed = () => {
    switch (state.step) {
      case 1: return !!state.initiatorGender && !!state.initiatorName.trim() && !!state.guestName.trim();
      case 2: return !!state.vibe;
      case 3: return true; // location optional
      case 4: return !!state.date && !!state.timeOfDay && !!state.weather;
      case 5: return true;
      case 6: return true;
      default: return true;
    }
  };

  return {
    state,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    setGender,
    setInitiatorName,
    setGuestName,
    setVibe,
    setCity,
    setLocation,
    setDate,
    setTimeOfDay,
    setWeather,
    toggleChecklist,
    setSelectedLook,
    setCardTheme,
    setCardMessage,
    reset,
    canProceed,
  };
}
