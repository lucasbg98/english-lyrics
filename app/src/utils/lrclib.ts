import type { Track } from '../types';

const BASE = 'https://lrclib.net/api';

export interface LrclibTrack {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

export async function searchTracks(query: string): Promise<Track[]> {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  const data: LrclibTrack[] = await res.json();
  return data
    .filter((t) => t.plainLyrics)
    .map((t) => ({
      id: t.id,
      trackName: t.trackName,
      artistName: t.artistName,
      albumName: t.albumName,
      duration: t.duration,
    }));
}

/** Remove LRC-style timestamps like [01:23.45] or [01:23] from any line. */
function stripTimestamps(text: string): string {
  return text
    .replace(/\[\d{1,2}:\d{2}(?:\.\d+)?\]/g, '')
    .replace(/^\s*\n/gm, '\n')   // collapse lines that are now empty after stripping
    .trim();
}

export async function fetchLyrics(id: number): Promise<string> {
  const res = await fetch(`${BASE}/get/${id}`);
  if (!res.ok) throw new Error('Lyrics not found');
  const data: LrclibTrack = await res.json();
  // Prefer plainLyrics; fall back to stripping timestamps from syncedLyrics
  const raw = data.plainLyrics ?? data.syncedLyrics;
  if (!raw) throw new Error('Nenhuma letra disponível');
  return stripTimestamps(raw);
}
