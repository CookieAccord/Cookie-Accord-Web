import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useNavigate } from "react-router-dom";
import RAW from "../data/traditionalCookies.json";
// Unique, sorted list of countries from the recipe data
const COUNTRY_OPTIONS = Array.from(new Set(RAW
    .map((r) => (r.country || r.Country || "").trim())
    .filter(Boolean))).sort((a, b) => a.localeCompare(b));
const navigate = useNavigate();
_jsx("button", { onClick: () => navigate(-1), children: "\u2190 Back" });
/** CookieForm — minimal, self-contained */
export default function CookieForm() {
    const [form, setForm] = React.useState({
        title: "",
        country: "",
        ingredients: "",
        steps: "",
        story: "",
        theme: "",
        consent: false,
    });
    const [errors, setErrors] = React.useState({});
    const [submitted, setSubmitted] = React.useState(false);
    const [submittedData, setSubmittedData] = React.useState(null);
    const firstErrorRef = React.useRef(null);
    const limits = { title: 80, story: 600, steps: 2000 };
    const titleCount = `${form.title.length}/${limits.title}`;
    const storyCount = `${form.story.length}/${limits.story}`;
    const stepsCount = `${form.steps.length}/${limits.steps}`;
    // Normalize textarea lines into clean arrays
    function linesToArray(txt) {
        return txt
            .split(/\r?\n/)
            .map((s) => s.replace(/^\s*(?:\d+[.)-]|[\-*•+–—])\s+/, "").trim())
            .filter(Boolean);
    }
    function validate(values) {
        const e = {};
        if (!values.title.trim())
            e.title = "Please add a recipe title.";
        if (!values.ingredients.trim())
            e.ingredients = "Add at least one ingredient.";
        if (!values.steps.trim())
            e.steps = "Tell us how to make it.";
        if (!values.consent)
            e.consent = "Please agree to share kindly & originally.";
        if (values.title.length > limits.title)
            e.title = `Keep title under ${limits.title} characters.`;
        if (values.story.length > limits.story)
            e.story = `Keep story under ${limits.story} characters.`;
        return e;
    }
    function onChange(field) {
        return (ev) => {
            const value = field === "consent" ? ev.target.checked : ev.target.value;
            const next = { ...form, [field]: value };
            if (field === "title" && next.title.length > limits.title)
                next.title = next.title.slice(0, limits.title);
            if (field === "story" && next.story.length > limits.story)
                next.story = next.story.slice(0, limits.story);
            if (field === "steps" && next.steps.length > limits.steps)
                next.steps = next.steps.slice(0, limits.steps);
            setForm(next);
            if (errors[field])
                setErrors((e) => ({ ...e, [field]: undefined }));
        };
    }
    function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate(form);
        setErrors(e);
        if (Object.keys(e).length) {
            setSubmitted(false);
            // focus first error field
            setTimeout(() => {
                if (firstErrorRef.current)
                    firstErrorRef.current.focus();
            }, 0);
            return;
        }
        setSubmitted(true);
        setSubmittedData({
            ...form,
            ingredientsList: linesToArray(form.ingredients),
            stepsList: linesToArray(form.steps),
        });
    }
    async function copyStepsAsMarkdown() {
        const markdown = linesToArray(form.steps)
            .map((line, i) => `${i + 1}. ${line}`)
            .join("\n");
        try {
            await navigator.clipboard.writeText(markdown);
        }
        catch {
            const ta = document.createElement("textarea");
            ta.value = markdown;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
    }
    const errorRing = "focus:ring-2 focus:ring-red-400 border-red-400";
    return (_jsxs("div", { className: "max-w-3xl mx-auto bg-white border border-amber-200 rounded-2xl shadow-md p-6", children: [_jsxs("div", { className: "sr-only", "aria-live": "assertive", children: [Object.keys(errors).length > 0 && "Please fix the highlighted fields.", submitted && "Your recipe was submitted. Thank you!"] }), submitted && (_jsx("div", { className: "mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-800", children: "\uD83C\uDF89 Your recipe was submitted (demo). Next step: review & publish!" })), _jsxs("form", { className: "grid grid-cols-1 gap-5", onSubmit: handleSubmit, noValidate: true, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-end justify-between", children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium mb-1", children: "Recipe title" }), _jsx("span", { className: "text-[11px] text-zinc-500", children: titleCount })] }), _jsx("input", { id: "title", className: `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${errors.title ? errorRing : ""}`, placeholder: "e.g., Peace Shortbread", value: form.title, onChange: onChange("title"), "aria-invalid": !!errors.title, "aria-describedby": errors.title ? "title-error" : undefined, 
                                        // @ts-ignore – shared ref for first error across different field types  
                                        ref: !form.title && errors.title ? firstErrorRef : null }), errors.title && (_jsx("p", { id: "title-error", className: "mt-1 text-xs text-red-600", children: errors.title }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "country", className: "block text-sm font-medium mb-1", children: "Country" }), _jsx("option", { value: "", children: "Choose\u2026" }), COUNTRY_OPTIONS.map((c) => (_jsx("option", { value: c, children: c }, c)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "ingredients", className: "block text-sm font-medium mb-1", children: "Ingredients" }), _jsx("textarea", { id: "ingredients", className: `w-full border rounded-xl px-3 py-2 text-sm min-h-[96px] focus:outline-none focus:ring-2 focus:ring-amber-300 ${errors.ingredients ? errorRing : ""}`, placeholder: "One per line, with amounts", value: form.ingredients, onChange: onChange("ingredients"), "aria-invalid": !!errors.ingredients, "aria-describedby": errors.ingredients ? "ingredients-error" : undefined, 
                                // @ts-ignore – shared ref for first error across different field types
                                ref: !form.ingredients && errors.ingredients ? firstErrorRef : null }), errors.ingredients && (_jsx("p", { id: "ingredients-error", className: "mt-1 text-xs text-red-600", children: errors.ingredients })), linesToArray(form.ingredients).length > 0 && (_jsx("div", { className: "mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3", children: _jsx("ul", { className: "list-disc pl-5 text-sm text-zinc-800 space-y-1", children: linesToArray(form.ingredients).map((line, i) => (_jsx("li", { children: line }, i))) }) }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-end justify-between", children: [_jsx("label", { htmlFor: "steps", className: "block text-sm font-medium mb-1", children: "Steps" }), _jsx("span", { className: "text-[11px] text-zinc-500", children: stepsCount })] }), _jsx("textarea", { id: "steps", className: `w-full border rounded-xl px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-amber-300 ${errors.steps ? errorRing : ""}`, placeholder: "Step-by-step instructions (one step per line)", value: form.steps, onChange: onChange("steps"), "aria-invalid": !!errors.steps, "aria-describedby": errors.steps ? "steps-error" : undefined, 
                                // @ts-ignore – shared ref for first error across different field types
                                ref: !form.steps && errors.steps ? firstErrorRef : null }), errors.steps && (_jsx("p", { id: "steps-error", className: "mt-1 text-xs text-red-600", children: errors.steps })), linesToArray(form.steps).length > 0 && (_jsxs("div", { className: "mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3", children: [_jsx("ol", { className: "list-decimal pl-5 text-sm text-zinc-800 space-y-1", children: linesToArray(form.steps).map((line, i) => (_jsx("li", { children: line }, `${line}-${i}`))) }), _jsx("div", { className: "flex justify-end mt-2", children: _jsx("button", { type: "button", onClick: copyStepsAsMarkdown, className: "rounded-lg border border-amber-300 text-amber-800 text-xs px-3 py-1 bg-white hover:bg-amber-50", children: "Copy Steps as Markdown" }) })] }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-end justify-between", children: [_jsx("label", { htmlFor: "story", className: "block text-sm font-medium mb-1", children: "Your story" }), _jsx("span", { className: "text-[11px] text-zinc-500", children: storyCount })] }), _jsx("textarea", { id: "story", className: `w-full border rounded-xl px-3 py-2 text-sm min-h-[120px] focus:outline-none ${errors.story ? errorRing : "focus:ring-2 focus:ring-amber-300"} bg-amber-50/70`, placeholder: "\u2728 What does peace taste like to you? Share a memory, message, or moment.", value: form.story, onChange: onChange("story"), "aria-invalid": !!errors.story, "aria-describedby": errors.story ? "story-error" : undefined }), errors.story && (_jsx("p", { id: "story-error", className: "mt-1 text-xs text-red-600", children: errors.story })), _jsx("p", { className: "mt-1 text-xs text-zinc-600 italic", children: "Tip: a few heartfelt lines make your cookie unforgettable." })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("input", { id: "consent", type: "checkbox", className: `mt-1 ${errors.consent ? "ring-2 ring-red-400 rounded" : ""}`, checked: form.consent, onChange: onChange("consent"), "aria-invalid": !!errors.consent, "aria-describedby": errors.consent ? "consent-error" : undefined, 
                                // @ts-ignore – shared ref for first error across different field types
                                ref: !form.consent && errors.consent ? firstErrorRef : null }), _jsx("label", { htmlFor: "consent", className: "text-sm text-zinc-700", children: "I agree to share this recipe and story under the Cookie Accord mission. Be kind, be original, and give credit where due." })] }), errors.consent && (_jsx("p", { id: "consent-error", className: "-mt-3 mb-2 text-xs text-red-600", children: errors.consent })), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => {
                                    const e = validate(form);
                                    setErrors(e);
                                    setSubmitted(false);
                                }, className: "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition border border-amber-300 text-amber-800 bg-white hover:bg-amber-50", children: "Preview" }), _jsx("button", { type: "submit", className: "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition bg-amber-600 text-white hover:bg-amber-700", children: "Submit Recipe" })] }), _jsx("p", { className: "text-xs text-center text-zinc-500", children: "By submitting, you add your recipe to a community library of edible empathy. \uD83C\uDF6A\uD83D\uDC9B" })] }), submitted && submittedData && (_jsxs("div", { className: "mt-6 border border-amber-200 bg-amber-50 rounded-2xl p-5", children: [_jsx("h3", { className: "text-lg font-semibold text-amber-900 mb-2", children: "Your Recipe Preview \uD83C\uDF6A" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold", children: submittedData.title }), _jsxs("p", { className: "text-zinc-700", children: [submittedData.country || "—", " ", submittedData.theme ? `• ${submittedData.theme}` : ""] }), submittedData.story && (_jsxs("blockquote", { className: "mt-3 italic text-amber-900 bg-amber-100/80 border-l-4 border-amber-400 pl-4 py-2 rounded-r-xl", children: ["\u201C", submittedData.story, "\u201D"] }))] }), _jsxs("div", { children: [_jsx("p", { className: "font-medium mb-1", children: "Ingredients" }), _jsx("ul", { className: "list-disc pl-5 space-y-1", children: submittedData.ingredientsList.map((it, i) => (_jsx("li", { children: it }, i))) })] })] }), submittedData.stepsList.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "font-medium mb-1", children: "Steps" }), _jsx("ol", { className: "list-decimal pl-5 space-y-1", children: submittedData.stepsList.map((st, i) => (_jsx("li", { children: st }, i))) }), _jsx("div", { className: "flex justify-end mt-3", children: _jsx("button", { type: "button", onClick: copyStepsAsMarkdown, className: "rounded-lg border border-amber-300 text-amber-800 text-xs px-3 py-1 bg-white hover:bg-amber-50", children: "Copy Steps as Markdown" }) })] }))] }))] }));
}
