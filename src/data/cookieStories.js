const STORAGE_KEY = "cookie-accord-stories";
const seedStories = [];
export function loadStories() {
    if (typeof window === "undefined")
        return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
export function saveStories(stories) {
    if (typeof window === "undefined")
        return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}
