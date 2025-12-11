// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Download from "./pages/Download";
import CookieAccordTwoPane from "./pages/CookieAccordTwoPane";
import AboutCookieAccord from "./pages/AboutCookieAccord";
{/*import ShareCookieStory from "./pages/ShareCookieStory";
import CookieStoryGallery from "./pages/CookieStoryGallery";
import RecipeGallery from "./pages/RecipeGallery";*/}
import Contact from "./pages/Contact";
import Purchase from "./pages/Purchase";

export default function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<CookieAccordTwoPane />} />
          <Route path="/about" element={<AboutCookieAccord />} />
          <Route path="/download" element={<Download />} />

          {/*<Route path="/share" element={<ShareCookieStory />} />
          <Route path="/stories" element={<CookieStoryGallery />} />
          <Route path="/recipes" element={<RecipeGallery />} />
          */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}
