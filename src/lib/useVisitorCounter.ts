import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

export function useVisitorCounter() {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname || "/";

    // Avoid double-counting same path (helps in dev/StrictMode)
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;

    // Fire-and-forget
    supabase.rpc("increment_page_view", { p_path: path });
  }, [location.pathname]);
}
