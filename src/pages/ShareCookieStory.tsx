// src/pages/ShareCookieStory.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loadStories, saveStories, Story } from "../data/cookieStories";

type FormState = {
  name: string;
  location: string;
  cookieName: string;
  story: string;
  canShare: boolean;
};

export default function ShareCookieStory() {
  const [form, setForm] = useState<FormState>({
    name: "",
    location: "",
    cookieName: "",
    story: "",
    canShare: true,
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = e.target;
    setForm((prev) => ({ ...prev, canShare: checked }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Simple guard: don't submit empty stories
    if (!form.story.trim() || !form.cookieName.trim()) {
      return;
    }

 const newStory: Story = {
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

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-10 text-stone-800">
        {/* TOP BACK BUTTON */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-block rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm hover:bg-amber-50"
          >
            ← Back to Cookies
          </Link>
        </div>

        <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Share Your Cookie Story
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900">
          Tell us about a cookie that carries a memory.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone-700">
          Every cookie has a story—a holiday, a person, a smell from the kitchen
          that meant comfort, safety, or celebration. We&apos;d love to hear yours.
        </p>

        {submitted && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Thank you for sharing your story. 🌿
            <br />
            Your words (and cookies) help make this world a little softer.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-stone-600">
                Your Name (optional)
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="e.g., Nana Rosa, Anonymous, or your name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-stone-600">
                Where are you?
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="City, region, or country"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-600">
              Cookie Name
            </label>
            <input
              type="text"
              name="cookieName"
              value={form.cookieName}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              placeholder="What do you call this cookie?"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-600">
              Your Story
            </label>
            <textarea
              name="story"
              value={form.story}
              onChange={handleChange}
              rows={6}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm leading-relaxed focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              placeholder="Who made it? When did you eat it? What did it mean to you?"
              required
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="canShare"
              type="checkbox"
              checked={form.canShare}
              onChange={handleCheckbox}
              className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
            />
            <label
              htmlFor="canShare"
              className="text-xs leading-relaxed text-stone-700"
            >
              You may share my story (lightly edited for clarity) in the Cookie Story
              Gallery to inspire others.
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition"
          >
            Submit Your Story
          </button>
        </form>

        {/* BOTTOM BACK BUTTON */}
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition"
          >
            ← Back to Cookies
          </Link>
        </div>
      </main>

       </>
  );
}
