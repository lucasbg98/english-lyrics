import { useState, useCallback, useEffect } from 'react';
import type { Track, Difficulty, LyricToken, AppPhase } from './types';
import { fetchLyrics } from './utils/lrclib';
import { tokenizeLyric } from './utils/blankGenerator';
import { searchYoutubeVideo } from './utils/youtube';
import SearchBar from './components/SearchBar';
import DifficultySelector from './components/DifficultySelector';
import LyricDisplay from './components/LyricDisplay';
import ScoreBar from './components/ScoreBar';
import YoutubePlayer from './components/YoutubePlayer';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  const [phase, setPhase] = useState<AppPhase>('search');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [tokens, setTokens] = useState<LyricToken[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [ytLoading, setYtLoading] = useState(false);

  async function handleSelect(track: Track) {
    setSelectedTrack(track);
    setPhase('loading');
    setError(null);
    setYoutubeVideoId(null);
    setYtLoading(true);
    try {
      const [lyric] = await Promise.all([
        fetchLyrics(track.id),
        searchYoutubeVideo(track.trackName, track.artistName)
          .then((id) => { setYoutubeVideoId(id); setYtLoading(false); })
          .catch(() => { setYtLoading(false); }),
      ]);
      const toks = tokenizeLyric(lyric, difficulty);
      setTokens(toks);
      setPhase('playing');
    } catch (e) {
      setError((e as Error).message);
      setPhase('search');
      setYtLoading(false);
    }
  }

  async function handleDifficultyChange(d: Difficulty) {
    setDifficulty(d);
    if ((phase === 'playing' || phase === 'submitted') && selectedTrack) {
      setPhase('loading');
      try {
        const lyric = await fetchLyrics(selectedTrack.id);
        setTokens(tokenizeLyric(lyric, d));
        setPhase('playing');
      } catch {
        setPhase('search');
      }
    }
  }

  const handleAnswer = useCallback((id: number, value: string) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, userAnswer: value } : t))
    );
  }, []);

  function handleSubmit() {
    setPhase('submitted');
  }

  async function handleRetry() {
    if (!selectedTrack) return;
    setPhase('loading');
    setError(null);
    try {
      const lyric = await fetchLyrics(selectedTrack.id);
      setTokens(tokenizeLyric(lyric, difficulty));
      setPhase('playing');
    } catch (e) {
      setError((e as Error).message);
      setPhase('search');
    }
  }

  function handleNewSong() {
    setPhase('search');
    setSelectedTrack(null);
    setTokens([]);
    setError(null);
    setYoutubeVideoId(null);
    setYtLoading(false);
  }

  const isSubmitted = phase === 'submitted';
  const blanks = tokens.filter((t) => t.isBlank);
  const canSubmit = blanks.length > 0 && blanks.some((t) => t.userAnswer.trim().length > 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">♫</span>
          <span className="brand-name">LyricFill</span>
          <span className="brand-tagline">aprenda inglês através da música</span>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Alternar modo escuro"
        >
          {darkMode ? '☀' : '☾'}
        </button>
      </header>

      <main className="app-main">
        {(phase === 'search' || phase === 'loading') && (
          <section className="search-section">
            <h1 className="hero-title">Preencha as lacunas</h1>
            <p className="hero-sub">
              Busque uma música, escolha a dificuldade e adivinhe as palavras que faltam.
            </p>
            <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
            <SearchBar onSelect={handleSelect} />
            {error && <p className="error-msg">{error}</p>}
            {phase === 'loading' && (
              <div className="loading-card">
                <div className="vinyl-spin">◎</div>
                <p>Carregando letra…</p>
              </div>
            )}
          </section>
        )}

        {(phase === 'playing' || phase === 'submitted') && selectedTrack && (
          <div className="playing-layout has-player">
            <section className="lyric-section">
              <div className="lyric-header">
                <div className="track-meta">
                  <span className="track-name">{selectedTrack.trackName}</span>
                  <span className="track-artist">{selectedTrack.artistName}</span>
                </div>
                <div className="lyric-controls">
                  <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
                  <button className="btn btn-ghost" onClick={handleNewSong}>
                    ← Nova música
                  </button>
                </div>
              </div>

              {isSubmitted && <ScoreBar tokens={tokens} />}

              <div className="lyric-card">
                <LyricDisplay
                  tokens={tokens}
                  submitted={isSubmitted}
                  onAnswer={handleAnswer}
                />
              </div>

              <div className="action-row">
                {!isSubmitted ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                  >
                    Verificar respostas
                  </button>
                ) : (
                  <>
                    <button className="btn btn-secondary" onClick={handleRetry}>
                      Tentar novamente (novas lacunas)
                    </button>
                    <button className="btn btn-ghost" onClick={handleNewSong}>
                      Escolher outra música
                    </button>
                  </>
                )}
              </div>
            </section>

            <YoutubePlayer
              videoId={youtubeVideoId}
              trackName={selectedTrack.trackName}
              artistName={selectedTrack.artistName}
              loading={ytLoading}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        Letras fornecidas por{' '}
        <a href="https://lrclib.net" target="_blank" rel="noreferrer">
          lrclib.net
        </a>
      </footer>
    </div>
  );
}
