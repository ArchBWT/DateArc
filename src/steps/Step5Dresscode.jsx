import React, { useMemo } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { DRESSCODES, CHECKLIST_ITEMS } from '../data/dresscodes';
import { getMatchingTrendLooks, getLookById } from '../data/lookTrends';
import { getSponsoredLooksForContext, isLookAdsEnabled } from '../data/sponsoredLooks';
import { LookTrendCard } from '../components/LookTrendCard';
import { SponsoredLookBanner } from '../components/SponsoredLookBanner';
import { mapTimeToCategory } from '../utils/time';

export function Step5Dresscode({ state, toggleChecklist, setSelectedLook }) {
  const { vibe, weather, timeOfDay, initiatorGender, checklist, selectedLookId, sponsoredAdId } = state;

  const context = useMemo(
    () => ({
      vibe: vibe || 'cozy',
      weather: weather || 'sunny',
      timeOfDay: mapTimeToCategory(timeOfDay),
      gender: initiatorGender || null,
    }),
    [vibe, weather, timeOfDay, initiatorGender],
  );

  const autoDresscode = useMemo(() => {
    return DRESSCODES[context.vibe]?.[context.weather]?.[context.timeOfDay] || null;
  }, [context]);

  const selectedLook = useMemo(
    () => (selectedLookId ? getLookById(selectedLookId) : null),
    [selectedLookId],
  );

  const trendLooks = useMemo(() => getMatchingTrendLooks(context, 6), [context]);
  const sponsoredAds = useMemo(() => getSponsoredLooksForContext(context), [context]);

  const displayStyle = selectedLook
    ? { style: selectedLook.name, tagline: selectedLook.tagline }
    : autoDresscode
      ? { style: autoDresscode.style, tagline: 'Под ваш вайб и погоду' }
      : null;

  const tipsFor = (gender) => {
    if (selectedLook) {
      return gender === 'female' ? selectedLook.female : selectedLook.male;
    }
    if (!autoDresscode) return [];
    return gender === 'female' ? autoDresscode.female : autoDresscode.male;
  };

  const activeChecklist = useMemo(() => {
    return CHECKLIST_ITEMS.filter((item) => {
      const vibeOk = item.vibes.includes(context.vibe);
      const weatherOk = !item.weather || item.weather.includes(context.weather);
      return vibeOk && weatherOk;
    });
  }, [context]);

  const initiatorLabel =
    initiatorGender === 'female' ? 'Для неё (инициатор)' : 'Для него (инициатор)';
  const guestLabel =
    initiatorGender === 'female' ? 'Для него (гость)' : 'Для неё (гость)';

  const handleSelectLook = (look, adId = null) => {
    if (selectedLookId === look.id && sponsoredAdId === adId) {
      setSelectedLook(null);
      return;
    }
    setSelectedLook(look.id, adId);
  };

  return (
    <div>
      <span className="step-emoji">👗</span>
      <h1 className="step-title">Образ и подготовка</h1>
      <p className="step-subtitle">
        Тренды 2026 под ваше свидание или классические советы по погоде
      </p>

      {/* Трендовые образы */}
      <p className="looks-section-title">
        <Sparkles size={14} />
        В тренде сейчас
      </p>
      <div className="look-trends-scroll">
        {trendLooks.map((look) => (
          <LookTrendCard
            key={look.id}
            look={look}
            selected={selectedLookId === look.id && !sponsoredAdId}
            onSelect={(l) => handleSelectLook(l)}
          />
        ))}
      </div>

      {/* Реклама с конкретными образами */}
      {sponsoredAds.length > 0 && (
        <div className="sponsored-looks-block">
          <p className="looks-section-title looks-section-title-muted">Партнёрские подборки</p>
          {sponsoredAds.map((ad) => (
            <SponsoredLookBanner
              key={ad.id}
              ad={ad}
              selected={selectedLookId === ad.lookId && sponsoredAdId === ad.id}
              onApplyLook={(look) => handleSelectLook(look, ad.id)}
            />
          ))}
        </div>
      )}

      {isLookAdsEnabled() && sponsoredAds.length === 0 && (
        <p className="looks-ads-hint">
          Реклама включена, но нет подходящих кампаний под этот вайб
        </p>
      )}

      {/* Выбранный / авто стиль */}
      {displayStyle && (
        <>
          <div className="dresscode-style-badge">
            <span className="dresscode-style-label">
              {selectedLook ? '✨ Ваш образ' : '🎯 Базовый стиль'}
            </span>
            <span className="dresscode-style-name">{displayStyle.style}</span>
            {displayStyle.tagline && (
              <span className="dresscode-style-tagline">{displayStyle.tagline}</span>
            )}
          </div>

          <div className="dresscode-section">
            <div className="dresscode-header">
              <h3>{initiatorLabel}</h3>
            </div>
            <div className="glass-card dresscode-card">
              <div className="dresscode-tips">
                {tipsFor(initiatorGender === 'female' ? 'female' : 'male').map((tip, i) => (
                  <p key={i} className="dresscode-tip">{tip}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="dresscode-section">
            <div className="dresscode-header">
              <h3>{guestLabel}</h3>
            </div>
            <div className="glass-card dresscode-card">
              <div className="dresscode-tips">
                {tipsFor(initiatorGender === 'female' ? 'male' : 'female').map((tip, i) => (
                  <p key={i} className="dresscode-tip">{tip}</p>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <p className="checklist-title">Чек-лист подготовки</p>
      <div className="checklist glass-card" style={{ padding: 'var(--spacing-sm)' }}>
        {activeChecklist.map((item) => {
          const isChecked = !!checklist[item.id];
          return (
            <button
              key={item.id}
              className={`checklist-item ${isChecked ? 'checked' : ''}`}
              onClick={() => toggleChecklist(item.id)}
              id={`check-${item.id}`}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
              aria-pressed={isChecked}
            >
              <div className="check-box">
                {isChecked && <Check size={13} color="#fff" strokeWidth={3} />}
              </div>
              <span className="item-text">{item.label}</span>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
        {Object.values(checklist).filter(Boolean).length} из {activeChecklist.length} готово
      </p>
    </div>
  );
}
