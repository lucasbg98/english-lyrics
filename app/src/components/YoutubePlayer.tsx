import { useState } from 'react';
import { buildEmbedUrl, searchYoutubeVideo } from '../utils/youtube';

interface YoutubePlayerProps {
  videoId: string | null;
  trackName: string;
  artistName: string;
  loading?: boolean;
}

export default function YoutubePlayer({
  videoId,
  trackName,
  artistName,
  loading,
}: YoutubePlayerProps) {
  const [minimized, setMinimized] = useState(false);
  const [retryId, setRetryId] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const activeId = retryId || videoId;

  async function handleRetry() {
    setRetrying(true);
    const id = await searchYoutubeVideo(trackName, artistName);
    if (id) setRetryId(id);
    setRetrying(false);
  }

  if (loading || retrying) {
    return (
      <aside className="yt-sidebar">
        <div className="yt-loading">
          <div className="search-spinner" />
          <span>Buscando vídeo…</span>
        </div>
      </aside>
    );
  }

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${trackName} ${artistName}`
  )}`;

  return (
    <aside className={`yt-sidebar ${minimized ? 'yt-minimized' : ''}`}>
      <div className="yt-header">
        <span className="yt-title">YouTube</span>
        <div className="yt-actions">
          <button
            className="btn btn-ghost yt-btn"
            onClick={handleRetry}
            title="Buscar outro vídeo"
          >
            ↻
          </button>
          <button
            className="btn btn-ghost yt-btn"
            onClick={() => setMinimized((m) => !m)}
            title={minimized ? 'Expandir' : 'Minimizar'}
          >
            {minimized ? '▲' : '▼'}
          </button>
        </div>
      </div>
      {!minimized && (
        activeId ? (
          <div className="yt-player-wrapper">
            <iframe
              className="yt-iframe"
              src={buildEmbedUrl(activeId)}
              title={`${trackName} - ${artistName}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="yt-fallback">
            <p>Não foi possível carregar o vídeo automaticamente.</p>
            <a
              className="btn btn-secondary"
              href={youtubeSearchUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir no YouTube ↗
            </a>
            <button className="btn btn-ghost yt-btn" onClick={handleRetry}>
              Tentar novamente
            </button>
          </div>
        )
      )}
    </aside>
  );
}
