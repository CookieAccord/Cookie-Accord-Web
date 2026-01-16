import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { ensureAnonSession } from "../lib/ensureAnonSession";

type Crumb = {
  id: string;
  owner_id: string;
  hidden: boolean;
  display_name: string | null;
  country: string | null;
  category: "note" | "funny" | "memory" | "fact" | "gratitude";
  body: string;
  created_at: string;
};

const CATEGORIES: Crumb["category"][] = ["note", "funny", "memory", "fact", "gratitude"];

const REACTIONS = ["🍪", "❤️", "😂", "✨", "🤯"] as const;
type Emoji = (typeof REACTIONS)[number];

type ReactionRow = {
  crumb_id: string;
  emoji: Emoji;
  owner_id: string;
};

function sbErr(label: string, err: any) {
  const clean = {
    message: err?.message,
    details: err?.details,
    hint: err?.hint,
    code: err?.code,
    status: err?.status,
    name: err?.name,
  };
  // eslint-disable-next-line no-console
  console.log(label, clean, err);
}

export default function CookieCrumbs() {
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const [error, setError] = useState<string>("");

  const [filterType, setFilterType] = useState<Crumb["category"] | "all">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState<Crumb["category"]>("note");
  const [body, setBody] = useState("");

  // reactions state
  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, number>>>({});
  const [myReactions, setMyReactions] = useState<Record<string, Set<string>>>({});

  // remove confirm state
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  // ✅ single source of truth for the current user id
  const uidRef = useRef<string>("");
  const [myUid, setMyUid] = useState<string>("");

  const remaining = useMemo(() => 280 - body.length, [body]);

  // ✅ Always get the *actual* current uid (email OR anon). Creates anon if needed.
  async function getUid(): Promise<string> {
    // If we already have one, trust it (kept in sync via onAuthStateChange)
    if (uidRef.current) return uidRef.current;

    // This will return current signed-in user OR sign in anonymously
    const uid = await ensureAnonSession();
    uidRef.current = uid;
    setMyUid(uid);
    return uid;
  }

  async function loadReactionsForCrumbs(crumbIds: string[], uid: string) {
    if (!crumbIds.length) {
      setReactionCounts({});
      setMyReactions({});
      return;
    }

    const { data, error } = await supabase
      .from("cookie_crumb_reactions")
      .select("crumb_id, emoji, owner_id")
      .in("crumb_id", crumbIds);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("reactions load error:", error);
      return;
    }

    const rows = (data as ReactionRow[]) ?? [];
    const counts: Record<string, Record<string, number>> = {};
    const mine: Record<string, Set<string>> = {};

    for (const r of rows) {
      counts[r.crumb_id] ??= {};
      counts[r.crumb_id][r.emoji] = (counts[r.crumb_id][r.emoji] ?? 0) + 1;

      if (uid && r.owner_id === uid) {
        mine[r.crumb_id] ??= new Set<string>();
        mine[r.crumb_id].add(r.emoji);
      }
    }

    setReactionCounts(counts);
    setMyReactions(mine);
  }

  async function loadCrumbs(nextFilter = filterType, nextSort = sortOrder) {
    setLoading(true);
    setError("");

    let q = supabase
      .from("cookie_crumbs")
      .select("id, owner_id, hidden, display_name, country, category, body, created_at")
      .eq("hidden", false);

    if (nextFilter !== "all") q = q.eq("category", nextFilter);

    q = q.order("created_at", { ascending: nextSort === "oldest" });

    const { data, error } = await q.limit(100);

    if (error) {
      sbErr("SELECT cookie_crumbs", error);
      setError(error.message);
      setCrumbs([]);
      setLoading(false);
      return;
    }

    const nextCrumbs = (data as Crumb[]) ?? [];
    setCrumbs(nextCrumbs);
    setLoading(false);

    const uid = uidRef.current || (await getUid());
    await loadReactionsForCrumbs(nextCrumbs.map((c) => c.id), uid);
  }

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const uid = await getUid();
        if (!alive) return;
        await loadCrumbs("all", "newest");
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Unable to start session");
      }
    })();

    // ✅ Keep uid synced to the auth token Supabase actually uses
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const id = session?.user?.id ?? "";
      if (id) {
        uidRef.current = id;
        setMyUid(id);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleReaction(crumbId: string, emoji: Emoji) {
    setError("");
    try {
      const uid = await getUid();

      const already = myReactions[crumbId]?.has(emoji);

      if (already) {
        const { error } = await supabase
          .from("cookie_crumb_reactions")
          .delete()
          .eq("crumb_id", crumbId)
          .eq("emoji", emoji)
          .eq("owner_id", uid);

        if (error) throw error;
      } else {
        // ✅ include owner_id so RLS can validate
        const { error } = await supabase
          .from("cookie_crumb_reactions")
          .insert([{ crumb_id: crumbId, emoji, owner_id: uid }]);

        if (error && !String(error.message).toLowerCase().includes("duplicate")) {
          throw error;
        }
      }

      await loadReactionsForCrumbs(crumbs.map((c) => c.id), uid);
    } catch (e: any) {
      sbErr("REACTION", e);
      setError(e?.message ?? "Reaction failed.");
    }
  }

  async function submitCrumb(e: React.FormEvent) {
    e.preventDefault();
    if (posting) return; // ✅ hard guard against double submit
    setError("");

    const text = body.trim();
    if (!text) return setError("Please write a crumb first.");
    if (text.length > 280) return setError("Crumb is too long (max 280).");

    setPosting(true);
    try {
      const uid = await getUid();

      const payload = {
        owner_id: uid, // ✅ explicit ownership
        display_name: displayName.trim() || null,
        country: country.trim() || null,
        category,
        body: text,
      };

      const { error } = await supabase.from("cookie_crumbs").insert([payload]);
      if (error) throw error;

      setBody("");
      setConfirmRemoveId(null);
      await loadCrumbs(); // respects current filter/sort
    } catch (e: any) {
      sbErr("INSERT cookie_crumbs", e);
      setError(e?.message ?? "Could not post crumb.");
    } finally {
      setPosting(false);
    }
  }

  async function hideCrumb(crumbId: string) {
  setError("");
  setRemoving(true);

  try {
    const uid = await getUid();

    const { error } = await supabase
      .from("cookie_crumbs")
      .delete()
      .eq("id", crumbId)
      .eq("owner_id", uid);

    if (error) throw error;

    setConfirmRemoveId(null);
    await loadCrumbs();
  } catch (e: any) {
    sbErr("DELETE cookie_crumbs", e);
    setError(e?.message ?? "Could not remove crumb.");
  } finally {
    setRemoving(false);
  }
}

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-800">Cookie Crumbs</h1>
        <p className="mt-2 text-sm text-stone-600">
          Leave a tiny cookie note — a memory, a laugh, a fun fact, a gratitude crumb.
        </p>
        <p className="mt-2 text-xs text-stone-500">Please keep it cookie-warm: no hate, no politics, no personal info.</p>
      </div>

      <form onSubmit={submitCrumb} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs text-stone-600">Name (optional)</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-200"
              placeholder="e.g., Karen"
              maxLength={40}
            />
          </div>

          <div>
            <label className="text-xs text-stone-600">Country (optional)</label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-200"
              placeholder="e.g., USA"
              maxLength={60}
            />
          </div>

          <div>
            <label className="text-xs text-stone-600">Type</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-200"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs text-stone-600">Your crumb</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 min-h-[90px] w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-200"
            placeholder="A tiny cookie note..."
            maxLength={280}
          />
          <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
            <span>{remaining} left</span>
            {error ? <span className="text-red-600">{error}</span> : <span />}
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={posting}
            className="rounded-full bg-stone-800 px-4 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-60"
          >
            {posting ? "Posting..." : "Post crumb"}
          </button>
        </div>
      </form>

      {/* Filter + Sort */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", ...CATEGORIES] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={async () => {
                setFilterType(t);
                await loadCrumbs(t, sortOrder);
              }}
              className={
                "rounded-full border px-3 py-1 text-xs transition " +
                (filterType === t
                  ? "border-stone-300 bg-stone-100 text-stone-900"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50")
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-600">Sort</span>
          <select
            value={sortOrder}
            onChange={async (e) => {
              const v = e.target.value as "newest" | "oldest";
              setSortOrder(v);
              await loadCrumbs(filterType, v);
            }}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-stone-200"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="text-sm text-stone-600">Loading crumbs…</div>
        ) : (
          <div className="space-y-3">
            {crumbs.map((c) => {
              const mySet = myReactions[c.id] ?? new Set<string>();
              const isMine = !!myUid && c.owner_id === myUid;
              const confirming = confirmRemoveId === c.id;

              return (
                <div key={c.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="rounded-full bg-stone-100 px-2 py-0.5">{c.category}</span>
                    {c.country ? <span>• {c.country}</span> : null}
                    <span>• {new Date(c.created_at).toLocaleString()}</span>

                    {isMine ? (
                      <span className="ml-auto">
                        {!confirming ? (
                          <button
                            type="button"
                            onClick={() => setConfirmRemoveId(c.id)}
                            className="rounded-full px-2 py-1 text-xs text-stone-500 hover:bg-stone-100"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <span className="text-xs text-stone-500">Remove this crumb?</span>
                            <button
                              type="button"
                              onClick={() => setConfirmRemoveId(null)}
                              className="rounded-full border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 hover:bg-stone-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={removing}
                              onClick={() => hideCrumb(c.id)}
                              className="rounded-full bg-stone-800 px-2.5 py-1 text-xs text-white hover:bg-stone-700 disabled:opacity-60"
                            >
                              {removing ? "Removing…" : "Remove"}
                            </button>
                          </span>
                        )}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 whitespace-pre-wrap text-sm text-stone-800">{c.body}</div>

                  {c.display_name ? <div className="mt-2 text-xs text-stone-500">— {c.display_name}</div> : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {REACTIONS.map((emo) => {
                      const count = reactionCounts[c.id]?.[emo] ?? 0;
                      const active = mySet.has(emo);

                      return (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => toggleReaction(c.id, emo)}
                          className={
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition " +
                            (active
                              ? "border-stone-300 bg-stone-100 text-stone-900"
                              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50")
                          }
                          aria-label={`React ${emo}`}
                        >
                          <span>{emo}</span>
                          <span className="tabular-nums">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
