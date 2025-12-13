import React, { useState } from "react";

export default function ShareCookieButton() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://cookieaccord.com";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Cookie Accord",
          text: "A global cookie tradition project for all the peace bakers of the world.",
          url,
        });
        setMessage("Thanks for sharing ✨");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setMessage("Link copied 🍪");
      }
    } catch {
      setMessage(null);
    }

    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleShare}
        className="text-amber-600 hover:text-amber-800 transition text-xs font-medium"
      >
        Share Cookie Accord
      </button>
      {message && (
        <span className="text-[11px] text-zinc-500">{message}</span>
      )}
    </div>
  );
}
