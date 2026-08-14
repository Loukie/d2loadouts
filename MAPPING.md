# Subclass ability index map

How the ability numbers in `settings.json` map to in-game abilities, reverse-engineered by in-game testing on Sunrise **0.2**.

Note: [Kyle Thompson's Sundial](https://github.com/KyleThmpsn/sundial) reads the ability layout straight from the Shadowkeep game files and was invaluable for understanding the socket/pool structure. The final say here, though, is **in-game testing on 0.2 by casting each super** — the subclass screen can mislabel a super (it shows the tree you selected even when the equipped super doesn't match), so every entry below was confirmed by the super that actually came out.

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
- **Super** — two models (see the Attunements table for the full breakdown):
    - *Roaming subclasses* have a real super socket at both `10` (base super) and `20` (distinct third super). Set `super_ability` to the value the tree needs.
    - *Guard subclasses* (Sentinel, Arcstrider) have only the `10` socket; the active tree routes its super in, so the super is always `super=10` and the **melee** picks it. `super=20` has no socket here and breaks — which is why Banner Shield / Whirlwind Guard first looked "unreachable" (we were setting `20`). Set `super=10` + the tree melee and they cast correctly.
    - Caveat: `super_ability` only changes the *cast* super when it points at a real socket. On a roaming subclass, `super=10 + melee=21` mislabels itself as the third tree on the subclass screen but still casts the base super — so the third super genuinely needs `super=20`. Always confirm by **casting**, not by the screen label.
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

Each row is one tree: the super, its `super_ability` value, and the melee. **All 27 trees are confirmed working in-game — verified by actually casting each super, not just reading the subclass screen** (the screen can mislabel; the cast is the truth).

There are two super models, because the game data differs by subclass:

- **Roaming subclasses (7):** the super is a real socket. `super=10` is the base super (trees 1 & 2 share it), `super=20` is the distinct third super.
- **Guard subclasses (Sentinel, Arcstrider):** only one super socket exists (`super=10`), and the active tree routes its super into it — so the super is **always `super=10`** and the **melee** selects which super. (`super=20` has no socket here, so it breaks. That's why the earlier "unreachable" conclusion was wrong.)

| Subclass | Tree 1 (melee 11) | Tree 2 (melee 15) | Tree 3 (melee 21) |
| --- | --- | --- | --- |
| Striker | Fists of Havoc `s10` ✅ | Fists of Havoc `s10` ✅ | Thundercrash `s20` ✅ |
| Sunbreaker | Hammer of Sol `s10` ✅ | Hammer of Sol `s10` ✅ | Burning Maul `s20` ✅ |
| **Sentinel** | Ward of Dawn `s10` ✅ | Sentinel Shield `s10` ✅ | Banner Shield `s10` ✅ |
| Gunslinger | Golden Gun `s10` ✅ | Golden Gun `s10` ✅ | Blade Barrage `s20` ✅ |
| **Arcstrider** | Arc Staff `s10` ✅ | Arc Staff `s10` ✅ | Whirlwind Guard `s10` ✅ |
| Nightstalker | Shadowshot `s10` ✅ | Shadowshot `s10` ✅ | Spectral Blades `s20` ✅ |
| Dawnblade | Daybreak `s10` ✅ | Daybreak `s10` ✅ | Well of Radiance `s20` ✅ |
| Stormcaller | Stormtrance `s10` ✅ | Stormtrance `s10` ✅ | Chaos Reach `s20` ✅ |
| Voidwalker | Nova Bomb `s10` ✅ | Nova Bomb `s10` ✅ | Nova Warp `s20` ✅ |

*(`s10`/`s20` = the `super_ability` value. Tree names, e.g. "Code of the Missile", are in the tool's picker; on-screen top/mid/bottom position varies per subclass and doesn't matter — the tool keys off ability names, not position. Note: `super_ability` only sets the *actual* super for a real socket — on roaming subclasses `super=10 + melee=21` mislabels itself as the third tree but still casts the base super, so the third super genuinely needs `super=20`.)*

Recovery if a value hangs the game: delete `settings.json` and relaunch (the mod writes a fresh working default).
