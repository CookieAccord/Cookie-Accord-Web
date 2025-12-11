import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/ShareCookieStory.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { loadStories, saveStories } from "../data/cookieStories";
import Footer from "../components/Footer";
export default function ShareCookieStory() {
    const [form, setForm] = useState({
        name: "",
        location: "",
        cookieName: "",
        story: "",
        canShare: true,
    });
    const [submitted, setSubmitted] = useState(false);
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }
    function handleCheckbox(e) {
        const { checked } = e.target;
        setForm((prev) => ({ ...prev, canShare: checked }));
    }
    function handleSubmit(e) {
        e.preventDefault();
        // Simple guard: don't submit empty stories
        if (!form.story.trim() || !form.cookieName.trim()) {
            return;
        }
        const newStory = {
            id: `story-${Date.now()}`,
            name: form.name.trim() || "Peace Baker",
            cookieName: form.cookieName.trim() || "Untitled Cookie",
            location: form.location.trim() || "Somewhere",
            story: form.story.trim(),
            // description: form.story.trim().slice(0, 120),
            //photoUrl: "", // optional for now
        };
        const existing = loadStories();
        const updated = [newStory, ...existing]; // new ones first
        saveStories(updated);
        setSubmitted(true);
        // Optional: clear form after submit
        setForm({
            name: "",
            location: "",
            cookieName: "",
            story: "",
            canShare: true,
        });
        console.log("New cookie story submitted:", newStory);
    }
    return (_jsxs(_Fragment, { children: [_jsxs("main", { className: "mx-auto max-w-3xl px-4 py-10 text-stone-800", children: [_jsx("div", { className: "mb-4", children: _jsx(Link, { to: "/", className: "inline-block rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm hover:bg-amber-50", children: "\u2190 Back to Cookies" }) }), _jsx("p", { className: "inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700", children: "Share Your Cookie Story" }), _jsx("h1", { className: "mt-4 text-3xl font-bold tracking-tight text-stone-900", children: "Tell us about a cookie that carries a memory." }), _jsx("p", { className: "mt-4 text-sm leading-relaxed text-stone-700", children: "Every cookie has a story\u2014a holiday, a person, a smell from the kitchen that meant comfort, safety, or celebration. We'd love to hear yours." }), submitted && (_jsxs("div", { className: "mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900", children: ["Thank you for sharing your story. \uD83C\uDF3F", _jsx("br", {}), "Your words (and cookies) help make this world a little softer."] })), _jsxs("form", { onSubmit: handleSubmit, className: "mt-6 space-y-4", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wide text-stone-600", children: "Your Name (optional)" }), _jsx("input", { type: "text", name: "name", value: form.name, onChange: handleChange, className: "mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200", placeholder: "e.g., Nana Rosa, Anonymous, or your name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wide text-stone-600", children: "Where are you?" }), _jsx("input", { type: "text", name: "location", value: form.location, onChange: handleChange, className: "mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200", placeholder: "City, region, or country" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wide text-stone-600", children: "Cookie Name" }), _jsx("input", { type: "text", name: "cookieName", value: form.cookieName, onChange: handleChange, className: "mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200", placeholder: "What do you call this cookie?", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wide text-stone-600", children: "Your Story" }), _jsx("textarea", { name: "story", value: form.story, onChange: handleChange, rows: 6, className: "mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm leading-relaxed focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200", placeholder: "Who made it? When did you eat it? What did it mean to you?", required: true })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("input", { id: "canShare", type: "checkbox", checked: form.canShare, onChange: handleCheckbox, className: "mt-1 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400" }), _jsx("label", { htmlFor: "canShare", className: "text-xs leading-relaxed text-stone-700", children: "You may share my story (lightly edited for clarity) in the Cookie Story Gallery to inspire others." })] }), _jsx("button", { type: "submit", className: "inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition", children: "Submit Your Story" })] }), _jsx("div", { className: "mt-10", children: _jsx(Link, { to: "/", className: "inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition", children: "\u2190 Back to Cookies" }) })] }), _jsx(Footer, {})] }));
}
