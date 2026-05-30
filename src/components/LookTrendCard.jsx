import React from 'react';

export function LookTrendCard({ look, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`look-trend-card glass-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(look)}
      style={{
        '--look-accent': look.accent || 'var(--accent-coral)',
      }}
    >
      <div
        className="look-trend-visual"
        style={{
          background: look.imageGradient || `linear-gradient(135deg, #1a1a22, ${look.accent}33)`,
        }}
      >
        <span className="look-trend-emoji">{look.emoji}</span>
      </div>
      <div className="look-trend-body">
        <h4>{look.name}</h4>
        <p>{look.tagline}</p>
        {look.hashtags?.length > 0 && (
          <span className="look-trend-tags">{look.hashtags.slice(0, 2).join(' ')}</span>
        )}
      </div>
      {selected && <span className="look-trend-check">✓</span>}
    </button>
  );
}
