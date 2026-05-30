import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { YandexMap } from '../hooks/useYandexMaps';
import { useYandexSuggest } from '../hooks/useYandexSuggest';
import { hasYandexApiKey } from '../services/yandexGeosearch';
import { CITIES, LOCATIONS, CITY_CENTERS, DEFAULT_COORDS } from '../data/locations';
import { VIBES } from '../data/vibes';

export function Step3Location({ state, setCity, setLocation }) {
  const [searchVal, setSearchVal] = useState('');
  const [mapCenter, setMapCenter] = useState(null);
  const searchWrapRef = useRef(null);

  const currentVibe = state.vibe || 'cozy';
  const currentCity = state.city || 'Москва';

  const cityCenter = CITY_CENTERS[currentCity] || DEFAULT_COORDS;
  const cityBias = { lat: cityCenter[0], lon: cityCenter[1] };

  const {
    enabled: yandexEnabled,
    suggestions,
    isSearching,
    isResolving,
    error: yandexError,
    pickSuggestion,
    clearSuggestions,
    showDropdown,
  } = useYandexSuggest(searchVal, cityBias);

  const recommendations = useMemo(() => {
    const cityData = LOCATIONS[currentCity];
    if (!cityData) return [];
    return cityData[currentVibe] || [];
  }, [currentCity, currentVibe]);

  const vibeLabel = VIBES.find(v => v.id === currentVibe)?.label ?? '';

  const handlePlaceClick = (place) => {
    setLocation(place);
    setMapCenter(place.coords);
    setSearchVal(place.name);
    clearSuggestions();
  };

  const handleSuggestPick = async (item) => {
    const place = await pickSuggestion(item);
    if (!place) return;
    setLocation(place);
    setMapCenter(place.coords);
    setSearchVal(place.name);
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        clearSuggestions();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [clearSuggestions]);

  const markerCoords = state.location?.coords || null;
  const mapViewCoords = mapCenter || cityCenter;
  const mapCenterLonLat = [mapViewCoords[1], mapViewCoords[0]];

  const filteredRecommendations = recommendations.filter(
    p =>
      !searchVal ||
      p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.address.toLowerCase().includes(searchVal.toLowerCase()),
  );

  return (
    <div>
      <span className="step-emoji">📍</span>
      <h1 className="step-title">Где встретимся?</h1>
      <p className="step-subtitle">Выберите место из рекомендаций или найдите своё</p>

      <div className="city-selector">
        {CITIES.map(city => (
          <button
            key={city}
            className={`city-chip ${state.city === city ? 'active' : ''}`}
            onClick={() => {
              setCity(city);
              setLocation(null);
              setMapCenter(null);
              setSearchVal('');
              clearSuggestions();
            }}
            id={`city-${city.replace(/\s/g, '-')}`}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="location-search" ref={searchWrapRef}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="glass-input"
          placeholder={
            yandexEnabled
              ? 'Кафе, парк, адрес — подсказки от Яндекса…'
              : 'Поиск в списке ниже (нужен ключ Яндекса)'
          }
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          id="location-search-input"
        />
        {(isSearching || isResolving) && (
          <Loader2
            size={16}
            className="search-spinner"
            aria-hidden
          />
        )}

        {showDropdown && (
          <ul className="yandex-suggest-list" role="listbox">
            {isSearching && suggestions.length === 0 && (
              <li className="yandex-suggest-item yandex-suggest-muted">Ищем…</li>
            )}
            {yandexError && (
              <li className="yandex-suggest-item yandex-suggest-error">{yandexError}</li>
            )}
            {suggestions.map(item => (
              <li key={item.id} role="option">
                <button
                  type="button"
                  className="yandex-suggest-item"
                  onClick={() => handleSuggestPick(item)}
                  disabled={isResolving}
                >
                  <span className="yandex-suggest-title">{item.title}</span>
                  {item.subtitle && (
                    <span className="yandex-suggest-subtitle">{item.subtitle}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!hasYandexApiKey() && (
        <p className="yandex-key-hint">
          Для живого поиска создайте{' '}
          <code>.env</code> с ключом{' '}
          <code>VITE_YANDEX_MAPS_API_KEY</code> (см. <code>.env.example</code>).
        </p>
      )}

      <YandexMap
        center={mapCenterLonLat}
        zoom={markerCoords ? 15 : 12}
        markerCoords={markerCoords}
      />

      {state.location && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: 'var(--bg-card-active)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-accent)',
          marginBottom: 'var(--spacing-sm)',
        }}>
          <MapPin size={14} color="var(--accent-coral)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-coral-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {state.location.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {state.location.address}
            </div>
          </div>
          <button
            onClick={() => {
              setLocation(null);
              setMapCenter(null);
              setSearchVal('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1 }}
            aria-label="Убрать место"
          >×</button>
        </div>
      )}

      <p className="recommendations-title">
        🔥 Топ мест — «{vibeLabel}» · {currentCity}
      </p>

      <div className="place-list">
        {filteredRecommendations.map((place, idx) => (
          <button
            key={idx}
            className={`place-item glass-card ${state.location?.name === place.name ? 'selected' : ''}`}
            onClick={() => handlePlaceClick(place)}
            id={`place-${idx}`}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--accent-coral-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 12, fontWeight: 700, color: 'var(--accent-coral)',
            }}>
              {idx + 1}
            </div>
            <div className="place-info">
              <h4>{place.name}</h4>
              <p>{place.address}</p>
            </div>
            {state.location?.name === place.name && (
              <div style={{ marginLeft: 'auto', color: 'var(--accent-coral)', fontSize: 16 }}>✓</div>
            )}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
        💡 Вы можете пропустить этот шаг и определиться позже
      </p>
    </div>
  );
}
