import React from 'react';
import { TimeSlider } from '../components/TimeSlider';

const WEATHER_OPTIONS = [
  { id: 'sunny',  emoji: '☀️',  label: 'Солнечно' },
  { id: 'cloudy', emoji: '⛅',  label: 'Переменная' },
  { id: 'rainy',  emoji: '🌧️',  label: 'Дождливо' },
  { id: 'snowy',  emoji: '❄️',  label: 'Снежно' },
];

export function Step4DateTime({ state, setDate, setTimeOfDay, setWeather }) {
  // Today's date in YYYY-MM-DD (local timezone)
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const formatDisplayDate = (d) => {
    if (!d) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(d + 'T00:00:00');
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() === today.getTime()) {
      return 'Сегодня';
    } else if (selectedDate.getTime() === tomorrow.getTime()) {
      return 'Завтра';
    } else {
      return selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  return (
    <div>
      <span className="step-emoji">📅</span>
      <h1 className="step-title">Когда встречаемся?</h1>
      <p className="step-subtitle">Выберите дату, время и погоду — для точных рекомендаций</p>

      {/* Date */}
      <p className="section-label">Дата свидания</p>
      <div className="date-input-wrap">
        <input
          id="date-input"
          type="date"
          min={today}
          value={state.date}
          onChange={e => {
            if (e.target.value >= today) setDate(e.target.value);
          }}
        />
        {state.date && (
          <p style={{ fontSize: 13, color: 'var(--accent-coral)', marginTop: 8, paddingLeft: 4 }}>
            📅 {formatDisplayDate(state.date)}
          </p>
        )}
      </div>

      {/* Time */}
      <p className="section-label">Время</p>
      <TimeSlider value={state.timeOfDay} onChange={setTimeOfDay} />

      {/* Weather */}
      <p className="section-label">Ожидаемая погода</p>
      <div className="weather-grid">
        {WEATHER_OPTIONS.map(opt => (
          <button
            key={opt.id}
            className={`weather-btn ${state.weather === opt.id ? 'active' : ''}`}
            onClick={() => setWeather(opt.id)}
            id={`weather-${opt.id}`}
          >
            <span>{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {(!state.date || !state.timeOfDay || !state.weather) && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          Заполните все поля для продолжения
        </p>
      )}
    </div>
  );
}
