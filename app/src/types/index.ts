export interface Track {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
}

export interface LyricToken {
  id: number;
  word: string;         // original word (no punctuation)
  display: string;      // original text including surrounding punctuation
  isBlank: boolean;
  userAnswer: string;
  submitted: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_PERCENT: Record<Difficulty, number> = {
  easy: 0.30,
  medium: 0.60,
  hard: 0.80,
};

export type AppPhase = 'search' | 'loading' | 'playing' | 'submitted';
