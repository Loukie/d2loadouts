# d2loadouts

A small, **offline, browser-based loadout editor** for an offline Destiny 2
exploration mod (Sunrise). Load your character file, pick a Guardian, and change
weapons, armour, subclass, and abilities **by name** — the item codes and index
numbers are handled for you. Everything runs locally in your browser; nothing is
uploaded anywhere.

## Use it

**Online (easiest):** open **<https://loukie.github.io/d2loadouts/>** — nothing to
download, runs entirely in your browser. Or grab the repo and open `index.html`
locally (double-click it — no install, no server).

Then:

1. **Drop in your `settings.json`** (the mod's character file).
2. **Pick a Guardian** — Titan, Hunter, or Warlock.
3. **Edit** anything:
   - **Weapons / Armour** — click **Change**, pick from the named list or paste a
     [light.gg](https://www.light.gg) link / item hash.
   - **Subclass** — pick a different subclass for that class.
   - **Abilities** — Grenade, Jump, Class ability, and Super are named pickers.
   - **Guardian name** and **Body type**.
4. **Download** and drop the file back where your `settings.json` lives, then
   launch the game.

Only items that existed in this build are offered, so you can't pick something
that won't equip.

## What you can change

| | How | Notes |
| --- | --- | --- |
| **Weapons** (kinetic / energy / heavy) | pick by name or paste a light.gg link | swapping resets perks to the item's defaults so nothing incompatible carries over |
| **Armour** (helmet / gauntlets / chest / legs / class item) | pick by name | filtered to your Guardian's class |
| **Subclass** | pick from the class's subclasses | element/super changes with it |
| **Grenade** | named picker (per subclass) | |
| **Jump** and **Class ability** | named picker (per class) | |
| **Super** | named picker | see below |
| **Guardian name** | text field | writes `steam.user.persona_name` |
| **Body type** | Male / Female | *saved to the file, but this mod build renders a fixed character model, so it may not change on-screen* |

### Supers

Each subclass shows all its supers by name. Ones we've verified are clickable;
ones whose safe index isn't known are **greyed out** (so you can't break your
game on one). Two subclasses have a greyed super:

- **Sentinel** — Banner Shield / Sentinel Shield (only Ward of Dawn is reachable)
- **Arcstrider** — Whirlwind Guard (only Arc Staff is reachable)

These are *defensive variants* of the subclass's main super and don't sit at a
selectable index. Everything else — all other supers, all grenades, jumps, and
class abilities — is a working named picker.

**Melee is locked** on every subclass: it's tied to the subclass's active tree
and changing it breaks the game.

## How it works

- **Items** are stored as their item hash — the same number light.gg shows in its
  URL, just written in hex with `0x` in front (e.g. light.gg `3843477312` →
  `0xE516CF40`). The tool does that conversion for you.
- **Abilities** are stored as small index numbers. The tool maps those numbers to
  names for each subclass. See **[MAPPING.md](MAPPING.md)** for the full index
  reference and how it was worked out.
- **Saves stay under the limit.** The mod reads `settings.json` into a fixed 64 KB
  buffer and rejects anything larger ("Problem reading game content"). The tool
  writes readable JSON (indented objects, but the big progression arrays kept on
  one line) at ~45 KB, and refuses to save a file over the limit.

## If the game won't boot

An edited file that hangs on loading or drops you to character-select almost
always means a bad ability value. To recover: **delete `settings.json` and
relaunch** — the mod writes a fresh working default. (The tool greys out the
values known to break, so this should be rare.)

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | the app |
| `css/style.css` | styling |
| `js/hash.js` | hash ⇄ hex conversion |
| `js/app.js` | app logic + ability maps |
| `data/items.js` | the weapon/armour/subclass list (name → hash) |
| `MAPPING.md` | the ability index reference |

## Credits

- **[Kyle Thompson](https://github.com/KyleThmpsn)** and his
  **[Sundial](https://github.com/KyleThmpsn/sundial)** editor — a fuller, native
  editor that reads ability data straight from the Shadowkeep game files. It
  confirmed our ability names and revealed the super+melee "attunement" model.
  Note: Sundial targets Sunrise **0.1**, and not all of those ability indices
  transfer to **0.2**, so this browser tool sticks to what's verified on 0.2.
  Go check out Sundial for the full-featured, game-file-accurate editor.
- Built for the [Sunrise](https://github.com/stanuwu/Sunrise) offline exploration
  mod by [stanuwu](https://github.com/stanuwu).

## Disclaimer

Not affiliated with Bungie or the mods' authors. You must provide your own copy of
the game. This project ships no game data.
