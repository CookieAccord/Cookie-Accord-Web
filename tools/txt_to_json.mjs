// tools/txt_to_json.mjs
import fs from "node:fs";
import path from "node:path";

/**
 * Usage:
 *   node tools/txt_to_json.mjs tools/recipes_all.txt > src/data/traditionalCookies.json
 *
 * The .txt file should contain blocks like:
 *
 * === RECIPE ===
 * Country: Cabo Verde 🇨🇻
 * PhotoUrl:
 * PhotoCredits:
 * AdditionalPhotos:
 * Title: Bolachas de Coco
 * Pronounced: boh-LAH-shahs jee KOH-koo
 * Alternate Title: Cape Verdean Coconut Cookies
 * Region:
 * Language:
 * Cultural Note:
 *   (multi-line ok)
 * Ingredients:
 * - item 1
 * - item 2
 * Instructions:
 * 1) step one
 * 2) step two
 * Birthday Tip:
 * Personal Note:
 * Passport Stamp:
 * Date baked:
 * Shared with:
 * Memory:
 */

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node tools/txt_to_json.mjs <input.txt>");
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");

// Split by recipe blocks
const blocks = raw
  .split(/===\s*RECIPE\s*===/g)
  .map((b) => b.trim())
  .filter(Boolean);

const HEADER_KEYS = [
  "Country:",
  "PhotoUrl:",
  "PhotoCredits:",
  "AdditionalPhotos:",
  "Title:",
  "Pronounced:",
  "Alternate Title:",
  "Region:",
  "Language:",
  "Cultural Note:",
  "Ingredients:",
  "Instructions:",
  "Birthday Tip:",
  "Personal Note:",
  "Passport Stamp:",
  "Date baked:",
  "Shared with:",
  "Memory:",
];

