# Spotify Clone — Student Web Player

A Spotify-style student music player made with **HTML, CSS, and vanilla JavaScript**. No framework, package manager, or build step is needed.

## Run it

Open `dist/index.html` in your browser. For a local web server, run:

```bash
cd dist
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## What it does

- Streams nine real tracks by Kevin MacLeod from incompetech.com.
- Features official Spotify players for Juice WRLD, Tatiana Manaois, Asake, and Rema. These embedded players handle their own playback and may require a Spotify sign-in for full songs.
- Includes a Surprise me button and shuffle playback for random listening.
- Lets you add audio files from your device for the current browser session.
- Has a Spotify-style home screen, library, curated playlists, queue, and now playing panel.
- Supports search, favorites, shuffle, repeat, seek, volume, and next/previous controls.
- Saves liked song IDs in `localStorage`.
- Adapts to desktop and mobile screens.

## How it is built

- `dist/index.html` contains the page structure and accessible controls.
- `dist/styles.css` contains the layout, colors, album art, and responsive rules.
- `dist/script.js` contains the track data, rendering, and player behavior.

To add another incompetech song, add an object to `musicTracks` near the top of `script.js` with its title, MP3 filename, and ISRC from the [official catalog](https://incompetech.com/agent-section/). The included tracks stream from incompetech.com, so they need an internet connection. Uploaded files use browser object URLs and must be added again after reloading the page.

## Music credit

“Tafi Maradi”, “Electro Cabello”, “Electrodoodle”, “Loopster”, “Poppers and Prosecco”, “Wepa”, “Glitter Blast”, “Maccary Bay”, and “Feelin Good” by [Kevin MacLeod](https://incompetech.com/). Licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). The player links to a `credits.html` page with each track's source, and the Now playing panel links to the current track.

This is an educational player inspired by music streaming interfaces. Its built-in audio player plays the Creative Commons tracks or files you add from your device. The four artist cards use official Spotify embeds, which play separately from the built-in player.
