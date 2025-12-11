import { Link } from "react-router-dom";
import { Download } from "lucide-react";

export default function Purchase() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* ------------------ Heading ------------------ */}
      <h1 className="text-center text-3xl font-semibold text-zinc-800">
        Cookie Accord Book
      </h1>
      <p className="mt-2 text-center text-zinc-600">
        This edition is offered as a <strong>free PDF download</strong> for anyone who enjoys 
        exploring cookie traditions from around the world.
      </p>

      {/* ------------------ Download Button ------------------ */}
      <div className="mt-8 flex justify-center">
        <a
          href="/CookieAccordBook.pdf" 
          download
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-medium text-white shadow hover:bg-amber-600 transition"
        >
          <Download size={18} /> Download Free PDF Book
        </a>
      </div>

      {/* ------------------ Donation Section ------------------ */}
      <div className="mt-12 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-800">Support the Project (Optional)</h2>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-[1fr,160px]">
          {/* Left column */}
          <ul className="space-y-2 text-zinc-700">
            <li>• A lovingly crafted edition of the Cookie Accord book</li>
            <li>• Stories, reflections, and gentle invitations to pause</li>
            <li>• A small, sweet way to support this creative project</li>
          </ul>

          {/* Right column — suggested donation */}
          <div className="flex flex-col items-center rounded-2xl bg-amber-50 p-4">
            <span className="text-sm font-medium text-zinc-500">Suggested Donation</span>
            <span className="text-2xl font-semibold text-amber-700">$2.99</span>
          </div>
        </div>

        {/* Donate Button (uses your existing Stripe setup) */}
        <div className="mt-6 flex justify-center">
          <a
            href="https://buy.stripe.com/eVq14m4U0dlK3WY13B2oE02"
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 font-medium text-white shadow hover:bg-green-700 transition"
          >
            Donate & Support the Project
          </a>
        </div>

        <p className="mt-3 text-center text-xs text-zinc-500">
          Donations are securely handled by Stripe. Your payment details never touch this site.
        </p>
      </div>

      {/* ------------------ Footer Note ------------------ */}
      <p className="mt-8 text-center text-xs text-zinc-500">
       If you run into any bumps, just reach out. Sol & I will smooth them out.
      </p>
    </div>
  );
}
