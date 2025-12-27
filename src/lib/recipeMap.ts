src/
  lib/
    recipeMap.ts   ← all mapping + parsing logic
  types/
    recipe.ts      ← CookieRow type (optional but nice)
  pages/
  components/

  // src/lib/recipeMap.ts

import type { CookieRow } from "../types/CookieRow";

export type RecipeRowDB = {
  id: string;
  country: string;
  title: string;
  story?: string | null;

  alternate_title?: string | null;
  pronounced?: string | null;
  region?: string | null;
  language?: string | null;

  flag_fun_fact?: string | null;
  cultural_note?: string | null;
  birthday_tip?: string | null;
  personal_note?: string | null;

  ingredients?: string | null;
  instructions?: string | null;

  photo_url?: string | null;
  photo_credits?: string | null;
  additional_photos?: string | null;

  passport_date_baked?: string | null;
  passport_shared_with?: string | null;
  passport_memory?: string | null;

  created_at?: string | null;
  user_id?: string | null;
};

export function parseTextList(v?: string | null): string[] | undefined {
  if (!v) return undefined;

  const s = v.trim();
  if (!s) return undefined;

  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parsed.map(x => String(x).trim()).filter(Boolean);
      }
    } catch {}
  }

  return s
    .split(/\r?\n|•/g)
    .map(x => x.trim())
    .filter(Boolean);
}

export function mapDbToCookieRow(r: RecipeRowDB): CookieRow {
  return {
    id: r.id,
    country: r.country,
    title: r.title,
    story: r.story ?? undefined,

    alternateTitle: r.alternate_title ?? undefined,
    pronounced: r.pronounced ?? undefined,
    region: r.region ?? undefined,
    language: r.language ?? undefined,

    flagFunFact: r.flag_fun_fact ?? undefined,
    culturalNote: r.cultural_note ?? undefined,
    birthdayTip: r.birthday_tip ?? undefined,
    personalNote: r.personal_note ?? undefined,

    ingredients: parseTextList(r.ingredients),
    steps: parseTextList(r.instructions),

    photoUrl: r.photo_url ?? undefined,
    photoCredits: r.photo_credits ?? undefined,
    additionalPhotos: parseTextList(r.additional_photos),

    dateBaked: r.passport_date_baked ?? undefined,
    sharedWith: r.passport_shared_with ?? undefined,
    memory: r.passport_memory ?? undefined,
  };
}
