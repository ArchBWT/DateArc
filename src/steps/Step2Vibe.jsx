import React from 'react';
import { Coffee, Zap, Palette, Sparkles } from 'lucide-react';
import { VIBES } from '../data/vibes';

const ICONS = { Coffee, Zap, Palette, Sparkles };

export function Step2Vibe({ state, setVibe }) {
  return (
    <div>
      <span className="step-emoji">✨</span>
      <h1 className="step-title">Какая атмосфера<br />свидания?</h1>
      <p className="step-subtitle">Выберите настроение — мы подберём идеальные места и рекомендации</p>

      <div className="vibe-grid">
        {VIBES.map((vibe) => {
          const Icon = ICONS[vibe.icon];
          const isSelected = state.vibe === vibe.id;

          return (
            <button
              key={vibe.id}
              className={`vibe-card glass-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setVibe(vibe.id)}
              aria-pressed={isSelected}
              id={`vibe-btn-${vibe.id}`}
              style={isSelected ? {
                background: vibe.colorDim,
                borderColor: vibe.color + '66',
                boxShadow: `0 0 0 2px ${vibe.color}88, 0 8px 40px ${vibe.color}33`
              } : {}}
            >
              <div
                className="vibe-icon-wrap"
                style={{
                  background: isSelected ? vibe.colorDim : 'rgba(255,255,255,0.05)',
                  boxShadow: isSelected ? `0 0 24px ${vibe.color}44` : 'none',
                }}
              >
                {Icon && (
                  <Icon
                    size={26}
                    color={isSelected ? vibe.color : 'var(--text-muted)'}
                    strokeWidth={1.8}
                  />
                )}
              </div>
              <h3 style={isSelected ? { color: vibe.color } : {}}>{vibe.label}</h3>
              <p>{vibe.description}</p>

              {/* Tags */}
              <div className="vibe-tags">
                {vibe.tags.map(tag => (
                  <span
                    key={tag}
                    className="vibe-tag"
                    style={{
                      background: isSelected ? `${vibe.color}22` : 'rgba(255,255,255,0.05)',
                      color: isSelected ? vibe.color : 'var(--text-muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
