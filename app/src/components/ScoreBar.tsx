import type { LyricToken } from '../types';

interface Props {
  tokens: LyricToken[];
}

export default function ScoreBar({ tokens }: Props) {
  const blanks = tokens.filter((t) => t.isBlank);
  const correct = blanks.filter(
    (t) => t.userAnswer.trim().toLowerCase() === t.word.toLowerCase()
  );

  const pct = blanks.length === 0 ? 0 : Math.round((correct.length / blanks.length) * 100);

  return (
    <div className="score-bar">
      <span className="score-text">
        Pontuação: <strong>{correct.length}/{blanks.length}</strong> ({pct}%)
      </span>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
