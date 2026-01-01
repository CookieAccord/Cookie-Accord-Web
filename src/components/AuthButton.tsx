import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthButton() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    // initial session check
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
    });

    // live updates
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function sendMagicLink() {
    setStatus(null);

    const clean = email.trim();
    if (!clean) {
      setStatus("Please enter an email.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: {
        // after they click the email link, send them back to your site
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Magic link sent! Check your email.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setStatus(null);
    setEmail("");
  }

  if (signedIn) {
    return (
      <button
        type="button"
        onClick={signOut}
        className="text-xs font-medium text-zinc-700 hover:text-zinc-900"
        title="Sign out"
      >
        Sign out
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email for magic link"
        className="h-8 w-44 rounded-md border border-zinc-200 bg-white px-2 text-xs outline-none focus:border-zinc-400"
      />
      <button
        type="button"
        onClick={sendMagicLink}
        className="h-8 rounded-md bg-amber-600 px-3 text-xs font-medium text-white hover:bg-amber-700"
      >
        Sign in
      </button>
      {status ? <span className="text-[11px] text-zinc-500">{status}</span> : null}
    </div>
  );
}
