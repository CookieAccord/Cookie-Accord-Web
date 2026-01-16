// ensureAnonSession.ts
import { supabase } from "./supabaseClient";

export async function ensureAnonSession(): Promise<string> {
  // 1) If already signed in (email OR anon), use that
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (userRes?.user?.id) return userRes.user.id;

  // 2) Otherwise, create an anonymous session
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;

  const uid = data?.user?.id;
  if (!uid) throw new Error("Anonymous sign-in succeeded but no user id returned.");
  return uid;
}
