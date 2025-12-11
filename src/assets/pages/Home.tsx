import React from "react";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h2 className="text-3xl font-bold text-stone-800">
        A cookie from every country
      </h2>

      <p className="text-stone-700 leading-relaxed">
        Welcome to Cookie Accord. Explore traditional cookies from around the
        world, share your own, and learn the sweet stories behind each recipe.
      </p>

      <div className="flex gap-4 mt-8">
        <button className="px-5 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700">
          View Cookies
        </button>

        <button className="px-5 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-50">
          Add a Cookie
        </button>
      </div>

    </div>
  );
}
