// src/pages/Download.tsx
import React from "react";
import { Link } from "react-router-dom";

const PDF_PATH = "/CookieAccordBook.pdf";
// Make sure this file is inside /public

export default function Download() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-amber-50">
      <div className="mx-auto max-w-md rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm">
        
        {/* -------- Heading -------- */}
        <h1 className="text-xl font-semibold text-stone-900 mb-2">
          Thank You for Supporting the Cookie Accord
        </h1>

        <p className="text-sm text-stone-700 mb-4">
          Your kindness helps keep this project growing — one cookie, one story, 
          one smile at a time. Your book is ready whenever you are.
        </p>

        {/* -------- Download Button -------- */}
        <a
          href={PDF_PATH}
          download="CookieAccordBook.pdf"
          className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
        >
          ⬇️ Download the Free PDF Book
        </a>

        <p className="mt-3 text-xs text-stone-500">
          If the book opens in your browser instead of downloading, use the 
          save or download button in your PDF viewer.
        </p>

        {/* -------- Footer & Back Button -------- */}
        <div className="mt-4 text-xs text-stone-600">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-medium text-amber-800 hover:bg-amber-100"
          >
            ← Back to Cookie Accord
          </Link>
        </div>

        <p className="mt-4 text-center text-[10px] text-stone-500">
          If you run into any bumps, just reach out. Sol &amp; I will smooth them out.
        </p>

      </div>
    </main>
  );
}
