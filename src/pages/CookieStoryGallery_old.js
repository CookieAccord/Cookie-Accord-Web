import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/CookieStoryGallery.tsx
import { useEffect, useState } from "react";
import { BookOpen, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
// 👇 Import the shared storage helpers + type
import { loadStories as loadCookieStories, saveStories as saveCookieStories, } from "../data/cookieStories";
// Seed examples to always show
const SEED_STORIES = [
    {
        id: "mammoth-lower-lip-fuzz-story",
        name: "Anonymous",
        location: "United States",
        cookieName: "Mammoth Lower Lip Fuzz",
        story: "A legendary cookie born in the shadow of Mammoth’s snowy peaks…",
        description: "Soft, funny, and utterly unforgettable—just like its name.",
        photoUrl: "",
    },
    {
        id: "cinnamon-spiral-story",
        name: "Anonymous",
        location: "Somewhere Cozy",
        cookieName: "Cinnamon Spiral",
        story: "A spiral of comfort for chilly mornings and late-night talks.",
        description: "Warm, tender, and scented with cinnamon memories.",
        photoUrl: "",
    },
];
export default function CookieStoryGallery() {
    const [stories, setStories] = useState(SEED_STORIES);
    // On mount: load user stories from the same place ShareCookieStory uses
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        try {
            const extra = loadCookieStories(); // this reads from localStorage
            if (extra && extra.length) {
                setStories([...SEED_STORIES, ...extra]);
            }
        }
        catch {
            // ignore JSON/parsing issues
        }
    }, []);
    // 🗑️ Delete only user-submitted stories (not seeds)
    function deleteStory(id) {
        const existing = loadCookieStories(); // only user stories
        const filtered = existing.filter((s) => s.id !== id);
        saveCookieStories(filtered);
        // Rebuild full list: seeds + remaining user stories
        setStories([...SEED_STORIES, ...filtered]);
    }
    return (_jsxs(_Fragment, { children: [_jsx("main", { className: "min-h-dvh bg-gradient-to-b from-amber-50 via-white to-emerald-50", children: _jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8", children: [_jsxs("header", { className: "mb-6 flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "flex items-center gap-2 text-2xl font-semibold text-stone-900", children: [_jsx(BookOpen, { className: "h-6 w-6 text-amber-600" }), "Cookie Story Gallery"] }), _jsx("p", { className: "mt-1 text-sm text-stone-600", children: "A collection of memories, moments, and cookie stories from around the world." })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "hidden items-center gap-2 rounded-2xl border border-amber-100 bg-white px-3 py-2 text-xs text-stone-600 sm:flex", children: [_jsx(Globe2, { className: "h-4 w-4 text-amber-500" }), _jsxs("span", { children: [stories.length, " stories & counting"] })] }), _jsx(Link, { to: "/", className: "rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm hover:bg-amber-50", children: "\u2190 Back to Cookies" })] })] }), stories.length === 0 ? (_jsx("p", { className: "text-sm text-stone-600", children: "No stories yet. Be the first to share one from the Home page or Share Your Story." })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-2", children: stories.map((s) => (_jsxs("article", { className: "flex flex-col rounded-3xl border border-amber-100 bg-white/90 p-4 shadow-sm", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-semibold text-stone-900", children: s.cookieName }), _jsx("span", { className: "rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-stone-700", children: s.location || "Somewhere" }), s.name && (_jsxs("p", { className: "mt-1 text-[11px] text-stone-500", children: ["Shared by ", s.name] }))] }), !s.id.startsWith("mammoth") &&
                                                !s.id.startsWith("cinnamon") && (_jsx("button", { onClick: () => deleteStory(s.id), className: "ml-2 text-xs text-red-500 hover:text-red-700", children: "delete" }))] }), s.photoUrl && (_jsx("div", { className: "mb-2 h-32 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50", children: _jsx("img", { src: s.photoUrl, alt: s.cookieName, className: "h-full w-full object-cover" }) })), s.description && (_jsx("p", { className: "mb-2 text-xs text-stone-700", children: s.description })), s.story && (_jsxs("p", { className: "text-sm italic text-stone-700", children: ["\u201C", s.story, "\u201D"] })), !s.story && !s.description && (_jsx("p", { className: "text-xs text-stone-500", children: "(Story coming soon for this cookie.)" }))] }, s.id))) }))] }) }), _jsx(Footer, {})] }));
}
