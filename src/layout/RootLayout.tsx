// src/layout/RootLayout.tsx
import React, { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { Cookie } from "lucide-react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-white to-emerald-50 text-stone-900">
      <header className="sticky top-0 z-10 border-b border-amber-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-transparent">
              <img
                src="/images/logo/cookie-accord-logo.png"
                alt="Cookie Accord logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900">
                Cookie Accord
              </h1>
              <p className="text-xs text-zinc-600">
                A global cookie tradition project. For all the peace bakers
                of the world.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-3 text-sm text-zinc-700">
            {/* Buy the Book */}
            <NavLink
              to="/purchase"
              className={({ isActive }) =>
                `rounded-xl px-3 py-1 flex items-center gap-2 ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-700 hover:bg-stone-100"
                }`
              }
            >
             

            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-xl px-3 py-1 ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-700 hover:bg-stone-100"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `rounded-xl px-3 py-1 ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-700 hover:bg-stone-100"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `rounded-xl px-3 py-1 ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-700 hover:bg-stone-100"
                }`
              }
            >
              Contact
            </NavLink>

           <Cookie className="h-4 w-4" style={{ color: "#A25528" }} />
              <span className="leading-tight">
                Free PDF Book
                <span className="block text-[10px] text-amber-700">
                  199 recipes
                </span>
              </span>
            </NavLink>

            {/*<NavLink
              to="/share"
              className={({ isActive }) =>
                `rounded-xl px-3 py-1 ${
                  isActive
                    ? "bg-emerald-100 text-emerald-900"
                    : "text-stone-700 hover:bg-stone-100"
                }`
              }
            >
              Share
            </NavLink>*/}

           {/*} <NavLink
              to="/stories"
              className={({ isActive }) =>
                `rounded-xl px-3 py-1 ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-700 hover:bg-stone-100"
                }`
              }
            >
              Stories
            </NavLink>*/}

           {/*} <NavLink
              to="/recipes"
              className={({ isActive }) =>
                `rounded-xl px-3 py-1 ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-700 hover:bg-stone-100"
                }`
              }
            >
              Recipes
            </NavLink>*/}
          </nav>
        </div>
      </header>

      {/* Main content grows to fill, pushing footer down */}
      <main className="flex-1 pb-4">{children}</main>

      <footer className="mt-3 py-2 border-t border-amber-100 text-center text-[11px] text-zinc-600 leading-snug">
        <p className="mt-0.5">
          A cookie is tiny. The gesture is enormous.
        </p>

        <p className="mt-1 text-zinc-700">
          Made with sweetness &amp; peace
        </p>

        <p className="mt-0.5">
          Cookie Accord © 2025 <span className="inline-block">🍪</span>
        </p>

        <p className="mt-0.5 text-zinc-500">
          me n Sol – 2025
        </p>
      </footer>
    </div>
  );
}
