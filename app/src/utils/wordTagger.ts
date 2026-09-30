// Uses compromise.js to identify verbs, adjectives, and nouns (substantives).
// Returns a Set of token indices that are eligible to become blanks.
import nlp from 'compromise';

const MIN_LENGTH = 3;

/** Tag raw word (no punctuation) and return true if it's a verb/adj/noun. */
export function isEligible(word: string): boolean {
  if (word.length < MIN_LENGTH) return false;
  // Skip words that are purely numeric
  if (/^\d+$/.test(word)) return false;

  const doc = nlp(word);
  return (
    doc.verbs().length > 0 ||
    doc.adjectives().length > 0 ||
    doc.nouns().length > 0
  );
}
