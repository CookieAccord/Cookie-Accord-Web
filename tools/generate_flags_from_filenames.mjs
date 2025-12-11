// tools/generate_flags_from_filenames.mjs

import fs from "fs";
import path from "path";

// ---- CONFIG ----

// Where your country names live (one per line)
const INPUT_FILE = path.join("tools", "filenames.txt");

// Where to write the raw flag filenames (for your reference)
const FLAGS_OUT = path.join("tools", "generated_flags.txt");

// Where to write the JSON mapping for the app
const JSON_OUT = path.join("src", "data", "countryFlags.json");

// Default image extension for flags
const FLAG_EXT = ".jpg";

// ---- HELPERS ----

// Turn "Congo, Democratic Republic" into "CongoDemocraticRepublicFlag.jpg"
function makeFlagFileName(countryName) {
  // Remove emoji flags and other non-text at the end
  const noEmoji = countryName.replace(/\p{Extended_Pictographic}/gu, "").trim();

  // Remove parentheses content, e.g., "(Holy See)"
  const noParens = noEmoji.replace(/\(.*?\)/g, "").trim();

  // Remove commas and extra punctuation, keep letters, digits, spaces
  const basic = noParens.replace(/[^A-Za-z0-9\s]/g, "").trim();

  // Split on spaces and join into PascalCase-ish string
  const words = basic.split(/\s+/).filter(Boolean);
  const joined = words.join("");

  // Add "Flag" + extension
  return joined + "Flag" + FLAG_EXT;
}

// ---- MAIN ----

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Could not find ${INPUT_FILE}. Make sure it exists.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT_FILE, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const flagNames = [];
  const mapping = {};

  for (const line of lines) {
    const countryName = line; // keep exactly as written (e.g., "Congo, Democratic Republic")
    const fileName = makeFlagFileName(countryName);

    flagNames.push(fileName);
    mapping[countryName] = "/flags/" + fileName;
  }

  // Write out plain filenames list
  fs.writeFileSync(FLAGS_OUT, flagNames.join("\n"), "utf8");
  console.log(`✔ Wrote flag filenames to ${FLAGS_OUT}`);

  // Write out JSON mapping file
  fs.writeFileSync(JSON_OUT, JSON.stringify(mapping, null, 2), "utf8");
  console.log(`✔ Wrote country → flag path mapping to ${JSON_OUT}`);

  console.log("✨ Done. You can now sync flags and JSON in your app.");
}

main();
