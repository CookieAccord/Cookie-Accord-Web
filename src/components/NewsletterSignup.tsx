import React, { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function normalizeEmail(s: string) {
  return s.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function makeToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  let s = btoa(String.fromCharCode(...arr));
  // base64url
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot for bots
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const disabled = useMemo(() => status === "loading", [status]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp) return; // bot trap

    const cleaned = normalizeEmail(email);

    if (!cleaned || !isValidEmail(cleaned)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
const token = makeToken();

const { error } = await supabase
  .from("newsletter_signups")
  .insert([{ email: cleaned, source: "cookieaccord.com", unsubscribe_token: token }]);

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from("newsletter_signups")
        .insert([{ email: cleaned, source: "cookieaccord.com" }]);

      if (error) {
        const msg = (error as any)?.message ?? "";
        const code = (error as any)?.code ?? "";

        // unique constraint duplicate
        if (code === "23505" || msg.toLowerCase().includes("duplicate")) {
          setStatus("success");
          setMessage("You’re already on the list. 💛");
          return;
        }

        throw error;
      }

      setStatus("success");
      setMessage("Welcome to the Circle. 💛");
      setEmail("");
    } catch (err) {
      console.error("Newsletter signup error:", err);
      setStatus("error");
      setMessage("Sorry—something hiccuped. Please try again.");
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-zinc-200 bg-[#faf7f2] p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Join the Cookie Accord Circle</h2>
      <p className="mt-1 text-sm text-zinc-700 italic">
        A gentle newsletter about cookies, culture, and kindness.
      </p>

      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        New recipes, featured bakers, and quiet stories from around the world.
        <span className="block text-xs text-zinc-500 mt-1">No spam. Just crumbs of joy.</span>
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* honeypot */}
        <div className="hidden">
          <label>
            Do not fill:
            <input value={hp} onChange={(e) => setHp(e.target.value)} />
          </label>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
          autoComplete="email"
          disabled={disabled}
          required
        />

        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Join"}
        </button>
      </form>

      {message ? (
        <div className={"mt-3 text-sm " + (status === "error" ? "text-red-700" : "text-zinc-700")}>
          {message}
        </div>
      ) : null}

      <p className="mt-4 text-xs text-zinc-500">You can unsubscribe anytime.</p>
    </section>
  );
}
