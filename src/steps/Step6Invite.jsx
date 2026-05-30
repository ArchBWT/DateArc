import React, { useRef, useState } from 'react';
import { Download, Share2, Calendar, RefreshCw, Link } from 'lucide-react';
import { toPng } from 'html-to-image';
import { VIBES } from '../data/vibes';
import { DRESSCODES } from '../data/dresscodes';
import { getLookById } from '../data/lookTrends';
import { mapTimeToCategory } from '../utils/time';
import { encodeInvite } from '../utils/inviteLink';

const THEMES = [
  { id: 'noir',      label: 'Нуар',       cls: 'theme-noir',      emoji: '🖤' },
  { id: 'romantic',  label: 'Романтик',   cls: 'theme-romantic',  emoji: '💗' },
  { id: 'vibrant',   label: 'Пёстрый',    cls: 'theme-vibrant',   emoji: '🎉' },
  { id: 'midnight',  label: 'Ночь',       cls: 'theme-midnight',  emoji: '🌙' },
  { id: 'nature',    label: 'Природа',    cls: 'theme-nature',    emoji: '🌿' },
  { id: 'sunset',    label: 'Закат',      cls: 'theme-sunset',    emoji: '🌅' },
];

const WEATHER_LABELS = {
  sunny: '☀️ Солнечно',
  cloudy: '⛅ Переменная',
  rainy: '🌧️ Дождливо',
  snowy: '❄️ Снежно',
};

const FALLBACK_NAMES = {
  initiator: 'Тот, кто зовёт',
  guest: 'Тот, кто приходит',
};

