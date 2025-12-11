// src/pages/Contact.tsx
import React from "react";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">
        Contact Cookie Accord
      </h1>

      {/* Intro */}
      <p className="text-lg leading-relaxed mb-6 text-zinc-700">
        Have a question, a cookie story to share, or a suggestion for a future
        edition of the book? Peace Bakers, teachers, librarians, and curious
        cookie lovers are all welcome to reach out.
      </p>

      {/* How to reach you */}
      <div className="mb-10 text-sm leading-relaxed space-y-3">
        <p>You can email the Cookie Accord keeper here:</p>

        <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-amber-900 text-sm">
          <Mail className="w-4 h-4" />
          <span>cookieaccord@gmail.com</span>
        </p>

        <p className="text-xs text-zinc-500"></p>
      </div>

      {/* Mailto message box */}
      <div className="rounded-2xl border border-emerald-100 bg-white/70 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-800 mb-4">
          Send a message <span className="inline-block ml-1">🍪✨</span>
        </h2>

        <p className="text-sm text-zinc-700 mb-4">
          We’d love to hear from you — cookie stories, questions, ideas,
          warm crumbs of kindness. Your note will open in your email app.
        </p>

        <a
          href="mailto:cookieaccord@gmail.com?subject=Message%20for%20Cookie%20Accord&body=Hi%20Cookie%20Accord,%0D%0A%0D%0A"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700 hover:shadow-md transition"
        >
          <Mail className="w-4 h-4" />
          <span>Send a message ✨🍪</span>
        </a>

        <p className="mt-3 text-[11px] text-zinc-500">
          Your email app will open with our address pre-filled.
        </p>
      </div>
    </div>
  );
}
