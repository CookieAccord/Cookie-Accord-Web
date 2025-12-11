import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Cookie, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
const SEED_RECIPES = [
    {
        id: "mammoth-lower-lip-fuzz-recipe",
        title: "Mammoth Lower Lip Fuzz Cookies",
        country: "United States",
        ingredients: ["Flour", "Butter", "Sugar", "Magic mammoth energy"],
        steps: ["Mix dough", "Shape with love", "Bake until golden"],
        photoUrl: "",
    },
];
// For quickly checking if a recipe is a seed (non-deletable)
const SEED_IDS = new Set(SEED_RECIPES.map((r) => r.id));
// Helper functions for user-submitted recipes in localStorage
function loadRecipes() {
    try {
        const raw = window.localStorage.getItem("cookie-recipes");
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function saveRecipes(recipes) {
    try {
        window.localStorage.setItem("cookie-recipes", JSON.stringify(recipes));
    }
    catch {
        // ignore storage errors
    }
}
export default function RecipeGallery() {
    const [recipes, setRecipes] = useState(SEED_RECIPES);
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        try {
            const extra = loadRecipes();
            if (extra && extra.length) {
                setRecipes([...SEED_RECIPES, ...extra]);
            }
        }
        catch {
            // ignore JSON errors
        }
    }, []);
    // 🗑️ Delete only user-submitted recipes
    function deleteRecipe(id) {
        if (!id)
            return; // prevents accidental mass deletion
        const existing = loadRecipes(); // just user recipes
        const filtered = existing.filter((r) => r.id !== id);
        saveRecipes(filtered);
        // Rebuild display list: seeds + remaining user recipes
        setRecipes([...SEED_RECIPES, ...filtered]);
    }
    return (_jsxs(_Fragment, { children: [_jsx("main", { className: "min-h-dvh bg-gradient-to-b from-amber-50 via-white to-emerald-50", children: _jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8", children: [_jsxs("header", { className: "mb-6 flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "flex items-center gap-2 text-2xl font-semibold text-stone-900", children: [_jsx(Utensils, { className: "h-6 w-6 text-amber-600" }), "Recipe Gallery"] }), _jsx("p", { className: "mt-1 text-sm text-stone-600", children: "Browse shared recipes from Cookie Accord bakers." })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "hidden items-center gap-2 rounded-2xl border border-amber-100 bg-white px-3 py-2 text-xs text-stone-600 sm:flex", children: [_jsx(Cookie, { className: "h-4 w-4 text-amber-500" }), _jsxs("span", { children: [recipes.length, " recipes & rising"] })] }), _jsx(Link, { to: "/", className: "rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm hover:bg-amber-50", children: "\u2190 Back to Cookies" })] })] }), recipes.length === 0 ? (_jsx("p", { className: "text-sm text-stone-600", children: "No recipes yet. Share one from the Home page or Share Your Story." })) : (_jsx("div", { className: "space-y-4", children: recipes.map((r) => (_jsxs("article", { className: "rounded-3xl border border-amber-100 bg-white/90 p-4 shadow-sm", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-semibold text-stone-900", children: r.title }), _jsx("span", { className: "rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-stone-700", children: r.country || "Somewhere" })] }), !SEED_IDS.has(r.id) && (_jsx("button", { onClick: () => deleteRecipe(r.id), className: "text-xs text-red-500 hover:text-red-700 ml-2", children: "delete" }))] }), r.photoUrl && (_jsx("div", { className: "mb-3 h-32 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50", children: _jsx("img", { src: r.photoUrl, alt: r.title, className: "h-full w-full object-cover" }) })), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500", children: "Ingredients" }), r.ingredients && r.ingredients.length > 0 ? (_jsx("ul", { className: "list-disc pl-4 text-xs text-stone-700", children: r.ingredients.map((ing, i) => (_jsx("li", { children: ing }, i))) })) : (_jsx("p", { className: "text-xs text-stone-500", children: "(No ingredients listed yet.)" }))] }), _jsxs("div", { children: [_jsx("h3", { className: "mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500", children: "Steps" }), r.steps && r.steps.length > 0 ? (_jsx("ol", { className: "list-decimal pl-4 text-xs text-stone-700", children: r.steps.map((step, i) => (_jsx("li", { children: step }, i))) })) : (_jsx("p", { className: "text-xs text-stone-500", children: "(No steps listed yet.)" }))] })] })] }, r.id))) }))] }) }), _jsx(Footer, {})] }));
}
