import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import AuthButton from "./AuthButton";

export function RequireAuth({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("RequireAuth getSession error:", error);
        if (!mounted) return;
        setUser(data.session?.user ?? null);
      } catch (e) {
        console.error("RequireAuth session error:", e);
      } finally {
        if (mounted) setReady(true);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!ready) return null;

 if (!user) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-sm text-zinc-700">
        To share a recipe, please sign in with your email.
      </p>
      <div className="mt-3">
        <AuthButton />
      </div>
    </div>
  );
}

  return <>{children}</>;
}
