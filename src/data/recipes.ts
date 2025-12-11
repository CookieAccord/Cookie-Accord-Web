// src/data/recipes.ts
export type Recipe = {
  id: string;
  name: string;
  country: string;
  photoUrl?: string;
  ingredients: string;
  steps: string;
};

const STORAGE_KEY = "cookie-accord-recipes";

const seedRecipes: Recipe[] = [
  {
    id: "seed-mammoth",
    name: "Mammoth Lower Lip Fuzz Cookies",
    country: "USA (Old Neighborhood)",
    photoUrl: "",
    ingredients: "- Coconut shreds\n- Butter\n- Sugar\n- Flour\n- Vanilla\n- A sense of adventure",
    steps:
      "Mix everything into a shaggy dough blob.\nDrop spoonfuls onto a baking sheet.\nBake until the edges are golden and the coconut looks slightly fuzzy.\nLet cool just enough to wonder if it's safe.\nTake a brave bite.",
  },
];

export function loadRecipes(): Recipe[] {
  if (typeof window === "undefined") return seedRecipes;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedRecipes;

  try {
    const parsed = JSON.parse(raw) as Recipe[];
    return parsed.length ? parsed : seedRecipes;
  } catch {
    return seedRecipes;
  }
}

export function saveRecipes(recipes: Recipe[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}
