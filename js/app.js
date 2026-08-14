/**
 * Sunrise Loadout Editor — main app.
 *
 * Reads a Sunrise settings.json, lets you pick a Guardian and swap weapons /
 * armour by name (or by pasting a light.gg link), then downloads the edited
 * file. A swap sets the new definition_hash and resets that slot's plugs to
 * null, which tells Sunrise to roll the item's native default perks — the safe
 * way to move to a different item without carrying over incompatible sockets.
 */
(() => {
  const CLASS_NAMES = { 0: "Titan", 1: "Hunter", 2: "Warlock" };

  const WEAPON_SLOTS = ["kinetic", "energy", "heavy"];
  const ARMOR_SLOTS = ["helmet", "gauntlets", "chest", "legs", "class_item"];
  const SLOT_LABELS = { class_item: "Class Item" };

  const DB = window.SUNRISE_ITEM_DB || { weapons: [], armor: [], names: {} };

  // Rich lookup by decimal hash (dropdown items carry element/type/tier).
  const ITEM_BY_DECIMAL = new Map();
  for (const w of DB.weapons) { ITEM_BY_DECIMAL.set(w.decimal, w); }
  for (const a of DB.armor) { ITEM_BY_DECIMAL.set(a.decimal, a); }

  // Complete name lookup: covers every in-build item (all tiers), so any
  // equipped piece resolves even when it isn't in the Legendary/Exotic dropdown.
  const NAMES = DB.names || {};
  function nameForDecimal(decimal) {
    const rich = ITEM_BY_DECIMAL.get(decimal);
    if (rich) { return rich.name; }
    return NAMES[decimal] || NAMES[String(decimal)] || null;
  }

  const state = {
    root: null,
    original: null,
    fileName: "settings.json",
    charIndex: 0,
    changed: new Set(), // "charIndex:slot"
    pending: null, // { charIndex, slot, group, newHash }
    floatKeys: new Set(), // keys whose values must stay floats (e.g. 1.0, not 1)
  };

  const $ = (id) => document.getElementById(id);

  // ---- Load ---------------------------------------------------------------

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const root = JSON.parse(reader.result);
        const chars = root?.state?.characters;
        if (!Array.isArray(chars) || chars.length === 0) {
          throw new Error("No characters found under state.characters.");
        }
        state.root = root;
        state.original = JSON.parse(reader.result);
        state.floatKeys = detectFloatKeys(reader.result);
        state.fileName = file.name || "settings.json";
        state.charIndex = 0;
        state.changed.clear();
        $("loadErr").textContent = "";
        renderClasses();
        renderSlots();
        renderName();
        $("nameCard").classList.remove("hidden");
        $("classCard").classList.remove("hidden");
        $("editCard").classList.remove("hidden");
        $("saveCard").classList.remove("hidden");
      } catch (e) {
        $("loadErr").textContent = "Could not read that file: " + e.message;
      }
    };
    reader.onerror = () => { $("loadErr").textContent = "Failed to read the file."; };
    reader.readAsText(file);
  }

  // ---- Render classes -----------------------------------------------------

  function labelFor(char, index) {
    const name = CLASS_NAMES[char.class] ?? `Class ${char.class}`;
    return `${name}`;
  }

  function renderClasses() {
    const tabs = $("classTabs");
    tabs.innerHTML = "";
    state.root.state.characters.forEach((char, i) => {
      const btn = document.createElement("button");
      btn.className = "tab" + (i === state.charIndex ? " active" : "");
      btn.textContent = labelFor(char, i);
      btn.onclick = () => { state.charIndex = i; renderClasses(); renderSlots(); };
      tabs.appendChild(btn);
    });
  }

  // ---- Guardian name ------------------------------------------------------

  function currentName() {
    return state.root?.steam?.user?.persona_name ?? "";
  }

  function renderName() {
    $("playerName").value = currentName();
    $("nameHint").textContent = "";
  }

  function applyName() {
    if (!state.root) { return; }
    if (!state.root.steam) { state.root.steam = {}; }
    if (!state.root.steam.user) { state.root.steam.user = {}; }
    const value = $("playerName").value.trim() || "Player";
    state.root.steam.user.persona_name = value;
    $("playerName").value = value;
    $("nameHint").className = "hint ok";
    $("nameHint").textContent = `Name set to "${value}" — saved when you download.`;
  }

  // ---- Appearance (per character) -----------------------------------------

  const GENDERS = [{ value: 0, label: "Male" }, { value: 1, label: "Female" }];

  function renderAppearance() {
    const host = $("appearance");
    if (!host) { return; }
    const char = state.root.state.characters[state.charIndex];
    const current = char.gender;
    host.innerHTML = "";

    const label = document.createElement("span");
    label.className = "hint";
    label.style.marginRight = "10px";
    label.textContent = "Body type:";
    host.appendChild(label);

    for (const g of GENDERS) {
      const btn = document.createElement("button");
      btn.className = "tab" + (current === g.value ? " active" : "");
      btn.textContent = g.label;
      btn.onclick = () => {
        char.gender = g.value;
        state.changed.add(`${state.charIndex}:gender`);
        renderAppearance();
      };
      host.appendChild(btn);
    }

    const note = document.createElement("span");
    note.className = "hint";
    note.style.marginLeft = "10px";
    note.textContent = "(saved to the file, but this mod build renders a fixed character model, so it may not change on-screen)";
    host.appendChild(note);
  }

  // ---- Render slots -------------------------------------------------------

  function slotLabel(slot) {
    return SLOT_LABELS[slot] || slot;
  }

  function itemInfo(item) {
    if (!item) { return { name: "(empty)", hash: null, decimal: null, known: false }; }
    const hash = item.definition_hash;
    let decimal = null;
    try { decimal = SunriseHash.toDecimal(hash); } catch (_) { /* leave null */ }
    const name = decimal != null ? nameForDecimal(decimal) : null;
    return {
      name: name || "Unknown item",
      hash,
      decimal,
      known: !!name,
      rec: decimal != null ? ITEM_BY_DECIMAL.get(decimal) : null,
    };
  }

  // ---- Abilities (experimental index tuner) -------------------------------
  // The old subclasses' talent-grid data was removed from Bungie's manifest, so
  // we can't map index -> super by name. These are the raw config ability slots;
  // out-of-range values are safely ignored by the mod (no boot break), so the
  // user can experiment to find supers/abilities.

  // Authoritative ability data extracted from the game files (Sundial catalog):
  // perClass[classType] = { movement:[{v,label}], class_ability:[{v,label}] }
  // bySubclass[UPPERHASH] = { grenade:[{v,label}], attunements:[{name, super:{v,label}, melee:{v,label}}] }
  const AB = window.SUNRISE_ABILITIES || { perClass: {}, bySubclass: {} };

  function subclassHashOf(char) {
    const h = char.equipment && char.equipment.subclass && char.equipment.subclass.definition_hash;
    return typeof h === "string" ? h.toUpperCase() : null;
  }

  /** Name of the super/melee currently set, resolved from the subclass's attunements. */
  function superName(data, v) {
    for (const a of data.attunements) { if (a.super.v === v) { return a.super.label; } }
    return null;
  }
  function meleeName(data, v) {
    for (const a of data.attunements) { if (a.melee.v === v) { return a.melee.label; } }
    return null;
  }

  function setAbilityValue(char, key, value) {
    char[key] = value;
    state.changed.add(`${state.charIndex}:${key}`);
    renderSlots();
  }

  /** An attunement (tree) sets super and melee together — the coherent pair. */
  function setAttunement(char, att) {
    char.super_ability = att.super.v;
    char.melee_ability = att.melee.v;
    state.changed.add(`${state.charIndex}:attunement`);
    renderSlots();
  }

  function abilityLabel(text, changedKey) {
    const changed = changedKey && state.changed.has(`${state.charIndex}:${changedKey}`);
    const lbl = document.createElement("div");
    lbl.className = "slot-name";
    lbl.style.cssText = "font-weight:600;width:150px";
    lbl.innerHTML = escapeHtml(text) + (changed ? ' <span class="badge">changed</span>' : "");
    return lbl;
  }

  /** A row of named option buttons. options: [{v,label}]; onSelect(option). */
  function renderButtonRow(text, changedKey, options, currentValue, onSelect, tooltip) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px";
    row.appendChild(abilityLabel(text, changedKey));
    for (const o of options) {
      const btn = document.createElement("button");
      btn.className = "tab" + (currentValue === o.v ? " active" : "");
      btn.textContent = o.label;
      if (tooltip) { btn.title = tooltip(o); }
      btn.onclick = () => onSelect(o);
      row.appendChild(btn);
    }
    return row;
  }

  /** Read-only display row (used for the super/melee derived from the attunement). */
  function renderInfoRow(text, valueText) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:10px;align-items:center;margin-bottom:6px;opacity:0.8";
    row.appendChild(abilityLabel(text, null));
    const val = document.createElement("span");
    val.className = "slot-current";
    val.innerHTML = `<span class="name">${escapeHtml(valueText)}</span>`;
    row.appendChild(val);
    return row;
  }

  function renderAbilitiesPanel(char) {
    const panel = document.createElement("div");
    panel.style.cssText =
      "background:var(--panel-2);border:1px solid var(--line);border-radius:var(--radius);padding:12px 14px;margin-bottom:10px";

    const note = document.createElement("div");
    note.className = "hint";
    note.style.marginBottom = "10px";
    note.innerHTML = "Pick an <strong>Attunement</strong> (tree) to set your Super + Melee together. " +
      "Grenade, Jump and Class ability are chosen separately.";
    panel.appendChild(note);

    const sub = subclassHashOf(char);
    const data = AB.bySubclass[sub];
    const cls = AB.perClass[char.class];
    if (!data || !cls) {
      const warn = document.createElement("div");
      warn.className = "hint";
      warn.textContent = "(no ability data for this subclass)";
      panel.appendChild(warn);
      return panel;
    }

    // Attunement (sets super + melee)
    const current = data.attunements.find(
      (a) => a.super.v === char.super_ability && a.melee.v === char.melee_ability
    );
    const attRow = document.createElement("div");
    attRow.style.cssText = "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px";
    attRow.appendChild(abilityLabel("Attunement", "attunement"));
    for (const a of data.attunements) {
      const btn = document.createElement("button");
      btn.className = "tab" + (current === a ? " active" : "");
      btn.textContent = a.name;
      btn.title = `Super: ${a.super.label} · Melee: ${a.melee.label}`;
      btn.onclick = () => setAttunement(char, a);
      attRow.appendChild(btn);
    }
    panel.appendChild(attRow);

    // Super + Melee (read-only, derived from the attunement)
    panel.appendChild(renderInfoRow("Super", superName(data, char.super_ability) || `#${char.super_ability}`));
    panel.appendChild(renderInfoRow("Melee", meleeName(data, char.melee_ability) || `#${char.melee_ability}`));

    // Grenade (per subclass)
    panel.appendChild(renderButtonRow("Grenade", "grenade_ability", data.grenade, char.grenade_ability,
      (o) => setAbilityValue(char, "grenade_ability", o.v)));
    // Jump (per class)
    panel.appendChild(renderButtonRow("Jump / movement", "movement_ability", cls.movement, char.movement_ability,
      (o) => setAbilityValue(char, "movement_ability", o.v)));
    // Class ability (per class)
    panel.appendChild(renderButtonRow("Class ability", "class_ability", cls.class_ability, char.class_ability,
      (o) => setAbilityValue(char, "class_ability", o.v)));

    return panel;
  }

  function renderSlots() {
    renderAppearance();
    const container = $("slots");
    container.innerHTML = "";
    const char = state.root.state.characters[state.charIndex];

    const groups = [
      { title: "Subclass", slots: ["subclass"], group: "subclass" },
      { title: "Weapons", slots: WEAPON_SLOTS, group: "weapons" },
      { title: "Armour", slots: ARMOR_SLOTS, group: "armor" },
    ];

    for (const g of groups) {
      const h = document.createElement("div");
      h.className = "slot-group-title";
      h.textContent = g.title;
      container.appendChild(h);

      for (const slot of g.slots) {
        container.appendChild(renderSlotRow(char, slot, g.group));
      }
      if (g.group === "subclass") {
        container.appendChild(renderAbilitiesPanel(char));
      }
    }
  }

  function renderSlotRow(char, slot, group) {
    const item = char.equipment ? char.equipment[slot] : null;
    const info = itemInfo(item);
    const key = `${state.charIndex}:${slot}`;
    const isChanged = state.changed.has(key);

    const row = document.createElement("div");
    row.className = "slot" + (isChanged ? " changed" : "");

    const nameEl = document.createElement("div");
    nameEl.className = "slot-name";
    nameEl.textContent = slotLabel(slot);

    const cur = document.createElement("div");
    cur.className = "slot-current";
    if (info.hash) {
      const nameSpan = info.known
        ? `<span class="name">${escapeHtml(info.name)}</span>`
        : `<span class="name">${escapeHtml(info.name)}</span>`;
      cur.innerHTML = `${nameSpan} · <code>${escapeHtml(info.hash)}</code>` +
        (isChanged ? '<span class="badge">changed</span>' : "");
    } else {
      cur.innerHTML = `<span class="name">(empty)</span>` +
        (isChanged ? '<span class="badge">changed</span>' : "");
    }

    const btn = document.createElement("button");
    btn.className = "ghost";
    btn.textContent = "Change";
    btn.onclick = () => openPicker(slot, group);

    row.appendChild(nameEl);
    row.appendChild(cur);
    row.appendChild(btn);
    return row;
  }

  // ---- Picker modal -------------------------------------------------------

  function openPicker(slot, group) {
    state.pending = { charIndex: state.charIndex, slot, group, newHash: null };
    const char = state.root.state.characters[state.charIndex];

    $("pickTitle").textContent = `Change ${slotLabel(slot)}`;
    $("pickErr").textContent = "";
    $("pickPreview").textContent = "";
    $("pickPaste").value = "";

    // Build the dropdown from the DB, filtered to this slot (and class for armour).
    const select = $("pickSelect");
    select.innerHTML = '<option value="">— choose an item —</option>';
    let options = [];
    if (group === "weapons") {
      options = DB.weapons.filter((w) => w.slot === slot);
    } else if (group === "subclass") {
      options = (DB.subclasses || []).filter((s) => s.class === char.class);
    } else {
      options = DB.armor.filter((a) => a.slot === slot && a.class === char.class);
    }
    options.sort((a, b) => a.name.localeCompare(b.name));
    for (const o of options) {
      const opt = document.createElement("option");
      opt.value = o.hash;
      opt.textContent = o.tier ? `${o.name} — ${o.tier}` : (o.element ? `${o.name} — ${o.element}` : o.name);
      opt.dataset.decimal = o.decimal;
      select.appendChild(opt);
    }
    if (options.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.disabled = true;
      opt.textContent = "(list not populated yet — paste a light.gg link below)";
      select.appendChild(opt);
    }

    $("pickModal").showModal();
  }

  function setPreview(sunriseHash) {
    const name = nameForDecimal(SunriseHash.toDecimal(sunriseHash));
    const url = SunriseHash.lightggUrl(sunriseHash);
    $("pickPreview").innerHTML =
      `Will set <code>${escapeHtml(sunriseHash)}</code>` +
      (name ? ` — <strong>${escapeHtml(name)}</strong>` : "") +
      ` · <a href="${url}" target="_blank" rel="noopener">preview on light.gg</a>`;
  }

  function onSelectChange() {
    const val = $("pickSelect").value;
    $("pickErr").textContent = "";
    if (!val) { state.pending.newHash = null; $("pickPreview").textContent = ""; return; }
    state.pending.newHash = val;
    setPreview(val);
  }

  function onApplyPaste() {
    $("pickErr").textContent = "";
    try {
      const { sunrise } = SunriseHash.parseAnything($("pickPaste").value);
      state.pending.newHash = sunrise;
      $("pickSelect").value = ""; // paste wins
      setPreview(sunrise);
    } catch (e) {
      state.pending.newHash = null;
      $("pickPreview").textContent = "";
      $("pickErr").textContent = e.message;
    }
  }

  function onConfirm() {
    const p = state.pending;
    if (!p || !p.newHash) {
      $("pickErr").textContent = "Pick an item or paste a valid light.gg link / hash first.";
      return;
    }
    applySwap(p.charIndex, p.slot, p.newHash);
    $("pickModal").close();
    renderSlots();
  }

  // ---- Apply a swap -------------------------------------------------------

  /**
   * Sets a slot to a new item hash. Existing slots keep their instance id,
   * level and quantity; empty slots get a freshly minted instance id. Weapons
   * and armour reset plugs to null (native default perks); the subclass keeps
   * its plugs, since its abilities come from the character's own ability entries.
   */
  function applySwap(charIndex, slot, newHash) {
    const char = state.root.state.characters[charIndex];
    if (!char.equipment) { char.equipment = {}; }
    const existing = char.equipment[slot];
    const isSubclass = slot === "subclass";

    if (existing && typeof existing === "object") {
      existing.definition_hash = newHash;
      if (!isSubclass) { existing.plugs = null; }
    } else {
      char.equipment[slot] = {
        instance_soid: mintInstanceSoid(),
        definition_hash: newHash,
        level: 106,
        quantity: 1,
        plugs: null,
      };
    }
    state.changed.add(`${charIndex}:${slot}`);
  }

  /** Mints a unique 64-bit instance id (hex string) not used elsewhere in the file. */
  function mintInstanceSoid() {
    let max = 0n;
    for (const char of state.root.state.characters) {
      const eq = char.equipment || {};
      for (const slot of Object.keys(eq)) {
        const it = eq[slot];
        if (it && typeof it.instance_soid === "string") {
          try {
            const v = BigInt(it.instance_soid);
            if (v > max) { max = v; }
          } catch (_) { /* ignore */ }
        }
      }
    }
    const next = max + 1n;
    return "0x" + next.toString(16).toUpperCase();
  }

  // ---- Save ---------------------------------------------------------------

  function download() {
    const text = serializeConfig(state.root, state.floatKeys);
    const blob = new Blob([text], { type: "application/json" });
    const bytes = blob.size;
    const kb = (bytes / 1024).toFixed(1);

    if (bytes > CONFIG_BYTE_LIMIT) {
      // Sunrise would reject this at boot; don't hand the user a broken file silently.
      $("saveMsg").className = "err";
      $("saveMsg").textContent =
        `File is ${kb} KB, over Sunrise's 64 KB limit — the game would refuse it. Not downloaded. Tell the tool author.`;
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = state.fileName || "settings.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    const n = state.changed.size;
    $("saveMsg").className = "err ok";
    $("saveMsg").textContent = n
      ? `Saved ${n} change${n === 1 ? "" : "s"} (${kb} KB, under the 64 KB limit). Drop it back next to your settings.json.`
      : `Saved (${kb} KB, under the 64 KB limit).`;
  }

  function resetChanges() {
    if (!state.original) { return; }
    state.root = JSON.parse(JSON.stringify(state.original));
    state.changed.clear();
    $("saveMsg").textContent = "";
    renderClasses();
    renderSlots();
    renderName();
  }

  // ---- Float-safe serialization -------------------------------------------
  // Sunrise's strict JSON parser treats 1.0 (float) and 1 (int) as different
  // types. Browsers collapse 1.0 -> 1 when parsing, so JSON.stringify would
  // emit ints where floats are required and the mod fails to boot. We record
  // which keys held float values in the source file and re-emit those as
  // floats on save.

  const FLOAT_KEY_RE = /"([A-Za-z0-9_]+)"\s*:\s*-?\d+\.\d+/g;
  const KNOWN_FLOAT_KEYS = [
    "appearance_value", "ads_sensitivity_modifier", "calibration_primary", "calibration_alpha",
  ];

  function detectFloatKeys(rawText) {
    const set = new Set(KNOWN_FLOAT_KEYS);
    let m;
    FLOAT_KEY_RE.lastIndex = 0;
    while ((m = FLOAT_KEY_RE.exec(rawText)) !== null) { set.add(m[1]); }
    return set;
  }

  // Sunrise reads settings.json into a fixed 64 KB buffer and rejects anything
  // larger ("too_large" -> "Problem reading game content"). Pretty-printing
  // balloons the big arrays past that, so we emit COMPACT JSON (no indentation).
  const CONFIG_BYTE_LIMIT = 64 * 1024;

  /**
   * Serializes the config readably: objects and object-arrays are indented, but
   * arrays of primitives (and arrays of number-pairs) stay on one line so the
   * giant progression arrays don't balloon the file past the 64 KB limit. Float
   * fields keep their decimal (1.0 not 1). Mirrors the mod's own format.
   */
  function serializeConfig(root, floatKeys) {
    const num = (v, key) =>
      (floatKeys.has(key) && Number.isInteger(v)) ? v + ".0" : String(v);

    function ser(val, key, indent) {
      if (val === null) { return "null"; }
      const t = typeof val;
      if (t === "boolean") { return String(val); }
      if (t === "number") { return num(val, key); }
      if (t === "string") { return JSON.stringify(val); }
      if (Array.isArray(val)) {
        // Multiline only when the array holds plain objects; primitive arrays and
        // arrays-of-arrays (number pairs) stay compact on one line.
        const hasObj = val.some((x) => x && typeof x === "object" && !Array.isArray(x));
        if (!hasObj) {
          return "[" + val.map((x) => ser(x, key, indent)).join(", ") + "]";
        }
        const inner = indent + "  ";
        return "[\n" + val.map((x) => inner + ser(x, key, inner)).join(",\n") + "\n" + indent + "]";
      }
      const keys = Object.keys(val);
      if (keys.length === 0) { return "{}"; }
      const inner = indent + "  ";
      return "{\n" +
        keys.map((k) => inner + JSON.stringify(k) + ": " + ser(val[k], k, inner)).join(",\n") +
        "\n" + indent + "}";
    }
    return ser(root, "", "");
  }

  // ---- Utils --------------------------------------------------------------

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  // ---- Wire up ------------------------------------------------------------

  function init() {
    const drop = $("drop");
    const fileInput = $("fileInput");
    drop.onclick = () => fileInput.click();
    fileInput.onchange = () => { if (fileInput.files[0]) { readFile(fileInput.files[0]); } };
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("over"); };
    drop.ondragleave = () => drop.classList.remove("over");
    drop.ondrop = (e) => {
      e.preventDefault();
      drop.classList.remove("over");
      if (e.dataTransfer.files[0]) { readFile(e.dataTransfer.files[0]); }
    };

    $("pickSelect").onchange = onSelectChange;
    $("pickApplyPaste").onclick = onApplyPaste;
    $("pickPaste").onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); onApplyPaste(); } };
    $("pickConfirm").onclick = onConfirm;
    $("pickCancel").onclick = () => $("pickModal").close();

    $("nameApply").onclick = applyName;
    $("playerName").onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); applyName(); } };

    $("downloadBtn").onclick = download;
    $("resetBtn").onclick = resetChanges;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
