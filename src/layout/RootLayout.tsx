// src/layout/RootLayout.tsx
import React, { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { Cookie } from "lucide-react";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-white to-emerald-50 text-stone-900">
      <header className="sticky top-0 z-10 border-b border-amber-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
              <h1 className="text-4xl font-semibold text-zinc-900">
                Cookie Accord
              </h1>
              <p className="text-xs text-zinc-600">
                A global cookie tradition project. For all the peace bakers
                of the world.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-700 sm:justify-end">
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

            {/* Buy the Book / Free PDF */}
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
             <Cookie className="h-4 w-4" style={{ color: "#A25528" }} />
              <span className="leading-tight">
                Free PDF Book
                <span className="block text-[10px] text-amber-700">
                  199 recipes
                </span>
              </span>
            </NavLink>
           {/*<NavLink
              to="/me-n-sol"
              className={({ isActive }) =>
                `rounded-xl px-3 py-1 ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-700 hover:bg-stone-100"
                }`
              }
            >
              Poems
            </NavLink>*/}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-4">
  <Outlet />
</main>

      {/* Global footer */}
      <Footer />
    </div>
  );
}
