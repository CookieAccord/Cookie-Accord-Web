import React, { useEffect, useState } from "react";
import { Cookie, Utensils } from "lucide-react";
import { Link } from "react-router-dom";


type RecipeItem = {
  id: string;
  title: string;
  country: string;
  ingredients?: string[];
  steps?: string[];
  photoUrl?: string;
  story?: string; // "Why this cookie matters"
};

const SEED_RECIPES: RecipeItem[] = [
  {
    id: "mammoth-lower-lip-fuzz-recipe",
    title: "Mammoth Lower Lip Fuzz Cookies",
    country: "United States",
    ingredients: [
      "2¼ cups all-purpose flour",
      "1 teaspoon baking soda",
      "½ teaspoon baking powder",
      "½ teaspoon fine salt",
      "1 cup (2 sticks) unsalted butter, softened",
      "1 cup packed brown sugar",
      "½ cup granulated sugar",
      "2 large eggs",
      "2 teaspoons vanilla extract",
      "1½ cups rolled oats",
      "1/2 cup coarsely chopped mixed nuts",
      "1/2 cup shredded coconut",
      "1/2 cup dried coarsely chopped dried fruit of your choice",
      "1½ cups chocolate chips or chunks",
      "Powdered sugar, for dusting the “fuzz”",
    ],
    steps: [
      "Preheat oven to 350°F (175°C). Line 2 baking sheets with parchment paper.",
      "In a medium bowl, whisk together the flour, baking soda, baking powder, and salt.",
      "In a large bowl, cream the butter, brown sugar, and granulated sugar until light and fluffy.",
      "Beat in the eggs one at a time, then mix in the vanilla.",
      "Stir the dry ingredients into the butter mixture just until combined.",
      "Fold in the oats, chocolate chips or chunks, fruit and nuts.",
      "Scoop heaping tablespoons of dough onto the prepared sheets, leaving space for spreading.",
      "Bake 10–12 minutes, until the edges are golden and the centers look just set.",
      "Cool on the pan for a few minutes, then move to a rack to cool completely.",
      "Dust generously with powdered sugar so every cookie wears its own little “mammoth lower lip fuzz.”",
    ],
    photoUrl: "",
  },
];

// For quickly checking if a recipe is a seed (non-deletable)
const SEED_IDS = new Set(SEED_RECIPES.map((r) => r.id));
const USER_RECIPES_KEY = "cookie-accord-user-recipes"; // use the same string you used in RecipeGallery.tsx

// Helper functions for user-submitted recipes in localStorage
function loadRecipes(): RecipeItem[] {
  try {
    const raw = window.localStorage.getItem(USER_RECIPES_KEY);
    return raw ? (JSON.parse(raw) as RecipeItem[]) : [];
  } catch {
    return [];
  }
}

function saveRecipes(recipes: RecipeItem[]) {
  try {
    window.localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(recipes));
  } catch {
    // ignore storage errors
  }
}

export default function RecipeGallery() {
  const [recipes, setRecipes] = useState<RecipeItem[]>(SEED_RECIPES);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const extra = loadRecipes();
      if (extra && extra.length) {
        setRecipes([...SEED_RECIPES, ...extra]);
      }
    } catch {
      // ignore JSON errors
    }
  }, []);

  // 🗑️ Delete only user-submitted recipes
  function deleteRecipe(id: string) {
    if (!id) return; // prevents accidental mass deletion
    const existing = loadRecipes(); // just user recipes
    const filtered = existing.filter((r) => r.id !== id);
    saveRecipes(filtered);

    // Rebuild display list: seeds + remaining user recipes
    setRecipes([...SEED_RECIPES, ...filtered]);
  }

  return (
    <>
      <main className="min-h-dvh bg-gradient-to-b from-amber-50 via-white to-emerald-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold text-stone-900">
                <Utensils className="h-6 w-6 text-amber-600" />
                Recipe Gallery
              </h1>
              <p className="mt-1 text-sm text-stone-600">
                Browse recipes shared by Cookie Accord bakers — more coming as the community grows.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
              <div className="hidden items-center gap-2 rounded-2xl border border-amber-100 bg-white px-3 py-2 text-xs text-stone-600 sm:flex">
                <Cookie className="h-4 w-4 text-amber-500" />
                <span>{recipes.length} recipes & rising</span>
              </div>
              <Link
                to="/"
                className="rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm hover:bg-amber-50"
              >
                ← Back to Cookies
              </Link>
            </div>
          </header>

          {recipes.length === 0 ? (
            <p className="text-sm text-stone-600">
              No recipes yet. Share one from the Home page or Share Your Story.
            </p>
          ) : (
            <div className="space-y-4">
              {recipes.map((r) => (
                <article
                  key={r.id}
                  className="rounded-3xl border border-amber-100 bg-white/90 p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-stone-900">
                        {r.title}
                      </h2>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-stone-700">
                        {r.country || "Somewhere"}
                      </span>
                    </div>

                    {/* 🗑️ Delete button for user recipes only (not seeds) */}
                    {!SEED_IDS.has(r.id) && (
                      <button
                        onClick={() => deleteRecipe(r.id)}
                        className="text-xs text-red-500 hover:text-red-700 ml-2"
                      >
                        delete
                      </button>
                    )}
                  </div>

                  {r.photoUrl && (
                    <div className="mb-3 h-32 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50">
                      <img
                        src={r.photoUrl}
                        alt={r.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Ingredients
                      </h3>
                      {r.ingredients && r.ingredients.length > 0 ? (
                        <ul className="list-disc pl-4 text-xs text-stone-700">
                          {r.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-stone-500">
                          (No ingredients listed yet.)
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Steps
                      </h3>
                      {r.steps && r.steps.length > 0 ? (
                        <ol className="list-decimal pl-4 text-xs text-stone-700">
                          {r.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-xs text-stone-500">
                          (No steps listed yet.)
                        </p>
                      )}
                    </div>
                  </div>
                  {r.story && (
  <div className="mt-3">
    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
      Why this cookie matters
    </h3>
    <p className="text-xs text-stone-700 whitespace-pre-wrap break-words">
      {r.story}
    </p>
  </div>
)}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

       </>
  );
}
