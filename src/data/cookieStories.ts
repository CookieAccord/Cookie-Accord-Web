// src/data/cookieStories.ts
export type Story = {
  id: string;
  name: string;
  location: string;
  cookieName: string;
  story: string;
};

const STORAGE_KEY = "cookie-accord-stories";

const seedStories: Story[] = [];

export function loadStories(): Story[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Story[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStories(stories: Story[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}
