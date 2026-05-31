import React, { useState } from 'react';

const PRESETS = [
  { label: 'Утро', emoji: '🌅', time: '10:00' },
  { label: 'День', emoji: '☀️', time: '14:00' },
  { label: 'Вечер', emoji: '🌌', time: '19:00' },
  { label: 'Ночь', emoji: '🌙', time: '22:30' },
];

export function TimeSlider({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const parseTime = (val) => {
    if (!val) return 19 * 60;
    const [h, m] = val.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (total) => {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const totalMinutes = parseTime(value);
  const pct = (totalMinutes / 1425) * 100;

  const getEmojiAndPeriod = (total) => {
    const h = Math.floor(total / 60);
    if (h >= 6 && h < 12) return { emoji: '🌅', period: 'Утренний свет' };
    if (h >= 12 && h < 17) return { emoji: '☀️', period: 'Дневное тепло' };
    if (h >= 17 && h < 22) return { emoji: '🌌', period: 'Вечерний уют' };
    return { emoji: '🌙', period: 'Ночная романтика' };
  };

  const { emoji, period } = getEmojiAndPeriod(totalMinutes);

  const handleChange = (e) => {
    const snapped = Math.round(Number(e.target.value) / 15) * 15;
    onChange(minutesToTime(snapped));
  };

  return (
    <div className="time-slider-container">
      {/* Premium Glass Display Card */}
      <div className="time-slider-display">
        <span className="time-display-icon">{emoji}</span>
        <div className="time-display-info">
          <span className="time-display-label">Выбранное время</span>
          <span className="time-display-time">{value || '19:00'}</span>
          <span className="time-display-range">{period}</span>
        </div>
      </div>

      {/* Styled Slider Wrapper */}
      <div className="time-slider-wrapper">
        <div className="time-slider-track">
          <div className="time-slider-fill" style={{ width: `${pct}%` }} />
          <input
            type="range"
            min={0}
            max={1425}
            step={15}
            value={totalMinutes}
            onChange={handleChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className={`time-slider-input ${isDragging ? 'dragging' : ''}`}
            aria-label="Выбор времени"
          />
        </div>
        <div className="time-slider-labels">
          <span className="time-label" style={{ left: '0%', marginLeft: 0, transform: 'none' }}>00:00</span>
          <span className="time-label" style={{ left: '50%', transform: 'translateX(-50%)', marginLeft: 0 }}>12:00</span>
          <span className="time-label" style={{ left: '100%', transform: 'translateX(-100%)', marginLeft: 0 }}>23:45</span>
        </div>
      </div>

      {/* Time Presets (2x2 Grid on Mobile for Fat-Finger touch targets) */}
      <div className="time-presets" style={{ marginTop: 'var(--spacing-lg)' }}>
        {PRESETS.map((preset) => {
          const isActive = value === preset.time;
          return (
            <button
              key={preset.time}
              type="button"
              className={`time-preset-btn ${isActive ? 'active' : ''}`}
              onClick={() => onChange(preset.time)}
            >
              <span className="preset-emoji">{preset.emoji}</span>
              <span className="preset-label">{preset.label}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{preset.time}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TimeSlider;
