import React from 'react';
import { Heart, Calendar, MapPin, Cloud, Sparkles } from 'lucide-react';
import { VIBES } from '../data/vibes';
import { getLookById } from '../data/lookTrends';
import { mapTimeToCategory } from '../utils/time';

const THEMES = [
  { id: 'noir',      cls: 'theme-noir',      emoji: '🖤' },
  { id: 'romantic',  cls: 'theme-romantic',  emoji: '💗' },
  { id: 'vibrant',   cls: 'theme-vibrant',   emoji: '🎉' },
  { id: 'midnight',  cls: 'theme-midnight',  emoji: '🌙' },
  { id: 'nature',    cls: 'theme-nature',    emoji: '🌿' },
  { id: 'sunset',    cls: 'theme-sunset',    emoji: '🌅' },
];

const WEATHER_LABELS = {
  sunny: '☀️ Солнечно',
  cloudy: '⛅ Переменная',
  rainy: '🌧️ Дождливо',
  snowy: '❄️ Снежно',
};

const DRESSCODE_NAMES = {
  cozy: { sunny: { morning: 'Лёгкий casual', afternoon: 'Smart casual', evening: 'Romantic casual', night: 'Evening smart' }, rainy: { morning: 'Cosy & waterproof', afternoon: 'Casual with layers', evening: 'Layered smart', night: 'Dark & cosy' }, snowy: { morning: 'Winter casual', afternoon: 'Warm & stylish', evening: 'Cosy winter chic', night: 'Winter evening' }, cloudy: { morning: 'Neutral casual', afternoon: 'Smart layers', evening: 'Smart casual+', night: 'Warm evening' } },
  active: { sunny: { morning: 'Active sports', afternoon: 'Sporty casual', evening: 'Active & fresh', night: 'Sport smart' }, rainy: { morning: 'Waterproof sport', afternoon: 'Rain-ready active', evening: 'Sport layers', night: 'Sport cosy' }, snowy: { morning: 'Winter sport', afternoon: 'Warm active', evening: 'Sport winter', night: 'Winter urban sport' }, cloudy: { morning: 'Casual sport', afternoon: 'Layered active', evening: 'Sport smart', night: 'Urban sport' } },
  cultural: { sunny: { morning: 'Smart casual', afternoon: 'Business casual', evening: 'Evening smart', night: 'Black tie optional' }, rainy: { morning: 'Smart & practical', afternoon: 'Layered smart', evening: 'Elegant & warm', night: 'Evening formal' }, snowy: { morning: 'Winter smart', afternoon: 'Chic winter', evening: 'Winter evening', night: 'Formal winter' }, cloudy: { morning: 'Casual smart', afternoon: 'Smart relaxed', evening: 'Smart evening', night: 'Evening formal' } },
  adventure: { sunny: { morning: 'Adventure casual', afternoon: 'Urban explorer', evening: 'Night explorer', night: 'Urban night' }, rainy: { morning: 'All-weather explorer', afternoon: 'Layered adventure', evening: 'Moody adventure', night: 'Urban dark' }, snowy: { morning: 'Winter adventure', afternoon: 'Snow explorer', evening: 'Winter urban', night: 'Night winter explorer' }, cloudy: { morning: 'Casual explorer', afternoon: 'Urban layers', evening: 'Moody urban', night: 'Night casual' } },
};

