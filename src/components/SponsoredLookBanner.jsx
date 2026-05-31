import React from 'react';
import { ExternalLink } from 'lucide-react';

export function SponsoredLookBanner({ ad, selected, onApplyLook }) {
  if (!ad.look) return null;

  const resolvedLogoUrl = ad.logoUrl?.startsWith('/') 
    ? `${import.meta.env.BASE_URL}${ad.logoUrl.slice(1)}` 
    : ad.logoUrl;

  return (
    <div
      className={`sponsored-look-banner glass-card ${selected ? 'selected' : ''}`}
    >
      {/* Шапка: лого + спонсор */}
      <div className="look-ad-badge-row">
        {resolvedLogoUrl ? (
          <img src={resolvedLogoUrl} alt={ad.logoAlt} className="sponsor-logo sponsor-logo--xs" />
        ) : (
          <div className="sponsor-logo-fallback sponsor-logo--xs">
            {ad.sponsor?.charAt(0)}
          </div>
        )}
        <span className="look-ad-sponsor-name">{ad.sponsor}</span>
      </div>

      {/* Визуал + описание */}
      <div className="sponsored-look-inner">
        <div
          className="sponsored-look-visual"
          style={{ background: ad.imageGradient }}
        >
          {resolvedLogoUrl ? (
            <img src={resolvedLogoUrl} alt={ad.logoAlt} className="sponsor-logo sponsor-logo--lg" />
          ) : (
            <div className="sponsor-logo-fallback sponsor-logo--lg">
              {ad.sponsor?.charAt(0)}
            </div>
          )}
        </div>

        <div className="sponsored-look-copy">
          <h4>{ad.title}</h4>
          <p>{ad.description}</p>
          {ad.look?.name && (
            <div className="sponsored-look-linked">
              Образ: <strong>{ad.look.name}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Кнопки */}
      <div className="sponsored-look-actions">
        <button
          type="button"
          className="sponsored-btn sponsored-btn-primary"
          onClick={() => onApplyLook(ad.look)}
        >
          {selected ? '✓ Применено' : 'Применить образ'}
        </button>
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="sponsored-btn sponsored-btn-link"
        >
          {ad.cta}
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
