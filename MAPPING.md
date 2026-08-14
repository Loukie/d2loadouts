# Subclass ability index map

How the ability numbers in `settings.json` map to in-game abilities.

Originally reverse-engineered by in-game testing, then completed with the
**authoritative game-file data from [Kyle Thompsons Sundial](https://github.com/KyleThmpsn/sundial)** — thanks Kyle! The tool uses an
**Attunement (tree) picker**: each attunement sets `super_ability` + `melee_ability`
together as a coherent pair (setting the super alone breaks variant supers).

## The universal layout

Every subclass uses the same index positions; only the names change.

| Field | Index(es) | What it is |
| --- | --- | --- |
| `class_ability` | 2, 3 | two class abilities (per class) |
| `movement_ability` | 4, 5, 6 | three jumps (per class) |
| `grenade_ability` | 7, 8, 9 | three grenades (per subclass) |
| `super_ability` + `melee_ability` | 10/11 · 10/15 · 20/21 | the 3 attunements (trees); super+melee are a pair |

- `0`–`1` are the sprint/class region — writing there breaks the character.
- Each subclass has **3 attunements**: two share a super (`10`) with different melees (`11`, `15`), the third is `20`/`21`.
- Bad/mismatched values break the character (recover: delete `settings.json`, relaunch).

## Class abilities (`class_ability`, per class)

| Class | 2 | 3 |
| --- | --- | --- |
| Titan | Towering Barricade | Rally Barricade |
| Hunter | Marksman's Dodge | Gambler's Dodge |
| Warlock | Healing Rift | Empowering Rift |

## Jumps (`movement_ability`, per class)

| Class | 4 | 5 | 6 |
| --- | --- | --- | --- |
| Titan | High Lift | Strafe Lift | Catapult Lift |
| Hunter | High Jump | Strafe Jump | Triple Jump |
| Warlock | Strafe Glide | Blink | Burst Glide |

## Grenades (`grenade_ability`, per subclass)

| Subclass | 7 | 8 | 9 |
| --- | --- | --- | --- |
| Striker | Lightning Grenade | Flashbang Grenade | Pulse Grenade |
| Sunbreaker | Fusion Grenade | Incendiary Grenade | Thermite Grenade |
| Sentinel | Suppressor Grenade | Magnetic Grenade | Voidwall Grenade |
| Gunslinger | Tripmine Grenade | Incendiary Grenade | Swarm Grenade |
| Arcstrider | Arcbolt Grenade | Skip Grenade | Flux Grenade |
| Nightstalker | Voidwall Grenade | Vortex Grenade | Spike Grenade |
| Dawnblade | Fusion Grenade | Solar Grenade | Firebolt Grenade |
| Stormcaller | Storm Grenade | Arcbolt Grenade | Pulse Grenade |
| Voidwalker | Scatter Grenade | Vortex Grenade | Axion Bolt |

## Attunements (trees) — sets `super_ability` + `melee_ability`

| Subclass | Attunement | Super | Melee |
| --- | --- | --- | --- |
| Striker | Code of the Earthshaker | Fists of Havoc (10) | Seismic Strike (11) |
| Striker | Code of the Juggernaut | Fists of Havoc (10) | Frontal Assault (15) |
| Striker | Code of the Missile | Thundercrash (20) | Ballistic Slam (21) |
| Sunbreaker | Code of the Fire-Forged | Hammer of Sol (10) | Hammer Strike (11) |
| Sunbreaker | Code of the Siegebreaker | Hammer of Sol (10) | Mortar Blast (15) |
| Sunbreaker | Code of the Devastator | Burning Maul (20) | Throwing Hammer (21) |
| Sentinel | Code of the Protector | Sentinel Shield (10) | Defensive Strike (11) |
| Sentinel | Code of the Aggressor | Sentinel Shield (10) | Shield Bash (15) |
| Sentinel | Code of the Commander | Banner Shield (20) | Tactical Strike (21) |
| Gunslinger | Way of the Outlaw | Golden Gun (10) | Proximity Explosive Knife (11) |
| Gunslinger | Way of the Sharpshooter | Golden Gun (10) | Weighted Knife (15) |
| Gunslinger | Way of a Thousand Cuts | Blade Barrage (20) | Knife Trick (21) |
| Arcstrider | Way of the Warrior | Arc Staff (10) | Combination Blow (11) |
| Arcstrider | Way of the Wind | Arc Staff (10) | Disorienting Blow (15) |
| Arcstrider | Way of the Current | Whirlwind Guard (20) | Tempest Strike (21) |
| Nightstalker | Way of the Trapper | Shadowshot (10) | Snare Bomb (11) |
| Nightstalker | Way of the Pathfinder | Shadowshot (10) | Vanish in Smoke (15) |
| Nightstalker | Way of the Wraith | Spectral Blades (20) | Corrosive Smoke (21) |
| Dawnblade | Attunement of Sky | Daybreak (10) | Celestial Fire (11) |
| Dawnblade | Attunement of Flame | Daybreak (10) | Igniting Touch (15) |
| Dawnblade | Attunement of Grace | Well of Radiance (20) | Guiding Flame (21) |
| Stormcaller | Attunement of Conduction | Stormtrance (10) | Chain Lightning (11) |
| Stormcaller | Attunement of the Elements | Stormtrance (10) | Rising Storm (15) |
| Stormcaller | Attunement of Control | Chaos Reach (20) | Ball Lightning (21) |
| Voidwalker | Attunement of Chaos | Nova Bomb (10) | Entropic Pull (11) |
| Voidwalker | Attunement of Hunger | Nova Bomb (10) | Devour (15) |
| Voidwalker | Attunement of Fission | Nova Warp (20) | Atomic Breach (21) |

Recovery if the game hangs: delete `settings.json` and relaunch (the mod writes a fresh working default).