export function InviteView({ invite }) {
  const vibe = VIBES.find(v => v.id === invite.vibe);
  const theme = THEMES.find(t => t.id === invite.cardTheme) || THEMES[0];
  const selectedLook = invite.selectedLookId ? getLookById(invite.selectedLookId) : null;

  const timeCategory = mapTimeToCategory(invite.timeOfDay);
  const styleLabel = selectedLook?.name || DRESSCODE_NAMES[invite.vibe]?.[invite.weather]?.[timeCategory];

  const formatDate = (d) => {
    if (!d) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const selectedDate = new Date(d + 'T00:00:00');
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate.getTime() === today.getTime()) return 'Сегодня';
    if (selectedDate.getTime() === tomorrow.getTime()) return 'Завтра';
    return selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const handleAddCalendar = () => {
    if (!invite.date) return;
    const dateStr = invite.date.replace(/-/g, '');
    const [h, m] = (invite.timeOfDay || '19:00').split(':').map(Number);
    const timeStr = `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    const endH = (h + 2) % 24;
    const endTimeStr = `${String(endH).padStart(2, '0')}${String(m).padStart(2, '0')}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:Свидание — ${vibe?.label || 'Встреча'}`,
      `DTSTART:${dateStr}T${timeStr}`,
      `DTEND:${dateStr}T${endTimeStr}`,
      invite.location ? `LOCATION:${invite.location.address}` : '',
      `DESCRIPTION:${invite.initiatorName} & ${invite.guestName}. ${vibe?.label || ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'date.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="invite-view">
      <div className="invite-card-wrap">
        <div className={`invite-card ${theme.cls}`}>

          <div className="invite-card-header">
            <div className="invite-header-icon">{theme.emoji}</div>
            <div className="invite-header-subtitle">Приглашение на свидание</div>
          </div>

          <div className="invite-names-block">
            <div className="invite-names">
              <span className="invite-name">{invite.initiatorName}</span>
              <span className="invite-ampersand">&</span>
              <span className="invite-name">{invite.guestName}</span>
            </div>
          </div>

          <div className="invite-divider" />

          <div className="invite-details">
            {invite.date && (
              <div className="invite-detail">
                <span className="invite-detail-icon">📅</span>
                <div className="invite-detail-text">
                  <div className="invite-detail-label">Когда</div>
                  {formatDate(invite.date)}
                  {invite.timeOfDay && `, ${invite.timeOfDay}`}
                </div>
              </div>
            )}

            {invite.location && (
              <a
                className="invite-detail invite-detail-link"
                href={invite.location.coords ? `https://yandex.ru/maps/?pt=${invite.location.coords[1]},${invite.location.coords[0]}&z=17&text=${encodeURIComponent(invite.location.name)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="invite-detail-icon">📍</span>
                <div className="invite-detail-text">
                  <div className="invite-detail-label">Где</div>
                  {invite.location.name}
                  <div className="invite-detail-sub">{invite.location.address}</div>
                </div>
              </a>
            )}

            {invite.weather && (
              <div className="invite-detail">
                <span className="invite-detail-icon">{WEATHER_LABELS[invite.weather]?.split(' ')[0]}</span>
                <div className="invite-detail-text">
                  <div className="invite-detail-label">Погода</div>
                  {WEATHER_LABELS[invite.weather]?.split(' ').slice(1).join(' ')}
                </div>
              </div>
            )}

            {styleLabel && (
              <div className="invite-detail">
                <span className="invite-detail-icon">{selectedLook?.emoji || '👗'}</span>
                <div className="invite-detail-text">
                  <div className="invite-detail-label">Образ</div>
                  {styleLabel}
                  {selectedLook?.tagline && (
                    <div className="invite-detail-sub">{selectedLook.tagline}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {vibe && (
            <div className="invite-vibe-tag">
              <span>{vibe.emoji}</span>
              {vibe.label}
            </div>
          )}

          {invite.cardMessage && (
            <div className="invite-message">
              {invite.cardMessage}
            </div>
          )}

          <div className="invite-card-footer">
            <span>♡</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="action-btn calendar"
          onClick={handleAddCalendar}
          disabled={!invite.date}
        >
          <Calendar size={18} />
          Добавить в календарь (.ics)
        </button>

        <button
          className="action-btn primary"
          onClick={() => {
            window.location.hash = '';
            window.location.reload();
          }}
        >
          <Sparkles size={18} />
          Создать своё приглашение
        </button>
      </div>
    </div>
  );
}
