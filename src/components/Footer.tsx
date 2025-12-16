// src/components/Footer.tsx
import React from "react";
import ShareCookieButton from "./ShareCookieButton";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-stone-50/70 py-4 text-xs text-stone-600">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="text-center leading-snug md:text-left">
          <p className="mb-1">A cookie is tiny. The gesture is enormous.</p>
          <p className="text-stone-700">
            Made with sweetness &amp; peace • Cookie Accord © {new Date().getFullYear()}
          </p>
          <p className="mt-0.5 text-stone-500">me n Sol – 2025</p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center justify-center gap-4">
  <a
    href="https://instagram.com/cookieaccord"
    target="_blank"
    rel="noreferrer"
    className="text-sm text-amber-600 transition hover:text-amber-800 hover:underline"
  >
    Instagram
  </a>

  <a
    href="https://facebook.com/cookieaccord"
    target="_blank"
    rel="noreferrer"
    className="text-sm text-amber-600 transition hover:text-amber-800 hover:underline"
  >
    Facebook
  </a>

  <a
    href="https://twitter.com/cookieaccord"
    target="_blank"
    rel="noreferrer"
    className="text-sm text-amber-600 transition hover:text-amber-800 hover:underline"
  >
    X (Twitter)
  </a>

  <ShareCookieButton />
</div>
      </div>
    </footer>
  );
}
