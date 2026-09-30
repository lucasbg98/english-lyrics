import { useRef, useEffect } from 'react';
import type { LyricToken } from '../types';

interface Props {
  token: LyricToken;
  submitted: boolean;
  onChange: (id: number, value: string) => void;
  autoFocus?: boolean;
}

export default function BlankInput({ token, submitted, onChange, autoFocus }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus();
  }, [autoFocus]);

  const isCorrect = submitted
    ? token.userAnswer.trim().toLowerCase() === token.word.toLowerCase()
    : null;

  // Width scales with the hidden word length, min 3 chars
  const width = Math.max(token.word.length, 3);

  return (
    <span className="blank-wrapper">
      <input
        ref={ref}
        className={`blank-input${submitted ? (isCorrect ? ' correct' : ' wrong') : ''}`}
        style={{ width: `${width + 1}ch` }}
        value={token.userAnswer}
        onChange={(e) => !submitted && onChange(token.id, e.target.value)}
        disabled={submitted}
        aria-label={submitted ? `Answer: ${token.word}` : 'Fill in the blank'}
        autoComplete="off"
        spellCheck={false}
      />
      {submitted && !isCorrect && (
        <span className="correct-answer">{token.word}</span>
      )}
    </span>
  );
}
