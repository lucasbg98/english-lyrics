import type { LyricToken } from '../types';
import BlankInput from './BlankInput';

interface Props {
  tokens: LyricToken[];
  submitted: boolean;
  onAnswer: (id: number, value: string) => void;
}

/** Split flat token list into lines (split on \n tokens). */
function splitIntoLines(tokens: LyricToken[]): LyricToken[][] {
  const lines: LyricToken[][] = [];
  let current: LyricToken[] = [];
  for (const t of tokens) {
    if (t.display === '\n') {
      lines.push(current);
      current = [];
    } else {
      current.push(t);
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

export default function LyricDisplay({ tokens, submitted, onAnswer }: Props) {
  const lines = splitIntoLines(tokens);
  let firstBlank = true;

  return (
    <div className="lyric-body">
      {lines.map((line, li) => {
        // Empty line → visual spacer between stanzas
        const isEmpty = line.every((t) => t.word.trim() === '');
        if (isEmpty) return <div key={li} className="lyric-stanza-break" />;

        return (
          <div key={li} className="lyric-line">
            {line.map((token) => {
              if (token.word === ' ' || token.display === ' ') {
                return <span key={token.id}>&nbsp;</span>;
              }

              if (token.isBlank) {
                const isFirst = firstBlank;
                if (firstBlank) firstBlank = false;
                return (
                  <BlankInput
                    key={token.id}
                    token={token}
                    submitted={submitted}
                    onChange={onAnswer}
                    autoFocus={isFirst && !submitted}
                  />
                );
              }

              return (
                <span key={token.id} className="lyric-word">
                  {token.display}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
