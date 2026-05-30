import React, { useState, useEffect } from 'react';

export function ProgressBar({ step, total }) {
  const pct = ((step - 1) / (total - 1)) * 100;

  const stepLabels = [
    'Роли',
    'Атмосфера',
    'Место',
    'Дата',
    'Образ',
    'Финал',
  ];

  return (
    <div className="progress-bar-container">
      <div className="progress-header">
        <span className="progress-label">{stepLabels[step - 1]}</span>
        <span className="progress-count">{step} / {total}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-dots">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`progress-dot ${i + 1 < step ? 'done' : ''} ${i + 1 === step ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
