import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // keep SECRET, never in browser

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const raw = JSON.parse(fs.readFileSync("./src/data/traditionalCookies.json", "utf8"));

function normPhoto(p) {
  if (!p) return null;
  return p.startsWith("/") ? p : `/${p}`;
}

function mapRow(r) {
  return {
    id: r.id,
    country: r.country ?? null,
    title: r.title ?? null,
    alternate_title: r.alternateTitle ?? null,
    pronounced: r.pronounced ?? null,
    region: r.region ?? null,
    language: r.language ?? null,

    flag_fun_fact: r.flagFunFact ?? null,
    cultural_note: r.culturalNote ?? null,
    birthday_tip: r.birthdayTip ?? null,
    personal_note: r.personalNote ?? null,

    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    instructions: Array.isArray(r.instructions) ? r.instructions : [],

    photo_url: normPhoto(r.photoUrl),
    photo_credits: r.photoCredits ?? null,
    additional_photos: Array.isArray(r.additionalPhotos) ? r.additionalPhotos.map(normPhoto) : [],

    passport_date_baked: r.passportStamp?.dateBaked ?? null,
    passport_shared_with: r.passportStamp?.sharedWith ?? null,
    passport_memory: r.passportStamp?.memory ?? null,

    source: "seed",
    consent: true, // seeds are “approved”
    can_share: true,
  };
}

async function main() {
  const mapped = raw.map(mapRow);
const seen = new Set();
const dups = new Set();
for (const r of mapped) {
  if (!r?.id) continue;
  if (seen.has(r.id)) dups.add(r.id);
  seen.add(r.id);
}
if (dups.size) console.log("Duplicate IDs:", Array.from(dups));

  const byId = new Map();
  for (const row of mapped) {
    if (!row || !row.id) continue;
    if (!byId.has(row.id)) {
      byId.set(row.id, row);
    }
  }
  const rows = Array.from(byId.values());

  console.log(
    `Mapped: ${mapped.length}, Unique IDs after dedupe: ${rows.length}`
  );

  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("recipes")
      .upsert(chunk, { onConflict: "id" });

    if (error) throw error;

    console.log(`Upserted ${i + chunk.length}/${rows.length}`);
  }

  console.log("✅ Done seeding recipes.");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
