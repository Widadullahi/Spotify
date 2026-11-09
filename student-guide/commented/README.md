# Spotify Clone — Student Web Player <!-- Create the document title. -->
<!-- Blank line separating sections so the file is easier to read. -->
A Spotify-style student music player made with **HTML, CSS, and vanilla JavaScript**. No framework, package manager, or build step is needed. <!-- Explain how to use, understand, or credit the project. -->
<!-- Blank line separating sections so the file is easier to read. -->
## Run it <!-- Create a major documentation section. -->
<!-- Blank line separating sections so the file is easier to read. -->
Open `dist/index.html` in your browser. For a local web server, run: <!-- Explain how to use, understand, or credit the project. -->
<!-- Blank line separating sections so the file is easier to read. -->
```bash <!-- Start a fenced code example. -->
cd dist <!-- Explain how to use, understand, or credit the project. -->
python3 -m http.server 8000 <!-- Explain how to use, understand, or credit the project. -->
``` <!-- End the code example. -->
<!-- Blank line separating sections so the file is easier to read. -->
Then visit `http://localhost:8000`. <!-- Explain how to use, understand, or credit the project. -->
<!-- Blank line separating sections so the file is easier to read. -->
## What it does <!-- Create a major documentation section. -->
<!-- Blank line separating sections so the file is easier to read. -->
- Streams nine real tracks by Kevin MacLeod from incompetech.com. <!-- Add one item to a bulleted list. -->
- Links to the official Spotify pages for Juice WRLD, Tatiana Manaois, Asake, and Rema without adding separate audio players that could overlap the built-in player. <!-- Add one item to a bulleted list. -->
- Includes a Surprise me button and shuffle playback for random listening. <!-- Add one item to a bulleted list. -->
- Lets you add audio files from your device for the current browser session. <!-- Add one item to a bulleted list. -->
- Has a Spotify-style home screen, library, curated playlists, queue, and now playing panel. <!-- Add one item to a bulleted list. -->
- Supports search, favorites, shuffle, repeat, seek, volume, and next/previous controls. <!-- Add one item to a bulleted list. -->
- Saves liked song IDs in `localStorage`. <!-- Add one item to a bulleted list. -->
- Adapts to desktop and mobile screens. <!-- Add one item to a bulleted list. -->
<!-- Blank line separating sections so the file is easier to read. -->
## How it is built <!-- Create a major documentation section. -->
<!-- Blank line separating sections so the file is easier to read. -->
- `dist/index.html` contains the page structure and accessible controls. <!-- Add one item to a bulleted list. -->
- `dist/styles.css` contains the layout, colors, album art, and responsive rules. <!-- Add one item to a bulleted list. -->
- `dist/script.js` contains the track data, rendering, and player behavior. <!-- Add one item to a bulleted list. -->
<!-- Blank line separating sections so the file is easier to read. -->
## Student guide <!-- Create a major documentation section. -->
<!-- Blank line separating sections so the file is easier to read. -->
Open `student-guide/README.md` for exact copies of every project file and commented versions where an explanation is placed directly beside every line of code. <!-- Explain how to use, understand, or credit the project. -->
<!-- Blank line separating sections so the file is easier to read. -->
To add another incompetech song, add an object to `musicTracks` near the top of `script.js` with its title, MP3 filename, and ISRC from the [official catalog](https://incompetech.com/agent-section/). The included tracks stream from incompetech.com, so they need an internet connection. Uploaded files use browser object URLs and must be added again after reloading the page. <!-- Explain how to use, understand, or credit the project. -->
<!-- Blank line separating sections so the file is easier to read. -->
## Music credit <!-- Create a major documentation section. -->
<!-- Blank line separating sections so the file is easier to read. -->
“Tafi Maradi”, “Electro Cabello”, “Electrodoodle”, “Loopster”, “Poppers and Prosecco”, “Wepa”, “Glitter Blast”, “Maccary Bay”, and “Feelin Good” by [Kevin MacLeod](https://incompetech.com/). Licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). The player links to a `credits.html` page with each track's source, and the Now playing panel links to the current track. <!-- Explain how to use, understand, or credit the project. -->
<!-- Blank line separating sections so the file is easier to read. -->
This is an educational player inspired by music streaming interfaces. Its single built-in audio player plays the Creative Commons tracks or files you add from your device. The four artist cards are links, so they cannot start a second in-app audio stream. <!-- Explain how to use, understand, or credit the project. -->
