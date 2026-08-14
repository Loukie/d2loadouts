# d2loadouts

A small, offline, browser-based loadout editor. Load a character file, pick a
character, and swap weapons and armour by name — the item codes are handled for
you. Everything runs locally in your browser; nothing is uploaded anywhere.

## Use it

1. Open `index.html` in any browser (just double-click it).
2. Drop in your character file (`settings.json`).
3. Pick a character (Titan / Hunter / Warlock).
4. Click **Change** on any weapon or armour slot — pick from the list, or paste
   a [light.gg](https://www.light.gg) link / item hash.
5. Click **Download** and put the file back where it lives.

## How it works

Items are stored as their item hash — the same number light.gg shows in its URL,
just written in hex with a `0x` in front (e.g. light.gg `3843477312` → `0xE516CF40`).
This tool does that conversion for you, and when you swap an item it resets that
slot's perks to the item's native defaults so nothing incompatible carries over.

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | the app |
| `css/style.css` | styling |
| `js/hash.js` | hash ⇄ hex conversion |
| `js/app.js` | app logic |
| `data/items.js` | the item list (name → hash) |

## Disclaimer

Not affiliated with Bungie. You must provide your own copy of any game this is
used with. This project ships no game data.
