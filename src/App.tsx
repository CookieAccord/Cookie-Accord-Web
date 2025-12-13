// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Download from "./pages/Download";
import CookieAccordTwoPane from "./pages/CookieAccordTwoPane";
import AboutCookieAccord from "./pages/AboutCookieAccord";
// If you want these later, we’ll add them back cleanly:
// import ShareCookieStory from "./pages/ShareCookieStory";
// import CookieStoryGallery from "./pages/CookieStoryGallery";
// import RecipeGallery from "./pages/RecipeGallery";
import Contact from "./pages/Contact";
import Purchase from "./pages/Purchase";
import MeNSol from "./pages/MeNSol";

export default function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<CookieAccordTwoPane />} />
          <Route path="/about" element={<AboutCookieAccord />} />
          <Route path="/download" element={<Download />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/_me-n-sol" element={<MeNSol />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}
