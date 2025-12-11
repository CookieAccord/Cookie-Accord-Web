// src/pages/Purchase.tsx

import React from "react";
import { BookOpen, CreditCard, Lock } from "lucide-react";

const STRIPE_PAYMENT_LINK =
  "https://buy.stripe.com/eVq14m4U0dlK3WY13B2oE02";

export default function Purchase() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-amber-50 via-white to-emerald-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-medium text-amber-800">
            <BookOpen className="h-4 w-4" />
            <span>Cookie Accord Book</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-stone-900">
            Buy the Book
          </h1>
          <p className="mt-2 text-sm text-stone-600 max-w-xl mx-auto">
            A gentle companion from the Cookie Accord world — part story, part
            invitation, all heart. Secure checkout is handled by Stripe.
          </p>
        </header>

        {/* Content Card */}
        <div className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                What you&apos;re getting
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-stone-700 list-disc pl-5">
                <li>A lovingly crafted edition of the Cookie Accord book</li>
                <li>Stories, reflections, and gentle invitations to pause</li>
                <li>A small, sweet way to support this creative project</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-right md:min-w-[180px]">
              <div className="text-xs uppercase tracking-wide text-amber-800">
                Price
              </div>
              <div className="text-2xl font-semibold text-stone-900">
                Suggested $2.99
              </div>
              <div className="mt-1 text-xs text-stone-600">
                (Update this to your actual price)
              </div>
            </div>
          </div>

          {/* Stripe Payment Link Button */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Proceed to Secure Checkout</span>
            </a>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Lock className="h-3.5 w-3.5" />
              <span>Powered by Stripe. Your payment details never touch this site.</span>
            </div>
          </div>

          {/* Gentle note */}
          <p className="mt-6 text-xs text-stone-500 text-center">
            If you have any trouble with checkout, you can try again later or
            contact me directly and we&apos;ll sort it out the human way.
          </p>
        </div>
      </div>
    </main>
  );
}
