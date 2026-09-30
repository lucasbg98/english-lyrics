# English Lyrics Learning App — Plan & Clarifications

## Overview

A web application built in React that helps users learn English by filling in missing words from real song lyrics. The user searches for a song, selects it, and is presented with the lyric where certain words (verbs, adjectives, nouns) have been blanked out. The user types guesses into each blank, submits, and receives color-coded feedback (green = correct, red = wrong) along with the correct answer shown for any wrong answers.

---

## Core Features (as understood)

### 1. Song Search & Autocomplete
- A search input field where the user types a song name (or artist + song).
- As the user types, suggestions appear as a dropdown list showing matching songs.
- The user clicks a suggestion to select that song.

### 2. Lyric Display with Blanks
- After selection, the full lyric is displayed.
- A set of random words are replaced with blank input fields.
- Only **verbs**, **adjectives**, and **nouns (substantives)** are eligible to be removed — no articles, prepositions, conjunctions, etc.
- The number of blanked words should feel challenging but fair (not too many, not too few).

### 3. User Fills In the Blanks
- Each blank is an inline text input within the lyric.
- The user types their guesses directly into the lyric flow.

### 4. Submit & Validation
- A "Submit" button at the bottom of the lyric.
- After submission:
  - Correct answers → input turns **green**.
  - Wrong answers → input turns **red**, and the **correct word is shown** below or beside the field.

### 5. New Song / Retry
- After seeing results, the user can search for a new song (or retry the same one with different blanks).

---

## Technical Approach (proposed)

### Frontend
- **React** (likely with Vite for fast setup)
- **State management**: React useState / useReducer (or Zustand if complexity grows)
- Component breakdown:
  - `SearchBar` — autocomplete input
  - `LyricDisplay` — renders lyric with inline blank inputs
  - `BlankInput` — individual blank field
  - `ResultView` — post-submission colored feedback

### Lyrics & Search API
- A lyrics API is needed to:
  1. Search songs by name/artist and return suggestions.
  2. Fetch the full lyric text for a selected song.
- Candidates:
  - **Musixmatch API** (most complete, has search + lyrics)
  - **Genius API** (search + lyric page scraping)
  - **lyrics.ovh** (free, no key required, but limited search)

### Word Removal Logic (NLP)
- After fetching the lyric, the app must identify verbs, adjectives, and nouns.
- Approach options:
  - **compromise.js** — lightweight NLP library for the browser, can tag parts of speech (verbs, adjectives, nouns).
  - **wink-nlp** — another browser-compatible NLP option.
- A percentage (e.g. 30–40%) of eligible words are randomly selected to become blanks.

### Validation
- On submit, compare each user input (case-insensitive, trimmed) against the original word.
- Show green/red styling + reveal correct word for red fields.

---

## Step-by-Step Development Plan

1. **Project scaffold** — Vite + React + TypeScript setup, folder structure.
2. **Search UI** — build the autocomplete search component (mocked data first).
3. **API integration** — connect to lyrics/search API, wire up real suggestions and lyric fetching.
4. **NLP word tagging** — integrate compromise.js, test part-of-speech detection on sample lyrics.
5. **Blank generation** — randomly select N% of eligible words and replace with blank inputs.
6. **Lyric rendering** — render the lyric as a mix of plain text spans and blank inputs.
7. **Submission & validation** — implement submit logic and color-coded feedback.
8. **Polish** — loading states, error handling, responsive layout, styling.

---

## Open Questions (please answer these)

### About the Lyrics Source
1. **Do you have a preferred lyrics API or service?** Some options require API keys (Musixmatch, Genius). Are you okay with registering for a free API key, or do you prefer a fully free/no-key solution (which will be more limited)?

Answer: it would be better to be an free option, like Mewwme Lyrics API, check about that one first and then give me an answer if its possible

2. **Should the app support searching by artist name, song title, or both?** (e.g. "Adele Hello" vs just "Hello")

Answer: Both

### About the Blanks
3. **How many words should be blanked out?** Should it be a fixed number (e.g. always 10 words), a percentage of eligible words (e.g. 30%), or should there be difficulty levels (Easy / Medium / Hard)?

Answer: make it difficulty levels, each level will have a % of words that will be removed, it can be something like 30, 60, 80 for example

4. **Should the same lyric always produce the same blanks**, or should the blanks be re-randomized every time the user loads that song? (The description says "random", implying re-randomized each time — just confirming.)

Answer: re-randomized every time user loads the song

5. **Should very short or very common words be excluded?** For example, even if "be" is a verb, should it be a valid blank? Or should there be a minimum word length (e.g. 4+ characters)?

Answer: let's make it a minimum word lenght, 3+ characters, so we can get words like "can" "get" and stuff like that

### About the User Experience
6. **Should the app show the song title and artist while the lyric is displayed?** Or just the lyric text?
Answer: Yes

7. **After submitting, can the user edit and re-submit**, or is it a one-shot attempt?
Answer: one shot attempt, the user can retry after he failed but it should randomize again the letters

8. **Should the app track any score or progress over time** (e.g. "you got 7/10 correct")? Or is it purely a one-round exercise per song?
Answer: for now just an one-round exercise

9. **Is there a language/region preference for the songs?** (e.g. only English songs, or any language?)
Answer: the songs will be mostly english language, but it should be any language 

### About the Look & Feel
10. **Do you have a design style in mind?** (minimal/clean, dark mode, music-themed visuals, etc.)
Answer: make it more clean design, with dark mode available, and music-themed visuals

11. **Should this be mobile-friendly / responsive**, or is it desktop-only for now?
make it responsive to mobiles too

### About Deployment
12. **Where will this be hosted?** (Vercel, Netlify, GitHub Pages, local only, etc.)
Answer: not for now, the idea is to be something more small at first so kinda local only

13. **Should there be any user accounts / login**, or is it a fully anonymous experience?
fully anonymous for now

---

*Once you answer these questions, I will update this plan and begin building the application.*
