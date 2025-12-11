// tools/build_all_recipes.mjs
// Node script to turn recipes_all.txt into src/data/traditionalCookies.json

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inputPath = path.join(root, "tools", "recipes_all.txt");
const outputPath = path.join(root, "src", "data", "traditionalCookies.json");

// --- helpers ---

function slugify(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD") // strip accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cookie";
}

// remove regional-indicator flag emojis that were showing as weird characters
function stripFlags(str) {
  if (!str) return "";
  return str.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "").trim();
}

function parseBlock(block) {
  const lines = block.split(/\r?\n/);

  const data = {
    country: "",
    title: "",
    pronounced: "",
    alternateTitle: "",
    region: "",
    language: "",
    flagFunFact: "",
    culturalNote: "",
    ingredients: [],
    instructions: [],
    birthdayTip: "",
    personalNote: ""
  };

  let section = null;
  let buffer = [];

  function flushBuffer() {
    if (!section) return;
    const text = buffer.join("\n").trim();
    if (!text) {
      buffer = [];
      return;
    }

    if (section === "Cultural Note") {
      data.culturalNote = text;
    } else if (section === "Flag Fun Fact") {
      data.flagFunFact = text;
    } else if (section === "Ingredients") {
      data.ingredients = text
        .split(/\r?\n/)
        .map(l => l.replace(/^\s*[-•]\s*/, "").trim())
        .filter(Boolean);
    } else if (section === "Instructions" || section === "Steps") {
      data.instructions = text
        .split(/\r?\n/)
        .map(l => l.replace(/^\s*\d+\)?[.)]?\s*/, "").trim())
        .filter(Boolean);
    } else if (section === "Birthday Tip") {
      data.birthdayTip = text;
    } else if (section === "Personal Note") {
      data.personalNote = text;
    }

    buffer = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\u0000/g, ""); // strip any stray NULs just in case

    // Match lines like "Country:" / "Title:" / "Cultural Note:" etc.
    const m = line.match(/^([A-Za-zÀ-ž ’'&]+):\s*(.*)$/);
    if (m) {
      const key = m[1].trim();
      const value = (m[2] || "").trim();

      flushBuffer();
      section = null;

      switch (key) {
        case "Country":
          data.country = value;
          break;
        case "Title":
          data.title = value;
          break;
        case "Pronounced":
          data.pronounced = value;
          break;
        case "Alternate Title":
          data.alternateTitle = value;
          break;
        case "Region":
          data.region = value;
          break;
        case "Language":
          data.language = value;
          break;
        case "Flag Fun Fact":
          section = "Flag Fun Fact";
          if (value) buffer.push(value);
          break;
        case "Cultural Note":
          section = "Cultural Note";
          if (value) buffer.push(value);
          break;
        case "Ingredients":
          section = "Ingredients";
          if (value) buffer.push(value);
          break;
        case "Instructions":
        case "Steps": // treat Steps as Instructions
          section = "Instructions";
          if (value) buffer.push(value);
          break;
        case "Birthday Tip":
          section = "Birthday Tip";
          if (value) buffer.push(value);
          break;
        case "Personal Note":
          section = "Personal Note";
          if (value) buffer.push(value);
          break;
        default:
          // unknown labeled line; ignore for now
          break;
      }
    } else {
      if (section) {
        buffer.push(line);
      }
    }
  }

  flushBuffer();

  const cleanCountry = stripFlags(data.country);
  const id =
    slugify(cleanCountry || data.country || "country") +
    "-" +
    slugify(data.title || "cookie");

  return {
    id,
    country: cleanCountry || data.country || "",
    title: data.title || "Untitled Cookie",
    alternateTitle: data.alternateTitle || "",
    pronounced: data.pronounced || "",
    region: data.region || "",
    language: data.language || "",
    flagFunFact: data.flagFunFact || "",
    culturalNote: data.culturalNote || "",
    ingredients: data.ingredients,
    instructions: data.instructions,
    birthdayTip: data.birthdayTip || "",
    personalNote: data.personalNote || "",
    passportStamp: {
      dateBaked: "",
      sharedWith: "",
      memory: ""
    },
    photoUrl: "",
    photoCredits: "",
    additionalPhotos: []
  };
}

// --- main ---

const txt = fs.readFileSync(inputPath, "utf8");

// split on "=== RECIPE ===" dividers
const blocks = txt
  .split(/^\s*=== RECIPE ===\s*$/m)
  .map(b => b.trim())
  .filter(Boolean);

const recipes = blocks.map(parseBlock);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), "utf8");

console.log(`✅ Built ${recipes.length} recipes → ${outputPath}`);