function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseBlock(block) {
  const lines = block.split(/\r?\n/);

  const recipe = {
    id: "",
    country: "",
    title: "",
    alternateTitle: "",
    pronounced: "",
    region: "",
    language: "",
    culturalNote: "",
    ingredients: [],
    instructions: [],
    birthdayTip: "",
    personalNote: "",
    passportStamp: {
      dateBaked: "",
      sharedWith: "",
      memory: "",
    },
    photoUrl: "",
    photoCredits: "",
    additionalPhotos: [],
    flagFunFact: "", // optional, can be filled later
  };

  let currentField = null;

  const isHeaderLine = (t) => HEADER_KEYS.some((h) => t.startsWith(h));

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect header first
    const header = HEADER_KEYS.find((h) => trimmed.startsWith(h));
    if (header) {
      const value = trimmed.slice(header.length).trim();
      switch (header) {
        case "Country:":
          recipe.country = value;
          currentField = "country";
          break;
        case "PhotoUrl:":
          recipe.photoUrl = value;
          currentField = "photoUrl";
          break;
        case "PhotoCredits:":
          recipe.photoCredits = value;
          currentField = "photoCredits";
          break;
        case "AdditionalPhotos:":
          // could be comma-separated list later
          recipe.additionalPhotos = value
            ? value.split(",").map((v) => v.trim()).filter(Boolean)
            : [];
          currentField = "additionalPhotos";
          break;
        case "Title:":
          recipe.title = value;
          currentField = "title";
          break;
        case "Pronounced:":
          recipe.pronounced = value;
          currentField = "pronounced";
          break;
        case "Alternate Title:":
          recipe.alternateTitle = value;
          currentField = "alternateTitle";
          break;
        case "Region:":
          recipe.region = value;
          currentField = "region";
          break;
        case "Language:":
          recipe.language = value;
          currentField = "language";
          break;
        case "Cultural Note:":
          currentField = "culturalNote";
          if (value) {
            recipe.culturalNote = value;
          }
          break;
        case "Ingredients:":
          currentField = "ingredients";
          if (!Array.isArray(recipe.ingredients)) {
            recipe.ingredients = [];
          }
          break;
        case "Instructions:":
          currentField = "instructions";
          if (!Array.isArray(recipe.instructions)) {
            recipe.instructions = [];
          }
          break;
        case "Birthday Tip:":
          currentField = "birthdayTip";
          if (value) {
            recipe.birthdayTip = value;
          }
          break;
        case "Personal Note:":
          currentField = "personalNote";
          if (value) {
            recipe.personalNote = value;
          }
          break;
        case "Passport Stamp:":
          // marker only; next three headers fill passportStamp
          currentField = null;
          break;
        case "Date baked:":
          recipe.passportStamp.dateBaked = value;
          currentField = "passportDate";
          break;
        case "Shared with:":
          recipe.passportStamp.sharedWith = value;
          currentField = "passportShared";
          break;
        case "Memory:":
          recipe.passportStamp.memory = value;
          currentField = "passportMemory";
          break;
        default:
          currentField = null;
      }
      continue;
    }

    // Not a header: treat as continuation of currentField
    if (currentField === "culturalNote") {
      recipe.culturalNote = recipe.culturalNote
        ? recipe.culturalNote + "\n" + trimmed
        : trimmed;
    } else if (currentField === "birthdayTip") {
      recipe.birthdayTip = recipe.birthdayTip
        ? recipe.birthdayTip + "\n" + trimmed
        : trimmed;
    } else if (currentField === "personalNote") {
      recipe.personalNote = recipe.personalNote
        ? recipe.personalNote + "\n" + trimmed
        : trimmed;
    } else if (currentField === "ingredients") {
      if (trimmed.startsWith("-")) {
        recipe.ingredients.push(trimmed.slice(1).trim());
      } else {
        // continuation of previous ingredient line
        if (recipe.ingredients.length === 0) {
          recipe.ingredients.push(trimmed);
        } else {
          recipe.ingredients[recipe.ingredients.length - 1] += " " + trimmed;
        }
      }
    } else if (currentField === "instructions") {
      const m = trimmed.match(/^\d+\)\s*(.*)$/);
      if (m) {
        recipe.instructions.push(m[1].trim());
      } else {
        if (recipe.instructions.length === 0) {
          recipe.instructions.push(trimmed);
        } else {
          recipe.instructions[recipe.instructions.length - 1] +=
            " " + trimmed;
        }
      }
    } else if (currentField === "country") {
      recipe.country = recipe.country
        ? recipe.country + " " + trimmed
        : trimmed;
    } else if (currentField === "title") {
      recipe.title = recipe.title ? recipe.title + " " + trimmed : trimmed;
    } else if (currentField === "alternateTitle") {
      recipe.alternateTitle = recipe.alternateTitle
        ? recipe.alternateTitle + " " + trimmed
        : trimmed;
    } else if (currentField === "photoUrl") {
      recipe.photoUrl = recipe.photoUrl
        ? recipe.photoUrl + " " + trimmed
        : trimmed;
    } else if (currentField === "photoCredits") {
      recipe.photoCredits = recipe.photoCredits
        ? recipe.photoCredits + " " + trimmed
        : trimmed;
    } else if (currentField === "additionalPhotos") {
      // extra lines as more photo URLs
      const more = trimmed
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      recipe.additionalPhotos.push(...more);
    } else if (currentField === "region") {
      recipe.region = recipe.region ? recipe.region + " " + trimmed : trimmed;
    } else if (currentField === "language") {
      recipe.language = recipe.language
        ? recipe.language + " " + trimmed
        : trimmed;
    } else if (currentField === "pronounced") {
      recipe.pronounced = recipe.pronounced
        ? recipe.pronounced + " " + trimmed
        : trimmed;
    } else if (currentField === "passportDate") {
      recipe.passportStamp.dateBaked = recipe.passportStamp.dateBaked
        ? recipe.passportStamp.dateBaked + " " + trimmed
        : trimmed;
    } else if (currentField === "passportShared") {
      recipe.passportStamp.sharedWith = recipe.passportStamp.sharedWith
        ? recipe.passportStamp.sharedWith + " " + trimmed
        : trimmed;
    } else if (currentField === "passportMemory") {
      recipe.passportStamp.memory = recipe.passportStamp.memory
        ? recipe.passportStamp.memory + " " + trimmed
        : trimmed;
    }
  }

  // Build id from country + title
  const countrySlug = slugify(recipe.country || "country");
  const titleSlug = slugify(recipe.title || "cookie");
  recipe.id = `${countrySlug}-${titleSlug}`;

  return recipe;
}

const recipes = blocks.map(parseBlock);

// Optional: sort by country name (ignoring emoji)
recipes.sort((a, b) => {
  const ca = (a.country || "").replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim();
  const cb = (b.country || "").replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim();
  return ca.localeCompare(cb);
});

// Output pretty JSON to stdout (so you can use > redirect)
process.stdout.write(JSON.stringify(recipes, null, 2) + "\n");
