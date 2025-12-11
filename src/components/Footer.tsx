// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-stone-50/70 py-6 text-center text-sm text-stone-600">
      <p className="mb-2">
        A cookie is tiny. The gesture is enormous.
      </p>
      <p className="text-xs text-stone-500">
        Made with sweetness & peace • Cookie Accord © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
