// src/pages/CookieStoryGallery.tsx
import React, { useEffect, useState } from "react";
import { BookOpen, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";

// 👇 Import the shared storage helpers + type
import {
  loadStories as loadCookieStories,
  saveStories as saveCookieStories,
  Story as CookieStory,
} from "../data/cookieStories";

// Extend the base Story type with a couple of optional fields
type StoryItem = CookieStory & {
  description?: string;
  photoUrl?: string;
};

// Seed examples to always show
const SEED_STORIES: StoryItem[] = [
  {
    id: "mammoth-lower-lip-fuzz-story",
    name: "Anonymous",
    location: "United States",
    cookieName: "Mammoth Lower Lip Fuzz",
    story: "Soft, funny, and utterly unforgettable—just like its name.\n\n" +
      "These started as a happy accident on a snowy trip to Mammoth. " +
      "The first batch came out with a cloud of powdered sugar that clung to everyone’s upper lip. " +
      "Someone laughed, “Look at that mammoth lower lip fuzz!” and the name never left.\n\n" +
      "Now they’re our snow-day cookie: a little chewy, a little messy, and guaranteed to leave " +
      "everyone dusted in sugar and laughing around the table.",
    description: "",
    photoUrl: "",
  },
  {
    id: "cinnamon-spiral-story",
    name: "Anonymous",
    location: "Somewhere Cozy",
    cookieName: "Cinnamon Spiral",
    story: "Warm, tender, and scented with cinnamon memories and imagination.\n\n" +
      "These spirals show up on quiet Saturdays when life feels too loud. " +
      "You unroll them bite by bite—like reading an old letter—following the cinnamon ribbon " +
      "all the way to the middle.\n\n" +
      "They’re perfect for late-night talks, early-morning coffee, and those in-between moments " +
      "when you need a small, gentle comfort.",
    description: "",
    photoUrl: "",
  },
];

export default function CookieStoryGallery() {
  const [stories, setStories] = useState<StoryItem[]>(SEED_STORIES);

  // On mount: load user stories from the same place ShareCookieStory uses
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const extra = loadCookieStories(); // this reads from localStorage
      if (extra && extra.length) {
        setStories([...SEED_STORIES, ...extra]);
      }
    } catch {
      // ignore JSON/parsing issues
    }
  }, []);

  // 🗑️ Delete only user-submitted stories (not seeds)
  function deleteStory(id: string) {
    const existing = loadCookieStories(); // only user stories
    const filtered = existing.filter((s) => s.id !== id);
    saveCookieStories(filtered);

    // Rebuild full list: seeds + remaining user stories
    setStories([...SEED_STORIES, ...filtered]);
  }

  return (
    <>
      <main className="min-h-dvh bg-gradient-to-b from-amber-50 via-white to-emerald-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold text-stone-900">
                <BookOpen className="h-6 w-6 text-amber-600" />
                Cookie Story Gallery
              </h1>
              <p className="mt-1 text-sm text-stone-600">
                At the heart of the Cookie Accord lives a growing collection of memories and traditions — stories shared with care by Peace Bakers everywhere.
Everyone is welcome at this table.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
              <div className="hidden items-center gap-2 rounded-2xl border border-amber-100 bg-white px-3 py-2 text-xs text-stone-600 sm:flex">
                <Globe2 className="h-4 w-4 text-amber-500" />
                <span>{stories.length} stories &amp; counting</span>
              </div>
              <Link
                to="/"
                className="rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm hover:bg-amber-50"
              >
                ← Back to Cookies
              </Link>
            </div>
          </header>

          {stories.length === 0 ? (
            <p className="text-sm text-stone-600">
              No stories yet. Be the first to share one from the Home page or Share
              Your Story.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {stories.map((s) => (
                <article
                  key={s.id}
                  className="flex flex-col rounded-3xl border border-amber-100 bg-white/90 p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      {/* Cookie name as the title */}
                      <h2 className="text-base font-semibold text-stone-900">
                        {s.cookieName}
                      </h2>
                      {/* Location as the country badge */}
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-stone-700">
                        {s.location || "Somewhere"}
                      </span>

                      {/* Small 'shared by' line */}
                      {s.name && (
                        <p className="mt-1 text-[11px] text-stone-500">
                          Shared by {s.name}
                        </p>
                      )}
                    </div>

                    {/* 🍪 DELETE BUTTON FOR USER STORIES ONLY (not seeds) */}
                    {!s.id.startsWith("mammoth") &&
                      !s.id.startsWith("cinnamon") && (
                        <button
                          onClick={() => deleteStory(s.id)}
                          className="ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          delete
                        </button>
                      )}
                  </div>

                  {s.photoUrl && (
                    <div className="mb-2 h-32 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50">
                      <img
                        src={s.photoUrl}
                        alt={s.cookieName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {s.description && (
                    <p className="mb-2 text-xs text-stone-700">{s.description}</p>
                  )}

                  {s.story && (
                    <p className="text-sm italic text-stone-700">“{s.story}”</p>
                  )}

                  {!s.story && !s.description && (
                    <p className="text-xs text-stone-500">
                      (Story coming soon for this cookie.)
                    </p>
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
