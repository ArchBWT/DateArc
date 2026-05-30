import React from 'react';
import { Check } from 'lucide-react';

export function Step1Roles({ state, setGender, setInitiatorName, setGuestName }) {
  const roles = [
    {
      id: 'male',
      emoji: '👨',
      title: 'Я парень',
      subtitle: 'Приглашаю девушку на свидание',
      guestLabel: 'Имя девушки',
    },
    {
      id: 'female',
      emoji: '👩',
      title: 'Я девушка',
      subtitle: 'Приглашаю парня на свидание',
      guestLabel: 'Имя парня',
    },
  ];

  const selected = state.initiatorGender;

  return (
    <div>
      <h1 className="step-title">Кто планирует<br />свидание?</h1>
      <p className="step-subtitle">Выберите вашу роль — это поможет персонализировать рекомендации</p>

      <div className="role-cards">
        {roles.map((role) => (
          <button
            key={role.id}
            className={`role-card glass-card ${selected === role.id ? 'selected' : ''}`}
            onClick={() => setGender(role.id)}
            aria-pressed={selected === role.id}
            id={`role-btn-${role.id}`}
          >
            <div className="role-icon">
              <span style={{ fontSize: 28 }}>{role.emoji}</span>
            </div>
            <div className="role-text">
              <h3>{role.title}</h3>
              <p>{role.subtitle}</p>
            </div>
            <div className="role-check">
              {selected === role.id && (
                <Check size={13} color="#fff" strokeWidth={3} />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="name-inputs">
        <div className="input-group">
          <label htmlFor="initiator-name">Ваше имя</label>
          <input
            id="initiator-name"
            type="text"
            className="glass-input"
            placeholder={state.initiatorGender === 'female' ? 'Например, Анна' : 'Например, Артём'}
            value={state.initiatorName}
            onChange={(e) => setInitiatorName(e.target.value)}
            maxLength={30}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="guest-name">
            {roles.find(r => r.id === state.initiatorGender)?.guestLabel ?? 'Имя партнёра'}
          </label>
          <input
            id="guest-name"
            type="text"
            className="glass-input"
            placeholder={state.initiatorGender === 'female' ? 'Например, Максим' : 'Например, Мария'}
            value={state.guestName}
            onChange={(e) => setGuestName(e.target.value)}
            maxLength={30}
            required
          />
        </div>
      </div>

      {!selected && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
          ☝️ Выберите роль, чтобы продолжить
        </p>
      )}
    </div>
  );
}
