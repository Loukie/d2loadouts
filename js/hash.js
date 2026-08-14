/**
 * Hash conversion helpers for Sunrise loadout editing.
 *
 * Sunrise stores every item as its Destiny manifest hash, written in
 * hexadecimal with a "0x" prefix, e.g. "0xE516CF40". That number is the
 * SAME value light.gg shows in its URL (light.gg/db/items/<decimal>). There
 * is no byte-swapping — confirmed from the mod's own JSON parser, which reads
 * the field as a plain unsigned 32-bit integer.
 *
 * So the whole conversion is: decimal <-> hex, plus a "0x" prefix.
 */
const SunriseHash = (() => {
  const U32_MAX = 0xffffffff;

  /** Formats a number as the canonical Sunrise hash string: "0x" + 8 upper-hex digits. */
  function toSunrise(decimal) {
    const n = Number(decimal);
    if (!Number.isInteger(n) || n < 0 || n > U32_MAX) {
      throw new Error(`Not a valid 32-bit item hash: ${decimal}`);
    }
    return "0x" + n.toString(16).toUpperCase().padStart(8, "0");
  }

  /** Parses a "0x…" (or bare hex) Sunrise hash string back to a decimal number. */
  function toDecimal(sunriseHash) {
    if (typeof sunriseHash !== "string") {
      throw new Error("Expected a hash string");
    }
    const cleaned = sunriseHash.trim().replace(/^0x/i, "");
    const n = parseInt(cleaned, 16);
    if (!Number.isInteger(n) || n < 0 || n > U32_MAX) {
      throw new Error(`Not a valid hex item hash: ${sunriseHash}`);
    }
    return n;
  }

  /**
   * Accepts anything a user might paste — a light.gg URL, a raw decimal hash,
   * or an already-formatted "0x…" hex string — and returns { decimal, sunrise }.
   * This is the single entry point the UI uses so users never think about format.
   */
  function parseAnything(input) {
    if (input === null || input === undefined) {
      throw new Error("Nothing to parse");
    }
    let text = String(input).trim();
    if (text === "") {
      throw new Error("Nothing to parse");
    }

    // light.gg / any URL containing /items/<digits>
    const urlMatch = text.match(/items\/(\d+)/i);
    if (urlMatch) {
      const decimal = Number(urlMatch[1]);
      return { decimal, sunrise: toSunrise(decimal) };
    }

    // explicit hex ("0x…")
    if (/^0x[0-9a-f]+$/i.test(text)) {
      const decimal = toDecimal(text);
      return { decimal, sunrise: toSunrise(decimal) };
    }

    // bare decimal
    if (/^\d+$/.test(text)) {
      const decimal = Number(text);
      return { decimal, sunrise: toSunrise(decimal) };
    }

    // bare hex without prefix (last resort — only if it looks like 8 hex digits)
    if (/^[0-9a-f]{1,8}$/i.test(text)) {
      const decimal = parseInt(text, 16);
      return { decimal, sunrise: toSunrise(decimal) };
    }

    throw new Error(`Could not read a hash from: "${input}"`);
  }

  /** Builds the light.gg link for a Sunrise hash so users can preview an item. */
  function lightggUrl(sunriseHash) {
    return `https://www.light.gg/db/items/${toDecimal(sunriseHash)}/`;
  }

  return { toSunrise, toDecimal, parseAnything, lightggUrl };
})();
