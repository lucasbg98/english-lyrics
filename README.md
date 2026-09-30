# English Lyrics

Learn English by filling in the missing words of real song lyrics.

Search for any song, pick a difficulty, and the app blanks out verbs, adjectives and nouns from the lyric. Type your guesses into the blanks, submit, and see what you got right, with the song playing alongside.

## Features

- **Song search with autocomplete**: search by song title, artist, or both, powered by the free [lrclib.net](https://lrclib.net) API (no API key needed).
- **Smart blanks with NLP**: [compromise.js](https://github.com/spencermountain/compromise) tags each word's part of speech in the browser. Only verbs, adjectives and nouns with 3+ letters can become blanks, so articles and prepositions never do.
- **Three difficulty levels**: Easy, Medium and Hard blank out 30%, 60% and 80% of the eligible words.
- **Fresh exercise every time**: blanks are re-randomized on every load and on every retry.
- **Instant feedback**: after submitting, correct answers turn green and wrong answers turn red with the correct word revealed, plus a score bar.
- **Listen while you play**: an embedded YouTube player (privacy-enhanced `youtube-nocookie` embed) finds and plays the song next to the lyric.
- **Dark mode** and a responsive layout for mobile.
- Interface in Brazilian Portuguese, built for Portuguese speakers learning English.

## How it works

1. `SearchBar` queries lrclib's search endpoint and only lists tracks that have lyrics.
2. When a track is selected, the lyric (`/api/get/:id`) and the YouTube video are fetched in parallel. Synced (LRC) lyrics have their timestamps stripped.
3. `blankGenerator` tokenizes the lyric line by line, keeping punctuation and line breaks, and asks `wordTagger` which tokens are eligible.
4. A share of the eligible tokens (by difficulty) is chosen at random and rendered as inline inputs by `LyricDisplay` / `BlankInput`.
5. On submit, each answer is compared case-insensitively and trimmed against the original word, and `ScoreBar` shows the result.

The app is a small state machine driven by a single `phase` value: `search` → `loading` → `playing` → `submitted`.

## Tech stack

- React 19 + TypeScript
- Vite
- compromise.js (client-side NLP)
- lrclib.net API (lyrics and search)
- YouTube embed (video search through public CORS proxies)

## Project structure

```
app/
├── src/
│   ├── App.tsx                  # phases, data loading, difficulty, retry
│   ├── components/
│   │   ├── SearchBar.tsx        # autocomplete search
│   │   ├── DifficultySelector.tsx
│   │   ├── LyricDisplay.tsx     # lyric with inline blanks
│   │   ├── BlankInput.tsx       # a single blank, colored after submit
│   │   ├── ScoreBar.tsx
│   │   └── YoutubePlayer.tsx
│   ├── utils/
│   │   ├── lrclib.ts            # search + lyric fetch, timestamp stripping
│   │   ├── blankGenerator.ts    # tokenization and random blank selection
│   │   ├── wordTagger.ts        # part-of-speech eligibility (compromise.js)
│   │   └── youtube.ts           # finds a video id for the track
│   └── types/index.ts           # Track, LyricToken, Difficulty, AppPhase
APP_PLAN.md                      # original product plan and decisions
app/IMPLEMENTATION_YOUTUBE.md    # design notes for the YouTube player
```

## Getting started

Requires Node.js 18+.

```bash
cd app
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

Other scripts: `npm run build` (type-check + production build), `npm run preview`, `npm run lint`.

## Notes and limitations

- The YouTube video is found by searching YouTube through public CORS proxies, so it can occasionally fail or pick a different upload. The lyric exercise still works without it.
- Part-of-speech tagging is tuned for English. Songs in other languages load, but blank selection is less accurate.
- Each round is a one-shot attempt, and scores are not stored between sessions yet.

## Roadmap

- Deploy a public demo
- Score history and progress over time
- Hints (first letter, word length)

## About

Built by [Lucas Bragança Gonçalves](https://lucasbragancadev.vercel.app) ([LinkedIn](https://www.linkedin.com/in/lucas-braganca-goncalves98)), planned and developed with Claude Code.
