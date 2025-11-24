# Music Practice Tools

Personal collection of small tools for learning music.

## Stack

- Plain HTML files with inline React (via CDN)
- Tailwind CSS (via CDN)
- No build step - just open HTML files in a browser

## Hosting

Served via GitHub Pages - push to main to deploy.

## Principles

- Keep it simple: single-file tools, no dependencies to install
- Reliability over features: working basics beat broken extras
- Easy to run: just open the HTML file

## Structure

- `index.html` - main menu linking to tools
- `ukulele-practice.html` / `.jsx` - chord practice tool
- `note-practice.html` - note recognition with audio playback
- `tones.html` - play individual tones

New tools should always be added to `index.html` so they're accessible from the main menu.
