Sunrise Loadout Editor
======================

A small offline tool for the Sunrise Destiny 2 exploration mod. Edit the
weapons and armour on your characters without touching hashes by hand.

HOW TO USE
----------
1. Open index.html in any browser (just double-click it).
2. Drop in your Sunrise settings.json.
3. Pick a Guardian (Titan / Hunter / Warlock).
4. Click "Change" on any weapon or armour slot.
   - Pick from the list, OR paste a light.gg link / hash.
5. Click "Download settings.json" and put it back where your file lives.

Everything runs in your browser. Nothing is uploaded anywhere.

WHY IT'S SAFE
-------------
- Items are stored as their real item hash (the same number light.gg shows,
  just in hex with a "0x" in front). The tool does that conversion for you.
- When you swap an item, its perk sockets ("plugs") are reset to the item's
  native defaults, so you never carry over perks that don't fit the new item.
- The picker only offers items that existed in this build of the game.

FILES
-----
index.html          the app
css/style.css       styling
js/hash.js          hash <-> hex conversion
js/app.js           app logic
data/items.js       the item list (name -> hash)

Not affiliated with Bungie. You must own/provide your own copy of the game.
