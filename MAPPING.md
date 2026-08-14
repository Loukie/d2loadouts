# Subclass ability index map

How the ability numbers in `settings.json` map to in-game abilities, reverse-engineered by testing.

## The universal layout

Every subclass uses the **same index positions** — only the names change per subclass. The character fields are:

| Field (`settings.json`) | Index(es) | What it is |
| --- | --- | --- |
| `class_ability` | **2, 3** | the two class abilities (per class) |
| `movement_ability` | **4, 5, 6** | the three jumps (per class) |
| `grenade_ability` | **7, 8, 9** | the three grenades (per subclass) |
| `super_ability` | **10, 20** | the two supers (per subclass) |
| `melee_ability` | **11** | tree-bound — do not change (breaks) |

Notes / findings:
- **0–1** are the sprint/class region — setting anything there breaks the character (→ stuck loading / class-select).
- Each tree occupies a ~10-index block: super at the front (10, then 20), then melee, then perk nodes (12–19, etc.). Pointing `super_ability` at a perk node breaks the boot.
- **Super**: exactly two distinct supers per subclass. `10` = the common super (shared by two trees), `20` = the middle-tree super. A subclass's third tree reuses the common super, so there is no third super to select.
- **Melee is tree-bound**: only the active tree loads, so `11` is the only valid melee. Changing it breaks the boot.
- **Bad values are NOT ignored** — most out-of-range/wrong values break the character and drop you to the character-creation screen (recover: delete `settings.json` and relaunch).

Legend: ✅ confirmed in-game · ⚠️ best-guess (verify)

## Class abilities — `class_ability` (per class)

| Class | 2 | 3 |
| --- | --- | --- |
| Titan | Towering Barricade ✅ | Rally Barricade ✅ |
| Hunter | Marksman's Dodge ✅ | Gambler's Dodge ✅ |
| Warlock | Healing Rift ⚠️ | Empowering Rift ⚠️ |

## Jumps — `movement_ability` (per class)

| Class | 4 | 5 | 6 |
| --- | --- | --- | --- |
| Titan | High Lift ✅ | Strafe Lift ✅ | Catapult Lift ✅ |
| Hunter | High Jump ✅ | Strafe Jump ✅ | Triple Jump ✅ |
| Warlock | Strafe Glide ⚠️ | Burst Glide ⚠️ | Balanced Glide ⚠️ |

## Grenades — `grenade_ability` (per subclass)

| Subclass | 7 | 8 | 9 |
| --- | --- | --- | --- |
| Striker | Lightning ✅ | Flashbang ✅ | Pulse ✅ |
| Sunbreaker | Incendiary ⚠️ | Fusion ⚠️ | Thermite ⚠️ |
| Sentinel | Magnetic ⚠️ | Voidwall ⚠️ | Suppressor ⚠️ |
| Gunslinger | Tripmine ✅ | Incendiary ✅ | Swarm ✅ |
| Arcstrider | Arcbolt ⚠️ | Flux ⚠️ | Skip ⚠️ |
| Nightstalker | Spike ⚠️ | Voidwall ⚠️ | Vortex ⚠️ |
| Dawnblade | Solar ⚠️ | Firebolt ⚠️ | Fusion ⚠️ |
| Stormcaller | Arcbolt ⚠️ | Pulse ⚠️ | Storm ⚠️ |
| Voidwalker | Vortex ⚠️ | Scatter ⚠️ | Axion Bolt ⚠️ |

## Supers — `super_ability` (per subclass)

| Subclass | 10 (common) | 20 (middle tree) |
| --- | --- | --- |
| Striker | Fists of Havoc ✅ | Thundercrash ✅ |
| Sunbreaker | Hammer of Sol ✅ | Burning Maul ✅ |
| Sentinel | Sentinel Shield ⚠️ | Banner Shield ⚠️ |
| Gunslinger | Golden Gun ✅ | Blade Barrage ✅ |
| Arcstrider | Arc Staff ⚠️ | Whirlwind Guard ⚠️ |
| Nightstalker | Shadowshot ⚠️ | Spectral Blades ⚠️ |
| Dawnblade | Daybreak ⚠️ | Well of Radiance ⚠️ |
| Stormcaller | Stormtrance ⚠️ | Chaos Reach ⚠️ |
| Voidwalker | Nova Bomb ⚠️ | Nova Warp ⚠️ |

## How to verify (quick loop)

For each subclass, swap to it in the tool, then confirm the names by changing one number at a time:
1. **Grenade** 7 → 8 → 9, read the grenade name each time.
2. **Super** 20 (10 is the default), read the tree/super name.
3. Report any that differ and the ⚠️ becomes ✅.

Recovery if a value hangs the game: delete `settings.json` and relaunch (the mod writes a fresh working default).
