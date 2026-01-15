import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Unsubscribe() {
  const [state, setState] = useState<"loading" | "done" | "invalid">("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "";

    (async () => {
      if (!token) {
        setState("invalid");
        return;
      }

      const { data, error } = await supabase.rpc("newsletter_unsubscribe", { p_token: token });

      if (error) {
        console.error(error);
        setState("invalid");
        return;
      }

      setState(data ? "done" : "invalid"); // data is boolean
    })();
  }, []);

  return (
    <div className="mx-auto mt-16 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      {state === "loading" && <p className="text-zinc-700">Unsubscribing…</p>}

      {state === "done" && (
        <>
          <h1 className="text-xl font-semibold text-zinc-900">You’re unsubscribed.</h1>
          <p className="mt-2 text-sm text-zinc-700">No hard feelings. Thank you for being part of the circle.</p>
        </>
      )}

      {state === "invalid" && (
        <>
          <h1 className="text-xl font-semibold text-zinc-900">That link isn’t valid.</h1>
          <p className="mt-2 text-sm text-zinc-700">
            If you meant to unsubscribe, email cookieaccord@gmail.com and we’ll take care of it.
          </p>
        </>
      )}
    </div>
  );
}
