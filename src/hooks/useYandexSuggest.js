import { useEffect, useRef, useState } from 'react';
import {
  fetchYandexSuggest,
  hasYandexApiKey,
  resolveYandexSuggestItem,
} from '../services/yandexGeosearch';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LEN = 2;

/**
 * Живой поиск мест через Яндекс Geosuggest + Геокодер.
 * @param {string} query — текст из поля ввода
 * @param {{ lat: number, lon: number }} cityBias — центр выбранного города
 */
export function useYandexSuggest(query, cityBias) {
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const enabled = hasYandexApiKey();
  const trimmed = query.trim();

  useEffect(() => {
    if (!enabled) {
      setSuggestions([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    if (trimmed.length < MIN_QUERY_LEN) {
      setSuggestions([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSearching(true);
      setError(null);

      try {
        const results = await fetchYandexSuggest(
          trimmed,
          cityBias,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setSuggestions(results);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setSuggestions([]);
          if (err.message === 'NO_API_KEY') {
            setError('Добавьте VITE_YANDEX_MAPS_API_KEY в .env');
          } else if (err.status === 403) {
            setError('Неверный API-ключ или не активирован (подождите ~15 мин)');
          } else if (err.status === 429) {
            setError('Слишком много запросов, подождите немного');
          } else {
            setError('Не удалось получить подсказки');
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [trimmed, cityBias.lat, cityBias.lon, enabled]);

  const pickSuggestion = async (item) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsResolving(true);
    setError(null);

    try {
      const place = await resolveYandexSuggestItem(item, controller.signal);
      setSuggestions([]);
      return place;
    } catch (err) {
      if (err.name === 'AbortError') return null;
      setError('Не удалось определить координаты места');
      return null;
    } finally {
      setIsResolving(false);
    }
  };

  const clearSuggestions = () => setSuggestions([]);

  return {
    enabled,
    suggestions,
    isSearching,
    isResolving,
    error,
    pickSuggestion,
    clearSuggestions,
    showDropdown: enabled && trimmed.length >= MIN_QUERY_LEN && (suggestions.length > 0 || isSearching || error),
  };
}
