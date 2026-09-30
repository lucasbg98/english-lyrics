import { useState, useEffect, useRef } from 'react';
import type { Track } from '../types';
import { searchTracks } from '../utils/lrclib';

interface Props {
  onSelect: (track: Track) => void;
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchTracks(query);
        setSuggestions(results.slice(0, 8));
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(track: Track) {
    setQuery(`${track.artistName} — ${track.trackName}`);
    setOpen(false);
    setSuggestions([]);
    onSelect(track);
  }

  return (
    <div className="search-wrapper" ref={containerRef}>
      <div className="search-input-row">
        <span className="search-icon">♪</span>
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por música ou artista..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {loading && <span className="search-spinner" />}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((t) => (
            <li key={t.id} className="suggestion-item" onMouseDown={() => handleSelect(t)}>
              <span className="suggestion-track">{t.trackName}</span>
              <span className="suggestion-artist">{t.artistName}</span>
            </li>
          ))}
        </ul>
      )}

      {open && !loading && suggestions.length === 0 && query.trim().length >= 2 && (
        <div className="suggestions-empty">Nenhum resultado encontrado</div>
      )}
    </div>
  );
}