export function Step6Invite({ state, setCardTheme, setCardMessage, reset }) {
  const cardRef = useRef(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const vibe = VIBES.find(v => v.id === state.vibe);
  const selectedLook = state.selectedLookId ? getLookById(state.selectedLookId) : null;
  const autoDresscode = DRESSCODES[state.vibe]?.[state.weather]?.[mapTimeToCategory(state.timeOfDay)];
  const styleLabel = selectedLook?.name || autoDresscode?.style;

  const initiatorName = state.initiatorName || FALLBACK_NAMES.initiator;
  const guestName = state.guestName || FALLBACK_NAMES.guest;

  const formatDate = (d) => {
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

  const currentTheme = THEMES.find(t => t.id === state.cardTheme) || THEMES[0];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'date-invite.png';
      a.click();
    } catch (e) {
      alert('Не удалось скачать карточку');
    }
  };

  const getShareText = () => {
    let text = `💌 Приглашение на свидание\n\n`;
    text += `👫 ${initiatorName} & ${guestName}\n`;
    if (state.date) text += `📅 ${formatDate(state.date)}, ${state.timeOfDay || ''}\n`;
    if (state.location) text += `📍 ${state.location.name}, ${state.location.address}\n`;
    if (vibe) text += `✨ Атмосфера: ${vibe.label}\n`;
    if (styleLabel) {
      text += `👗 Образ: ${styleLabel}`;
      if (selectedLook?.tagline) text += ` — ${selectedLook.tagline}`;
      text += '\n';
    }
    if (state.cardMessage) text += `\n💌 ${state.cardMessage}\n`;
    text += `\nС нетерпением жду нашей встречи! 🌹`;
    return encodeURIComponent(text);
  };

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=&text=${getShareText()}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${getShareText()}`, '_blank');
  };

  const handleCopyLink = async () => {
    const link = encodeInvite(state);
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      prompt('Скопируйте ссылку:', link);
    }
  };

  const handleAddCalendar = () => {
    if (!state.date) return;

    const dateStr = state.date.replace(/-/g, '');
    const [h, m] = (state.timeOfDay || '19:00').split(':').map(Number);
    const timeStr = `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    const endH = (h + 2) % 24;
    const endTimeStr = `${String(endH).padStart(2, '0')}${String(m).padStart(2, '0')}00`;

    const dateTimeStart = `${dateStr}T${timeStr}`;
    const dateTimeEnd = `${dateStr}T${endTimeStr}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:Свидание — ${vibe?.label || 'Встреча'}`,
      `DTSTART:${dateTimeStart}`,
      `DTEND:${dateTimeEnd}`,
      state.location ? `LOCATION:${state.location.address}` : '',
      `DESCRIPTION:${initiatorName} & ${guestName}. ${vibe?.label || ''}`,
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
    <div>
      <span className="step-emoji">🎉</span>
      <h1 className="step-title">Всё готово!</h1>
      <p className="step-subtitle">Ваша карточка свидания — делитесь с удовольствием</p>

      {/* User message */}
      <div className="card-message-input">
        <label htmlFor="card-message">Ваше сообщение (необязательно)</label>
        <textarea
          id="card-message"
          className="glass-input"
          placeholder="Например: С нетерпением жду нашей встречи!"
          value={state.cardMessage}
          onChange={e => setCardMessage(e.target.value)}
          maxLength={200}
          rows={2}
        />
      </div>

      {/* Theme selector */}
      <div className="theme-selector">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            className={`theme-btn ${theme.id} ${state.cardTheme === theme.id ? 'active' : ''}`}
            onClick={() => setCardTheme(theme.id)}
            title={theme.label}
            id={`theme-${theme.id}`}
            aria-pressed={state.cardTheme === theme.id}
            aria-label={`Тема: ${theme.label}`}
          />
        ))}
      </div>

      {/* Invite Card */}
      <div className="invite-card-wrap">
        <div ref={cardRef} className={`invite-card ${currentTheme.cls}`}>

          {/* Шапка карточки */}
          <div className="invite-card-header">
            <div className="invite-header-icon">{currentTheme.emoji}</div>
            <div className="invite-header-subtitle">Приглашение на свидание</div>
          </div>

          {/* Имена */}
          <div className="invite-names-block">
            <div className="invite-names">
              <span className="invite-name">{initiatorName}</span>
              <span className="invite-ampersand">&</span>
              <span className="invite-name">{guestName}</span>
            </div>
          </div>

          <div className="invite-divider" />

          {/* Детали */}
          <div className="invite-details">
            {state.date && (
              <div className="invite-detail">
                <span className="invite-detail-icon">📅</span>
                <div className="invite-detail-text">
                  <div className="invite-detail-label">Когда</div>
                  {formatDate(state.date)}
                  {state.timeOfDay && `, ${state.timeOfDay}`}
                </div>
              </div>
            )}

            {state.location && (
              <div className="invite-detail">
                <span className="invite-detail-icon">📍</span>
                <div className="invite-detail-text">
                  <div className="invite-detail-label">Где</div>
                  {state.location.name}
                  <div className="invite-detail-sub">{state.location.address}</div>
                </div>
              </div>
            )}

            {state.weather && (
              <div className="invite-detail">
                <span className="invite-detail-icon">{WEATHER_LABELS[state.weather]?.split(' ')[0]}</span>
                <div className="invite-detail-text">
                  <div className="invite-detail-label">Погода</div>
                  {WEATHER_LABELS[state.weather]?.split(' ').slice(1).join(' ')}
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

          {/* Вайб */}
          {vibe && (
            <div className="invite-vibe-tag">
              <span>{vibe.emoji}</span>
              {vibe.label}
            </div>
          )}

          {/* Сообщение пользователя */}
          {state.cardMessage && (
            <div className="invite-message">
              {state.cardMessage}
            </div>
          )}

          {/* Нижний декор */}
          <div className="invite-card-footer">
            <span>♡</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn primary" onClick={handleDownload} id="btn-download">
          <Download size={18} />
          Скачать карточку (PNG)
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
          <button className="action-btn telegram" onClick={handleShareTelegram} id="btn-telegram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </button>
          <button className="action-btn whatsapp" onClick={handleShareWhatsApp} id="btn-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </button>
        </div>

        <button
          className="action-btn calendar"
          onClick={handleAddCalendar}
          disabled={!state.date}
          id="btn-calendar"
        >
          <Calendar size={18} />
          Добавить в календарь (.ics)
        </button>

        <button
          className="action-btn secondary"
          onClick={handleCopyLink}
          id="btn-copy-link"
        >
          <Link size={18} />
          {linkCopied ? 'Скопировано!' : 'Скопировать ссылку на приглашение'}
        </button>

        <button
          className="action-btn secondary"
          onClick={reset}
          id="btn-reset"
          style={{ marginTop: 4 }}
        >
          <RefreshCw size={16} />
          Создать новое свидание
        </button>
      </div>
    </div>
  );
}
