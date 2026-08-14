# Subclass ability index map

How the ability numbers in `settings.json` map to in-game abilities, reverse-engineered by in-game testing on Sunrise **0.2**.

Note: [Kyle Thompson's Sundial](https://github.com/KyleThmpsn/sundial) reads the ability layout straight from the Shadowkeep game files, so it's the authoritative source for **what each index is**. Cross-checking against it settled the two open questions on this map (see the Supers section) — every super's index is `10`/`20`; the two that break on 0.2 aren't a wrong number, they're a build limitation. Sundial targets Sunrise **0.1**; its melee/tree indices don't all transfer to 0.2, so this map still sticks to what's verified in-game on **0.2**.

## The universal layout

Every subclass uses the **same index positions** — only the names change per subclass. The character fields are:

| Field (`settings.json`) | Index(es) | What it is |
| --- | --- | --- |
| `class_ability` | **2, 3** | the two class abilities (per class) |
| `movement_ability` | **4, 5, 6** | the three jumps (per class) |
| `grenade_ability` | **7, 8, 9** | the three grenades (per subclass) |
| `super_ability` | **10, 20** | the tree supers (per subclass) |
| `melee_ability` | **11, 15, 21** | the tree melees (per subclass) |

### Attunements (trees)

Super and melee are **tree-bound as a pair**: each subclass has three attunement trees, and each tree is a fixed `(super, melee)` combo. The skeleton is **identical across all 9 subclasses** — only the names change — and was confirmed against the Shadowkeep game files via Sundial and verified in-game on 0.2:

| Tree | `super_ability` | `melee_ability` |
| --- | --- | --- |
| 1st | **10** | **11** |
| 2nd | **10** | **15** |
| 3rd | **20** | **21** |

The tool's Attunement picker writes both values together, so you only ever get a valid combo.

Notes / findings:
- **0–1** are the sprint/class region — setting anything there breaks the character (→ stuck loading / class-select).
- **Melee is NOT locked.** Earlier testing wrongly concluded only `11` worked; in-game testing on 0.2 confirms `11`, `15` and `21` all boot (e.g. all three Sunbreaker and Striker trees loaded cleanly). It's tied to the tree, but every tree's melee is valid.
- **Super**: `10` and `20` are the two supers for **every** subclass — confirmed against the game files via Sundial. On **0.2**, both load for the seven subclasses whose supers are roaming/one-shot types (all 3 trees work). The only two that break are the game's two *hold-to-guard* supers — **Banner Shield** (Sentinel, tree 3) and **Whirlwind Guard** (Arcstrider, tree 3): `20` is the correct index, but the 0.2 build can't load them (they work on the 0.1 build). **Proven by isolation:** Sentinel `super=20` breaks even with the safe melee `11`, while Sunbreaker `super=20` boots with melee `21` — so it's the guard super, not the melee. Those subclasses' other two trees (both `super=10`) work fine. Sentinel is also remapped on 0.2 — `10` shows **Ward of Dawn** in-game (the game-file name for `10` is Sentinel Shield).
- **Bad values are NOT ignored** — most out-of-range/wrong values break the character and drop you to the character-creation screen (recover: delete `settings.json` and relaunch).

Legend: ✅ confirmed in-game · ⚠️ best-guess (verify)

## Class abilities — `class_ability` (per class)

| Class | 2 | 3 |
| --- | --- | --- |
| Titan | Towering Barricade ✅ | Rally Barricade ✅ |
| Hunter | Marksman's Dodge ✅ | Gambler's Dodge ✅ |
| Warlock | Healing Rift ✅ | Empowering Rift ✅ |

## Jumps — `movement_ability` (per class)

| Class | 4 | 5 | 6 |
| --- | --- | --- | --- |
| Titan | High Lift ✅ | Strafe Lift ✅ | Catapult Lift ✅ |
| Hunter | High Jump ✅ | Strafe Jump ✅ | Triple Jump ✅ |
| Warlock | Strafe Glide ✅ | Burst Glide ✅ | Balanced Glide ✅ |

## Grenades — `grenade_ability` (per subclass)

| Subclass | 7 | 8 | 9 |
| --- | --- | --- | --- |
| Striker | Lightning ✅ | Flashbang ✅ | Pulse ✅ |
| Sunbreaker | Fusion ✅ | Incendiary ✅ | Thermite ✅ |
| Sentinel | Suppressor ✅ | Magnetic ✅ | Voidwall ✅ |
| Gunslinger | Tripmine ✅ | Incendiary ✅ | Swarm ✅ |
| Arcstrider | Arcbolt ✅ | Skip ✅ | Flux ✅ |
| Nightstalker | Spike ✅ | Vortex ✅ | Voidwall ✅ |
| Dawnblade | Fusion ✅ | Solar ✅ | Firebolt ✅ |
| Stormcaller | Storm ✅ | Arcbolt ✅ | Pulse ✅ |
| Voidwalker | Scatter ✅ | Vortex ✅ | Axion Bolt ✅ |

## Attunements — `super_ability` + `melee_ability` (per subclass)

Each row is one tree: the super and melee it grants. `❌` marks the two trees whose super the 0.2 build can't load (the guard supers) — greyed in the tool. Everything else is confirmed working in-game.

| Subclass | Tree 1 — `10/11` | Tree 2 — `10/15` | Tree 3 — `20/21` |
| --- | --- | --- | --- |
| Striker | Fists of Havoc / Seismic Strike ✅ | Fists of Havoc / Frontal Assault ✅ | Thundercrash / Ballistic Slam ✅ |
| Sunbreaker | Hammer of Sol / Hammer Strike ✅ | Hammer of Sol / Mortar Blast ✅ | Burning Maul / Throwing Hammer ✅ |
| Sentinel | Ward of Dawn / Defensive Strike ✅ | Ward of Dawn / Shield Bash ✅ | Banner Shield / Tactical Strike ❌ |
| Gunslinger | Golden Gun / Proximity Explosive Knife ✅ | Golden Gun / Weighted Knife ✅ | Blade Barrage / Knife Trick ✅ |
| Arcstrider | Arc Staff / Combination Blow ✅ | Arc Staff / Disorienting Blow ✅ | Whirlwind Guard / Tempest Strike ❌ |
| Nightstalker | Shadowshot / Snare Bomb ✅ | Shadowshot / Vanish in Smoke ✅ | Spectral Blades / Corrosive Smoke ✅ |
| Dawnblade | Daybreak / Celestial Fire ✅ | Daybreak / Igniting Touch ✅ | Well of Radiance / Guiding Flame ✅ |
| Stormcaller | Stormtrance / Chain Lightning ✅ | Stormtrance / Rising Storm ✅ | Chaos Reach / Ball Lightning ✅ |
| Voidwalker | Nova Bomb / Entropic Pull ✅ | Nova Bomb / Devour ✅ | Nova Warp / Atomic Breach ✅ |

*(Tree names, e.g. "Code of the Missile", are in the tool's picker; the on-screen top/mid/bottom position of a tree varies per subclass and doesn't matter — the tool keys off the ability names, not position.)*

**Guard-super rule:** index `20` is the correct third-tree super for every subclass (verified against the game files via Sundial and in-game). It loads for all seven subclasses whose third super is roaming/one-shot. The two *hold-to-guard* supers — Banner Shield (Sentinel) and Whirlwind Guard (Arcstrider) — sit at `20` too, but the **0.2 build can't load them** (they work on 0.1). Proven by isolation, not guessed. Those subclasses keep their other two trees.

Recovery if a value hangs the game: delete `settings.json` and relaunch (the mod writes a fresh working default).
