// src/pages/AboutCookieAccord.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function AboutCookieAccord() {
  return (
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

      {/* Intro section */}
      <section className="mb-10">
        <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          About Cookie Accord
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900">
          A tiny cookie. An enormous gesture.
        </h1>
        <p className="mt-4 text-base leading-relaxed">
          Cookie Accord began with a simple, delicious truth: when you share a
          cookie, the world softens. People smile. Barriers drop. Even the
          grumpiest soul pauses long enough to taste something good.
        </p>
        <p className="mt-3 text-base leading-relaxed">
          Cookies are tiny diplomats that travel farther than passports ever
          could. Every culture has one—a festival favorite, a grandmother&apos;s
          treasure, a street-cart classic, a recipe scribbled on a scrap of
          paper and passed down with love.
        </p>
        <p className="mt-3 text-base leading-relaxed">
          So we gathered these global gems into one welcoming place: a warm oven
          of stories, flavors, and sweet traditions from around the world. Here,
          a cookie isn&apos;t just a treat—it&apos;s a peace offering, a bridge,
          a little lantern of connection.
        </p>
      </section>

      {/* Mission section */}
      <section className="mb-10 border-l-4 border-amber-400 bg-amber-50 px-4 py-4">
        <h2 className="text-lg font-semibold text-amber-900">Our Mission</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
          Our mission is simple: to share peace, connection, and cultural
          understanding through the humble act of offering a cookie.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
          A cookie is tiny, but the gesture is enormous. It says:{" "}
          <span className="italic">
            I see you. I welcome you. Here&apos;s a piece of my world.
          </span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
          Through global recipes, shared stories, and cross-cultural kindness,
          Cookie Accord creates a warm table where anyone can show up, taste
          something new, and feel a little more human.
        </p>
      </section>

      {/* Treaty section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-stone-900">
          The Cookie Accord — A Gentle Treaty of Peace
        </h2>
        <p className="mt-2 text-sm leading-relaxed">
          We, the bakers, tasters, sharers, and hungry wanderers of the world,
          quietly agree to:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-relaxed">
          <li>Offer cookies freely—as an act of welcome, curiosity, and care.</li>
          <li>
            Honor the stories behind each recipe, knowing they carry culture,
            memory, and heart.
          </li>
          <li>
            Share sweetness generously, especially with those having a tough day.
          </li>
          <li>Celebrate differences, one cookie tradition at a time.</li>
          <li>
            Remember that a cookie is tiny, but the gesture is enormous.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          Signed with crumbs, sealed with smiles. 🍪💛
        </p>
      </section>

      {/* Closing section */}
      <section>
        <p className="text-sm leading-relaxed text-stone-700">
          This is Cookie Accord: a playful, heartfelt treaty written in butter,
          flour, memory, and generosity. A space where anyone can wander in,
          take a bite, learn something new, and maybe whisper,{" "}
          <span className="italic">
            &quot;Here—this helped me. Maybe it will help you too.&quot;
          </span>
        </p>
        <p className="mt-3 text-sm font-semibold text-stone-900">
          Bake, share, repeat. That’s the Accord. And everyone is invited to the
          table.
        </p>
      </section>

      {/* Bottom Back to Cookies button */}
      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition"
        >
          ← Back to Cookies
        </Link>
      </div>
    </main>
  );
}
