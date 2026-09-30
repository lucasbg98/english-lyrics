import type { LyricToken, Difficulty } from '../types';
import { DIFFICULTY_PERCENT } from '../types';
import { isEligible } from './wordTagger';

export function tokenizeLyric(lyric: string, difficulty: Difficulty): LyricToken[] {
  const lines = lyric.split('\n');
  const tokens: LyricToken[] = [];
  let id = 0;

  // Pass 1: build all tokens (no blanks yet), each token gets a unique id
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const chunks = line.match(/\S+/g) ?? [];

    if (chunks.length === 0) {
      tokens.push({ id: id++, word: '', display: '\n', isBlank: false, userAnswer: '', submitted: false });
      continue;
    }

    let charPos = 0;
    for (const chunk of chunks) {
      const chunkStart = line.indexOf(chunk, charPos);
      if (chunkStart > charPos) {
        tokens.push({
          id: id++, word: ' ',
          display: line.slice(charPos, chunkStart),
          isBlank: false, userAnswer: '', submitted: false,
        });
      }
      charPos = chunkStart + chunk.length;

      const bare = chunk.replace(/^[^a-zA-Z0-9']+|[^a-zA-Z0-9']+$/g, '');
      tokens.push({ id: id++, word: bare, display: chunk, isBlank: false, userAnswer: '', submitted: false });
    }

    tokens.push({ id: id++, word: '\n', display: '\n', isBlank: false, userAnswer: '', submitted: false });
  }

  // Pass 2: find eligible word tokens (real words, not spaces/newlines)
  const eligible = tokens.filter(
    (t) => t.word.trim().length > 0 && t.word !== '\n' && isEligible(t.word)
  );

  const blankCount = Math.max(1, Math.round(eligible.length * DIFFICULTY_PERCENT[difficulty]));
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const blankIds = new Set(shuffled.slice(0, blankCount).map((t) => t.id));

  // Pass 3: mark selected tokens as blanks
  return tokens.map((t) => ({ ...t, isBlank: blankIds.has(t.id) }));
}
