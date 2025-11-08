# Omikujital

Omikujital is a pocket-sized digital ritual that lets you pull a Japanese proverb, reflect for a moment, and keep the wisdom you love. It runs entirely in the browser—no build step, just static files.

## Objective
- Offer a calm daily pull inspired by shrine omikuji, but centered on kotowaza (proverbs) instead of luck scores.
- Give learners the kanji, kana, romaji, literal line, and a friendly note so each draw is both poetic and practical.
- Encourage mindful collecting with a five-slot favorites pocket that lives in `localStorage`.

## Lore
Shrines hand out paper omikuji: you shake a box, draw a numbered stick, and receive a slip of fate. Omikujital keeps the ritual but swaps prophecies for proverbs. Each card is treated like a quiet companion—something you can open, sit with, or tuck away. By limiting how many sayings you save, the app leans into the idea that wisdom should travel light. It is meant to feel handcrafted even though it is digital: a single card, a wax seal, a note from a patient friend.

## Features
- Daily kotowaza pull with automatic reseeding every midnight (based on the user’s clock).
- Optional “Reset” button to reseal the paper whenever you want another reflection.
- Favorites page (`favorites.html`) that mirrors saved cards, capped at five entries.
- Copy/share helpers plus gentle toasts for feedback.
- Works offline after the first load because everything lives in `data/idioms.json`.

## Running Locally
1. Clone the repo and enter the folder:
   ```bash
   git clone git@github.com:rismajuliaw/omikujital.git
   cd omikujital
   ```
2. Serve the root directory with any static file server, for example:
   ```bash
   npx serve .
   ```
3. Open `http://localhost:3000` (or the port shown) in your browser.

You can also just open `index.html` directly in a modern browser, though using a server ensures fetch requests for `data/idioms.json` succeed everywhere.

## Data & Scripts
- `data/idioms.json` contains the curated kotowaza list used in the deck.
- `scripts/generate_idioms.py` can clean or reshape source material before exporting to JSON.

Feel free to remix the idioms, adjust the styling in `styles.css`, or plug in your own lore. The goal is to keep the experience gentle, readable, and easy to share.
