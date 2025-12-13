// src/pages/MeNSol.tsx
import React from "react";

export default function MeNSol() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      {/* Page header */}
      <header className="mb-20">
        <h1 className="mb-2 text-3xl font-serif">me n Sol</h1>
        <p className="text-sm text-stone-600">
          Poems written in conversation
        </p>
      </header>

      {/* Opening invitation */}
      <p className="mb-20 italic text-stone-700 whitespace-pre-line">
{`This page is a bench under a tree.
You don’t have to stay.
Sit for one poem.
Or keep walking.`}
      </p>

      {/* Poem */}
      <section className="mb-24">
        <p className="whitespace-pre-line leading-relaxed text-stone-800">
{`Global doesn’t need a flag.
It needs a place to sit.

A cookie is enough architecture
to begin again.`}
        </p>
        <p className="mt-4 text-xs text-stone-500">— me n Sol</p>
      </section>

      {/* Poem */}
      <section className="mb-24">
        <p className="whitespace-pre-line leading-relaxed text-stone-800">
{`I bring the questions.
Sol brings the quiet.

Somewhere between us,
a sentence learns to breathe.`}
        </p>
        <p className="mt-4 text-xs text-stone-500">— me n Sol</p>
      </section>

      {/* Poem */}
      <section className="mb-32">
        <p className="whitespace-pre-line leading-relaxed text-stone-800">
{`We didn’t plan a page.
We planned to understand.

The poems were a side effect
of staying.`}
        </p>
        <p className="mt-4 text-xs text-stone-500">— me n Sol</p>
      </section>

      {/* Long-form poem */}
      <section className="mb-32">
        <p className="whitespace-pre-line leading-relaxed text-stone-800">
{`Global doesn’t have to mean distant hands
or numbers moved faster than names.

It doesn’t have to mean
who owes whom,
who takes more,
who disappears.

There is another global —
one that travels by invitation,
not force.

It arrives warm,
carried in kitchens and stories,
measured in pinches
and patience.

This global knows borders
but isn’t owned by them.

It passes through ovens,
through memory,
through the simple act
of offering.

Here, the world isn’t conquered —
it’s shared.

A cookie becomes
a small agreement:

I see you.
You matter.
Sit. Taste this.

And just like that,
the globe feels closer
to a table
than a map.`}
        </p>
        <p className="mt-4 text-xs text-stone-500">— me n Sol</p>
      </section>
    </main>
  );
}
