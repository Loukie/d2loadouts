/**
 * Item database for the Sunrise loadout editor.
 *
 * Every entry is an item that existed in the last Shadowkeep patch (Season of
 * Arrivals) — the exact build Sunrise runs on — so the picker can only ever
 * offer gear that will actually equip in-game.
 *
 * Loaded as a plain script (not fetched) so the tool works by double-clicking
 * index.html, with no local web server needed.
 *
 * Record shape:
 *   weapons: { name, hash:"0x…", decimal, slot:"kinetic|energy|heavy", element, type, tier }
 *   armor:   { name, hash:"0x…", decimal, slot:"helmet|gauntlets|chest|legs|class_item",
 *              class:0|1|2, tier }
 *
 * This list is generated from the game manifest. Until it is fully populated,
 * the "paste a light.gg link or hash" box in the app covers every item.
 */
window.SUNRISE_ITEM_DB = {
  weapons: [],
  armor: [],
};
