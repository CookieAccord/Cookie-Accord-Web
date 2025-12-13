// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Download from "./pages/Download";
import CookieAccordTwoPane from "./pages/CookieAccordTwoPane";
import AboutCookieAccord from "./pages/AboutCookieAccord";
import Contact from "./pages/Contact";
import Purchase from "./pages/Purchase";
import MeNSol from "./pages/MeNSol";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<CookieAccordTwoPane />} />
          <Route path="/about" element={<AboutCookieAccord />} />
          <Route path="/download" element={<Download />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/_me-n-sol" element={<MeNSol />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
