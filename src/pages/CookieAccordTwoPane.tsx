// CookieAccordTwoPane.tsx — Home page with flags, favorites, and share form

//import React, { useEffect, useMemo, useState } from "react";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Cookie, Search, PlusCircle, Send, BookOpen, Heart } from "lucide-react";
import RAW from "../data/traditionalCookies.json";
import { countryRegions } from "../data/countries";

// --- debug / derived data ---
// Put near the top of CookieAccordTwoPane.tsx

type RecipeItem = {
  id: string;
  title: string;
  country: string;
  ingredients?: string[];
  steps?: string[];
  photoUrl?: string;
};

// ---------------- Story storage (for Stories page) ----------------
type StoryItem = {
  id: string;
  name: string;       // e.g., "Anonymous" or a name later
  location: string;   // usually the country
  cookieName: string; // recipe title
  story: string;      // the actual story text
};

const STORY_STORAGE_KEY = "cookie-accord-stories";

function loadUserStories(): StoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoryItem[]) : [];
  } catch {
    return [];
  }
}

function saveUserStories(stories: StoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(stories));
  } catch {
    // ignore storage errors
  }
}
const USER_RECIPES_KEY = "cookie-accord-user-recipes"; // use the same string you used in RecipeGallery.tsx

function loadUserRecipes(): RecipeItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_RECIPES_KEY);
    return raw ? (JSON.parse(raw) as RecipeItem[]) : [];
  } catch {
    return [];
  }
}

function saveUserRecipes(recipes: RecipeItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(recipes));
  } catch {
    // ignore storage errors
  }
}

// All countries actually used in the cookie data
const allCountries = RAW.map((c) => c.country.trim());

// Any cookie countries that are NOT in countries.json
const missing = allCountries.filter(
  (ct) => !countryRegions.some((cr) => cr.country === ct)
);

console.log("Countries missing from countries.json:", missing);
console.log("Number missing:", missing.length);

// Distinct country count based on the cookie data
export const countryCount = new Set(allCountries).size;
console.log("Distinct countries in RAW:", countryCount);

// ------------------------------- Types -------------------------------
export type CookieRow = {
  id: string;
  country: string;
  title: string;
  description?: string;
  story?: string;
  ingredients?: string[];
  steps?: string[];
  tags?: string[];
  photoUrl?: string;
  // Cultural Details
  photoCredits?: string;
  additionalPhotos?: string[];
  pronounced?: string;
  alternateTitle?: string;
  region?: string;
  language?: string;
  culturalNote?: string;
  birthdayTip?: string;
  personalNote?: string;
  passportStamp?: string;
  dateBaked?: string;
  sharedWith?: string;
  memory?: string;
};

// ------------------------------- Sample Data (fallback) -------------------------------
const SAMPLE_DATA: CookieRow[] = [
  {
    id: "anzac",
    country: "Australia",
    title: "ANZAC Biscuits",
    pronounced: "AN-zak",
    description: "Oaty, caramelized biscuits with golden syrup.",
    ingredients: [
      "1 cup rolled oats",
      "1 cup flour",
      "1/2 cup sugar",
      "1/2 cup coconut",
      "2 tbsp golden syrup",
      "1/2 cup butter",
    ],
    steps: [
      "Melt butter with golden syrup.",
      "Combine dry ingredients; stir in butter mixture.",
      "Scoop, flatten, and bake at 350°F (175°C) for 10–12 minutes.",
    ],
    tags: ["oaty", "caramelized", "chewy"],
    photoUrl:
      "https://images.unsplash.com/photo-1606313564200-6ecb8d6c5b36?auto=format&fit=crop&w=900&q=60",
  },
];

// ------------------------------- Normalize helper -------------------------------
function normalize(raw: any[]): CookieRow[] {
  if (!Array.isArray(raw)) return [];

  const pick = (obj: any, keys: string[], fallback = "") => {
    for (const k of keys) {
      if (obj && obj[k] != null && obj[k] !== "") return obj[k];
    }
    return fallback;
  };

  const toLines = (v: any) =>
    v == null
      ? undefined
      : Array.isArray(v)
      ? v.map(String).map((s) => s.trim()).filter(Boolean)
      : String(v)
          .split(/\r?\n|[|,;]/) // keep regex on ONE line
          .map((s) => s.trim())
          .filter(Boolean);

  const mapped: CookieRow[] = raw.map((r: any, i: number) => {
    const countryVal = pick(r, ["country", "Country", "nation", "Nation"], "Unknown");
    const titleVal = pick(r, ["title", "Title", "cookie", "Cookie", "name", "Name"], "Untitled");
    const descVal = pick(r, ["description", "Description", "note", "Note"], "");
    const storyVal = pick(r, ["story", "Story", "memory", "Memory", "context", "Context"], "");
    const ingredientsVal = pick(
      r,
      ["ingredients", "Ingredients", "ingredient", "Ingredient"],
      undefined
    );
    const stepsVal = pick(
      r,
      [
        "steps",
        "Steps",
        "method",
        "Method",
        "directions",
        "Directions",
        "instruction",
        "Instruction",
        "instructions",
        "Instructions",
        "preparation",
        "Preparation",
      ],
      undefined
    );
    const tagsRaw = pick(r, ["tags", "Tags", "tag", "Tag", "keywords", "Keywords"], "");
    const altTitleVal = pick(r, ["alternateTitle", "altTitle", "alsoKnownAs"], "");
    const pronouncedVal = pick(r, ["pronounced", "Pronounced"], "");
    const culturalNoteVal = pick(
      r,
      ["culturalNote", "CulturalNote", "cultureNote", "CultureNote"],
      ""
    );
    const birthdayTipVal = pick(r, ["birthdayTip", "BirthdayTip", "birthday_tip"], "");
    const personalNoteVal = pick(r, ["personalNote", "PersonalNote", "personal_note"], "");
    const passportStampVal = pick(r, ["passportStamp", "PassportStamp", "passport_stamp"], "");

    return {
      id: r.id || `row-${i}`,
      country: String(countryVal).trim() || "Unknown",
      title: String(titleVal).trim() || "Untitled",
      description: descVal,
      story: storyVal,
      ingredients: toLines(ingredientsVal) || [],
      steps: toLines(stepsVal) || [],
      tags: toLines(tagsRaw) || [],
      alternateTitle: altTitleVal || "",
      pronounced: pronouncedVal || "",
      photoUrl: r.photoUrl || r.photo || "",
      culturalNote: culturalNoteVal || "",
      birthdayTip: birthdayTipVal || "",
      personalNote: personalNoteVal || "",
      passportStamp: passportStampVal || "",
    } as CookieRow;
  });

  // Filter out any placeholder "Untitled" rows
  return mapped.filter((c) => {
    const title = (c.title || "").trim().toLowerCase();
    if (title.startsWith("untitled")) {
      return false;
    }
    return true;
  });
}

// ------------------------------- Helpers -------------------------------
function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
};

const FLAG_IMAGES: Record<string, string> = {
  Afghanistan: "/flags/AfghanistanFlag.jpg",
  Albania: "/flags/AlbaniaFlag.jpg",
  Algeria: "/flags/AlgeriaFlag.jpg",
  Andorra: "/flags/AndorraFlag.jpg",
  Angola: "/flags/AngolaFlag.jpg",
  "Antigua & Barbuda": "/flags/AntiguaBarbudaFlag.jpg",
  Argentina: "/flags/ArgentinaFlag.jpg",
  Armenia: "/flags/ArmeniaFlag.jpg",
  "Australia Indigenous Tradition": "/flags/AustraliaIndigenousTraditionFlag.jpg",
  Australia: "/flags/AustraliaFlag.jpg",
  Austria: "/flags/AustriaFlag.jpg",
  Azerbaijan: "/flags/AzerbaijanFlag.jpg",
  Bahamas: "/flags/BahamasFlag.jpg",
  Bahrain: "/flags/BahrainFlag.jpg",
  Bangladesh: "/flags/BangladeshFlag.jpg",
  Barbados: "/flags/BarbadosFlag.jpg",
  Belarus: "/flags/BelarusFlag.jpg",
  Belgium: "/flags/BelgiumFlag.jpg",
  Belize: "/flags/BelizeFlag.jpg",
  Benin: "/flags/BeninFlag.jpg",
  Bhutan: "/flags/BhutanFlag.jpg",
  Bolivia: "/flags/BoliviaFlag.jpg",
  "Bosnia & Herzegovina": "/flags/BosniaHerzegovinaFlag.jpg",
  Botswana: "/flags/BotswanaFlag.jpg",
  Brazil: "/flags/BrazilFlag.jpg",
  Brunei: "/flags/BruneiFlag.jpg",
  Bulgaria: "/flags/BulgariaFlag.jpg",
  "Burkina Faso": "/flags/BurkinaFasoFlag.jpg",
  Burundi: "/flags/BurundiFlag.jpg",
  "Cabo Verde": "/flags/CaboVerdeFlag.jpg",
  Cambodia: "/flags/CambodiaFlag.jpg",
  Cameroon: "/flags/CameroonFlag.jpg",
  Canada: "/flags/CanadaFlag.jpg",
  "Central African Republic": "/flags/CentralAfricanRepublicFlag.jpg",
  Chad: "/flags/ChadFlag.jpg",
  Chile: "/flags/ChileFlag.jpg",
  China: "/flags/ChinaFlag.jpg",
  Colombia: "/flags/ColombiaFlag.jpg",
  Comoros: "/flags/ComorosFlag.jpg",
  "Congo, Democratic Republic": "/flags/CongoDemocraticRepublicFlag.jpg",
  "Congo, Republic": "/flags/CongoRepublicFlag.jpg",
  "Costa Rica": "/flags/CostaRicaFlag.jpg",
  "Côte d’Ivoire": "/flags/CotedIvoireFlag.jpg",
  Croatia: "/flags/CroatiaFlag.jpg",
  Cuba: "/flags/CubaFlag.jpg",
  Cyprus: "/flags/CyprusFlag.jpg",
  "Czech Republic": "/flags/CzechRepublicFlag.jpg",
  Denmark: "/flags/DenmarkFlag.jpg",
  Djibouti: "/flags/DjiboutiFlag.jpg",
  Dominica: "/flags/DominicaFlag.jpg",
  "Dominican Republic": "/flags/DominicanRepublicFlag.jpg",
  Ecuador: "/flags/EcuadorFlag.jpg",
  Egypt: "/flags/EgyptFlag.jpg",
  "El Salvador": "/flags/ElSalvadorFlag.jpg",
  "Equatorial Guinea": "/flags/EquatorialGuineaFlag.jpg",
  Eritrea: "/flags/EritreaFlag.jpg",
  Estonia: "/flags/EstoniaFlag.jpg",
  Eswatini: "/flags/EswatiniFlag.jpg",
  Ether: "/flags/EtherFlag.png",
  Ethiopia: "/flags/EthiopiaFlag.jpg",
  Fiji: "/flags/FijiFlag.jpg",
  Finland: "/flags/FinlandFlag.jpg",
  France: "/flags/FranceFlag.jpg",
  Gabon: "/flags/GabonFlag.jpg",
  Gambia: "/flags/GambiaFlag.jpg",
  Georgia: "/flags/GeorgiaFlag.jpg",
  Germany: "/flags/GermanyFlag.jpg",
  Ghana: "/flags/GhanaFlag.jpg",
  Greece: "/flags/GreeceFlag.jpg",
  Grenada: "/flags/GrenadaFlag.jpg",
  Guatemala: "/flags/GuatemalaFlag.jpg",
  Guinea: "/flags/GuineaFlag.jpg",
  "Guinea-Bissau": "/flags/GuineaBissauFlag.jpg",
  Guyana: "/flags/GuyanaFlag.jpg",
  Haiti: "/flags/HaitiFlag.jpg",
  Honduras: "/flags/HondurasFlag.jpg",
  Hungary: "/flags/HungaryFlag.jpg",
  Iceland: "/flags/IcelandFlag.jpg",
  India: "/flags/IndiaFlag.jpg",
  Indonesia: "/flags/IndonesiaFlag.jpg",
  Iran: "/flags/IranFlag.jpg",
  Iraq: "/flags/IraqFlag.jpg",
  Ireland: "/flags/IrelandFlag.jpg",
  Israel: "/flags/IsraelFlag.jpg",
  Italy: "/flags/ItalyFlag.jpg",
  Jamaica: "/flags/JamaicaFlag.jpg",
  Japan: "/flags/JapanFlag.jpg",
  Jordan: "/flags/JordanFlag.jpg",
  Kazakhstan: "/flags/KazakhstanFlag.jpg",
  Kenya: "/flags/KenyaFlag.jpg",
  Kiribati: "/flags/KiribatiFlag.jpg",
  "North Korea": "/flags/NorthKoreaFlag.jpg",
  "South Korea": "/flags/SouthKoreaFlag.jpg",
  Kosovo: "/flags/KosovoFlag.jpg",
  Kuwait: "/flags/KuwaitFlag.jpg",
  Kyrgyzstan: "/flags/KyrgyzstanFlag.jpg",
  Laos: "/flags/LaosFlag.jpg",
  Latvia: "/flags/LatviaFlag.jpg",
  Lebanon: "/flags/LebanonFlag.jpg",
  Lesotho: "/flags/LesothoFlag.jpg",
  Liberia: "/flags/LiberiaFlag.jpg",
  Libya: "/flags/LibyaFlag.jpg",
  Liechtenstein: "/flags/LiechtensteinFlag.jpg",
  Lithuania: "/flags/LithuaniaFlag.jpg",
  Luxembourg: "/flags/LuxembourgFlag.jpg",
  Madagascar: "/flags/MadagascarFlag.jpg",
  Malawi: "/flags/MalawiFlag.jpg",
  Malaysia: "/flags/MalaysiaFlag.jpg",
  Maldives: "/flags/MaldivesFlag.jpg",
  Mali: "/flags/MaliFlag.jpg",
  Malta: "/flags/MaltaFlag.jpg",
  "Marshall Islands": "/flags/MarshallIslandsFlag.jpg",
  Mauritania: "/flags/MauritaniaFlag.jpg",
  Mauritius: "/flags/MauritiusFlag.jpg",
  Mexico: "/flags/MexicoFlag.jpg",
  Micronesia: "/flags/MicronesiaFlag.jpg",
  Moldova: "/flags/MoldovaFlag.jpg",
  Monaco: "/flags/MonacoFlag.jpg",
  Mongolia: "/flags/MongoliaFlag.jpg",
  Montenegro: "/flags/MontenegroFlag.jpg",
  Morocco: "/flags/MoroccoFlag.jpg",
  Mozambique: "/flags/MozambiqueFlag.jpg",
  "Myanmar (Burma)": "/flags/MyanmarFlag.jpg",
  Namibia: "/flags/NamibiaFlag.jpg",
  Nauru: "/flags/NauruFlag.jpg",
  Nepal: "/flags/NepalFlag.jpg",
  Netherlands: "/flags/NetherlandsFlag.jpg",
  "New Zealand": "/flags/NewZealandFlag.jpg",
  Nicaragua: "/flags/NicaraguaFlag.jpg",
  Niger: "/flags/NigerFlag.jpg",
  Nigeria: "/flags/NigeriaFlag.jpg",
  "North Macedonia": "/flags/NorthMacedoniaFlag.jpg",
  Norway: "/flags/NorwayFlag.jpg",
  Oman: "/flags/OmanFlag.jpg",
  Pakistan: "/flags/PakistanFlag.jpg",
  Palau: "/flags/PalauFlag.jpg",
  Palestine: "/flags/PalestineFlag.jpg",
  Panama: "/flags/PanamaFlag.jpg",
  "Papua New Guinea": "/flags/PapuaNewGuineaFlag.jpg",
  Paraguay: "/flags/ParaguayFlag.jpg",
  Peru: "/flags/PeruFlag.jpg",
  Philippines: "/flags/PhilippinesFlag.jpg",
  Poland: "/flags/PolandFlag.jpg",
  Portugal: "/flags/PortugalFlag.jpg",
  Qatar: "/flags/QatarFlag.jpg",
  Romania: "/flags/RomaniaFlag.jpg",
  Russia: "/flags/RussiaFlag.jpg",
  Rwanda: "/flags/RwandaFlag.jpg",
  "Saint Kitts & Nevis": "/flags/SaintKittsAndNevis.jpg",
  "Saint Lucia": "/flags/SaintLuciaflag.jpg",
  "Saint Vincent & the Grenadines": "/flags/SaintVincentAndTheGrenadines.jpg",
  Samoa: "/flags/SamoaFlag.jpg",
  "San Marino": "/flags/SanMarinoFlag.jpg",
  "Sao Tome and Principe": "/flags/SaoTomeAndPrincipeFlag.jpg",
  "Saudi Arabia": "/flags/SaudiArabiaFlag.jpg",
  Senegal: "/flags/SenegalFlag.jpg",
  Serbia: "/flags/SerbiaFlag.jpg",
  Seychelles: "/flags/SeychellesFlag.jpg",
  "Sierra Leone": "/flags/SierraLeoneFlag.jpg",
  Singapore: "/flags/SingaporeFlag.jpg",
  Slovakia: "/flags/SlovakiaFlag.jpg",
  Slovenia: "/flags/SloveniaFlag.jpg",
  "Solomon Islands": "/flags/SolomonIslandsFlag.jpg",
  Somalia: "/flags/SomaliaFlag.jpg",
  "South Africa": "/flags/SouthAfricaFlag.jpg",
  "South Sudan": "/flags/SouthSudanFlag.jpg",
  Spain: "/flags/SpainFlag.jpg",
  "Sri Lanka": "/flags/SriLankaFlag.jpg",
  Sudan: "/flags/SudanFlag.jpg",
  Suriname: "/flags/SurinameFlag.jpg",
  Sweden: "/flags/SwedenFlag.jpg",
  Switzerland: "/flags/SwitzerlandFlag.jpg",
  Syria: "/flags/SyriaFlag.jpg",
  Taiwan: "/flags/TaiwanFlag.jpg",
  Tajikistan: "/flags/TajikistanFlag.jpg",
  Tanzania: "/flags/TanzaniaFlag.jpg",
  Thailand: "/flags/ThailandFlag.jpg",
  Togo: "/flags/TogoFlag.jpg",
  Tonga: "/flags/TongaFlag.jpg",
  "Timor-Leste": "/flags/TimorLesteFlag.jpg",
  "Trinidad and Tobago": "/flags/TrinidadAndTobagoFlag.jpg",
  Tunisia: "/flags/TunisiaFlag.jpg",
  Turkey: "/flags/TurkeyFlag.jpg",
  Turkmenistan: "/flags/TurkmenistanFlag.jpg",
  Tuvalu: "/flags/TuvaluFlag.jpg",
  Uganda: "/flags/UgandaFlag.jpg",
  Ukraine: "/flags/UkraineFlag.jpg",
  "United Arab Emirates": "/flags/UnitedArabEmiratesFlag.jpg",
  "United Kingdom": "/flags/UnitedKingdomFlag.jpg",
  "United States of America (USA)": "/flags/UnitedStatesFlag.jpg",
  Uruguay: "/flags/UruguayFlag.jpg",
  Uzbekistan: "/flags/UzbekistanFlag.jpg",
  Vanuatu: "/flags/VanuatuFlag.jpg",
  "Vatican City": "/flags/VaticanCityFlag.jpg",
  Venezuela: "/flags/VenezuelaFlag.jpg",
  Vietnam: "/flags/VietnamFlag.jpg",
  Yemen: "/flags/YemenFlag.jpg",
  Zambia: "/flags/ZambiaFlag.jpg",
  Zimbabwe: "/flags/ZimbabweFlag.jpg",
};

function getFlagSrc(country: string | undefined | null): string | null {
  const key = (country || "").trim();
  if (!key) return null;
  return FLAG_IMAGES[key] || null;
}

// ------------------------------- Minimal UI -------------------------------
function Button(
  {
    children,
    variant = "default",
    className = "",
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" }
) {
  const base =
    "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-400";
  const styles =
    variant === "outline"
      ? "border border-amber-300 text-amber-800 bg-white hover:bg-amber-50"
      : "bg-amber-600 text-white hover:bg-amber-700";
  return (
    <button className={cx(base, styles, className)} {...props}>
      {children}
    </button>
  );
}

function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("rounded-3xl border border-zinc-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        "w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200",
        className
      )}
      {...props}
    />
  );
}

// ------------------------------- Left: Country Picker -------------------------------
function CountryPicker({
  data,
  favorites,
  onPick,
  onToggleFavorite,
  onSearchChange,
}: {
  data: CookieRow[];
  favorites: string[];
  onPick: (cookie: CookieRow) => void;
  onToggleFavorite: (cookie: CookieRow) => void;
  onSearchChange?: () => void;
}) {

  const [filter, setFilter] = useState("");

 // 1. Countries from data (only once)
const countries = useMemo(() => {
  const set = new Set<string>();
  data.forEach((c) => set.add(c.country.trim()));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}, [data]);

// 2. Map: country → region
const countryRegionsByName = useMemo(() => {
  const map = new Map<string, string>();
  (countryRegions ?? []).forEach((c) => {
    map.set(c.country.trim(), c.region);
  });
  return map;
}, []);

// 3. Visible countries (filtered by name OR region)
const visibleCountries = useMemo(() => {
  const q = filter.trim().toLowerCase();
  if (!q) return countries;

  return countries.filter((name) => {
    const region = countryRegionsByName.get(name) ?? "";
    return (
      name.toLowerCase().includes(q) ||
      region.toLowerCase().includes(q)
    );
  });
}, [countries, filter, countryRegionsByName]);

// 4. Cookies by country (your original code)
const cookiesByCountry = useMemo(() => {
  const map = new Map<string, CookieRow[]>();
  data.forEach((row) => {
    const key = row.country.trim();
    const arr = map.get(key) || [];
    arr.push(row);
    map.set(key, arr);
  });
  return map;
}, [data]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-zinc-500" />
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Type to jump to a country…"
          aria-label="Filter countries"
        />
      </div>

      <div className="max-h-[50vh] overflow-auto rounded-2xl border border-zinc-200">
        <img
  className="pointer-events-none absolute left-1/2 top-[70%] 
             -translate-x-1/2 -translate-y-1/2 
             opacity-7 w-1/2"
  src="/images/global-cookie-map.png"
  alt=""
/>
        
        <ul className="divide-y divide-zinc-100">
          {visibleCountries.map((country) => (
            <li key={country} className="p-2">
              <details>
               <summary className="flex cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
  {getFlagSrc(country) ? (
    <img
      src={getFlagSrc(country)!}
      alt={country + " flag"}
      className="h-4 w-6 rounded-sm border border-zinc-300 object-cover"
    />
  ) : (
    <span className="inline-block h-4 w-6 rounded-sm bg-zinc-200" />
  )}
  
  <span className="flex flex-col">
    <span>{country}</span>
    {countryRegionsByName.get(country) && (
      <span className="text-xs text-zinc-500">
        {countryRegionsByName.get(country)}
      </span>
    )}
  </span>
</summary>

                <div className="mt-2 space-y-1 pl-2">
                  {(cookiesByCountry.get(country) || []).map((ck) => {
  const fav = favorites.includes(ck.id);
  return (
    <div
  key={ck.id}
  className="flex items-center justify-between gap-2"
>
      <button
        className="flex-1 rounded-xl px-2 py-1 text-left text-sm text-zinc-700 hover:bg-amber-50"
        onClick={() => onPick(ck)}
      >
        {ck.title}
      </button>
      <button
        type="button"
        onClick={() => onToggleFavorite(ck)}
        className="rounded-full p-1 hover:bg-amber-50"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cx(
            "h-4 w-4",
            fav ? "fill-red-500 text-red-500" : "text-zinc-400"
          )}
        />
      </button>
    </div>
  );
})}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ------------------------------- Right: Submission Form -------------------------------
function SubmissionForm({ onSubmit }: { onSubmit: (row: CookieRow) => void }) {
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [story, setStory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const tags = useMemo(() => {
    const words =
      (story + " " + title).toLowerCase().match(/[a-zA-Z]+/g) || [];
    const uniq = Array.from(new Set(words));
    return uniq.slice(0, 6);
  }, [story, title]);

  const preview: CookieRow | null =
    title || country || story || ingredients || steps || photoUrl
      ? {
          id: `new-${Date.now()}`,
          title: title || "Untitled Cookie",
          country: country || "Unknown",
          story,
          description: story ? story.slice(0, 120) : undefined,
          ingredients: ingredients
            ? ingredients
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined,
          steps: steps
            ? steps
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined,
          tags,
          photoUrl: photoUrl || undefined,
        }
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) return;
    onSubmit(preview);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Cookie Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Nonna’s Almond Crescents"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Country
            </label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g., Italy"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700">
            Story (why this cookie matters)
          </label>
          <Textarea
            rows={5}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="A short memory, celebration, or cultural note…"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Ingredients (one per line)
            </label>
            <Textarea
              rows={5}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={`1 cup flour\n1/2 cup sugar\n…`}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Steps (one per line)
            </label>
            <Textarea
              rows={5}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder={`Preheat oven…\nMix butter and sugar…\n…`}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700">
            Photo URL (optional)
          </label>
          <Input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 text-xs text-zinc-600">
            <span className="mr-1">Auto-tags:</span>
            {tags.length ? (
              tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-zinc-100 px-1.5 py-0.5"
                >
                  #{t}
                </span>
              ))
            ) : (
              <span>(appear as you type)</span>
            )}
          </div>

          <Button type="submit">
            <Send className="h-4 w-4" />
            <span>Submit</span>
          </Button>
        </div>
      </form>

      {preview && (
        <motion.div {...fadeIn}>
          <h3 className="mb-2 text-sm font-semibold text-zinc-700">
            Live Preview
          </h3>
          <CookieCard data={preview} accent="emerald" />
        </motion.div>
      )}
    </div>
  );
}

// ------------------------------- Cookie Card -------------------------------
function CookieCard({
  data,
  accent = "amber",
  isFavorite,
  onToggleFavorite,
  scrollRef,
  onClose,
}: {
  data: CookieRow;
  accent?: "amber" | "emerald";
  isFavorite?: boolean;
  onToggleFavorite?: (cookie: CookieRow) => void;
  scrollRef?: React.RefObject<HTMLHeadingElement>;
  onClose?: () => void;
}) {
  return (
    <Card
      className="overflow-hidden cursor-pointer"
      onClick={() => {
        if (onClose) onClose();
      }}
    >
      <div
        className={cx(
          "h-1 w-full",
          accent === "amber" ? "bg-amber-300" : "bg-emerald-300"
        )}
      />
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[160px,1fr]">
        <div className="h-32 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt={data.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[120px] items-center justify-center text-zinc-400">
              <Cookie className="h-10 w-10" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4
                ref={scrollRef}
                className="text-lg font-semibold text-zinc-900"
              >
                {data.title}
                {data.pronounced && (
                  <span className="ml-2 text-xs font-normal text-zinc-500">
                    ({data.pronounced})
                  </span>
                )}
              </h4>

              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // don't close the card when clicking the heart
                    onToggleFavorite(data);
                  }}
                  className="rounded-full p-1 hover:bg-amber-50"
                  aria-label={
                    isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Heart
                    className={cx(
                      "h-4 w-4",
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-zinc-400"
                    )}
                  />
                </button>
              )}
            </div>

            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              {data.country}
            </span>
          </div>

          {data.alternateTitle && (
            <p className="text-xs text-zinc-600">
              Also known as: {data.alternateTitle}
            </p>
          )}
          {data.description && (
            <p className="text-sm text-zinc-700">{data.description}</p>
          )}
          {data.story && (
            <p className="text-sm italic text-zinc-600">“{data.story}”</p>
          )}

          {(data.ingredients && data.ingredients.length > 0) ||
          (data.steps && data.steps.length > 0) ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.ingredients && data.ingredients.length > 0 ? (
                <div>
                  <h5 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Ingredients
                  </h5>
                  <ul className="list-disc pl-5 text-sm text-zinc-700">
                    {data.ingredients.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {data.steps && data.steps.length > 0 ? (
                <div>
                  <h5 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Steps
                  </h5>
                  <ol className="list-decimal pl-5 text-sm text-zinc-700">
                    {data.steps.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl bg-amber-50/60 p-3 text-xs text-amber-800">
              No steps yet for this recipe. Add your tips on the right and we’ll
              include them!
            </div>
          )}

          {(data.culturalNote ||
            data.birthdayTip ||
            data.personalNote ||
            data.passportStamp) && (
            <Card className="mt-3 border-dashed border-amber-200 bg-amber-50/40 p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {data.culturalNote && (
                  <p className="sm:col-span-2 text-xs italic text-zinc-700">
                    “{data.culturalNote}”
                  </p>
                )}
                {data.birthdayTip && (
                  <p className="text-xs text-zinc-700">
                    <strong>Birthday Tip:</strong> {data.birthdayTip}
                  </p>
                )}
                {data.personalNote && (
                  <p className="text-xs italic text-zinc-700">
                    <strong>Personal Note:</strong> {data.personalNote}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}

// ------------------------------- Page Shell -------------------------------
export default function CookieAccordTwoPane() {
  const [submitted, setSubmitted] = useState<CookieRow | null>(null);

  // this is the ONLY "which recipe is open" state
  const [selectedCookie, setSelectedCookie] = useState<CookieRow | null>(null);

  const detailsRef = useRef<HTMLDivElement | null>(null);

  // 🔁 TOGGLE HANDLER (click same cookie = close, different = open)
  const handlePick = (ck: CookieRow) => {
    setSelectedCookie((prev) =>
      prev && prev.id === ck.id ? null : ck
    );
  };

  // 🔍 scroll into view when a cookie is opened
  useEffect(() => {
    if (!selectedCookie || !detailsRef.current) return;

    const el = detailsRef.current;

    const id = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();

      // If it's already fully visible, do nothing
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        return;
      }

      window.scrollTo({
        top: window.scrollY + rect.top - 120,
        behavior: "smooth",
      });
    }, 80);

    return () => window.clearTimeout(id);
  }, [selectedCookie]);

  const [data] = useState<CookieRow[]>(() => {
    try {
      const arr = Array.isArray(RAW)
        ? RAW
        : (RAW as any).cookies ||
          (RAW as any).data ||
          (RAW as any).items ||
          (RAW as any).rows ||
          (RAW as any).recipes ||
          [];
      const norm = normalize(arr);
      return norm.length ? norm : SAMPLE_DATA;
    } catch {
      return SAMPLE_DATA;
    }
  });

 // 💾 When someone submits a cookie on the right-hand form,
// save it so RecipeGallery AND Stories can find it.
const handleSubmittedCookie = (row: CookieRow) => {
  console.log("Saving submitted cookie to localStorage from Home:", row);

 // 1) Save as a recipe (for Recipe Gallery)
const newRecipe: RecipeItem = {
  id: row.id,
  title: row.title,
  country: row.country || "Somewhere",
  ingredients: row.ingredients || [],
  steps: row.steps || [],
  photoUrl: row.photoUrl || "",
};

const existingRecipes = loadUserRecipes();
const updatedRecipes = [...existingRecipes, newRecipe];
saveUserRecipes(updatedRecipes);

// 2) If there *is* a story, save it for Stories
if (row.story && row.story.trim()) {
  const newStory: StoryItem = {
    id: row.id,
    name: "Anonymous", // or real name later
    location: row.country || "Somewhere Cozy",
    cookieName: row.title || "Untitled Cookie",
    story: row.story.trim(),
  };

  const existingStories = loadUserStories();
  const updatedStories = [...existingStories, newStory];
  saveUserStories(updatedStories);
}

setSubmitted(row);

alert(
  "Thank you for sharing! Your recipe is now saved in this browser.\nYou can see it in the Recipes tab, and your story in Stories."
);
};

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("cookie-favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("cookie-favorites", JSON.stringify(favorites));
      }
    } catch {
      // ignore storage errors
    }
  }, [favorites]);

  function isFavorite(id: string | undefined) {
    if (!id) return false;
    return favorites.includes(id);
  }

  function toggleFavorite(row: CookieRow) {
    if (!row.id) return;
    setFavorites((prev) =>
      prev.includes(row.id) ? prev.filter((x) => x !== row.id) : [...prev, row.id]
    );
  }

  const viewData = useMemo(() => {
    if (!showFavoritesOnly) return data;
    return data.filter((r) => isFavorite(r.id));
  }, [data, showFavoritesOnly, favorites]);

const [cookieKeyword, setCookieKeyword] = useState("");

const filteredByKeyword = useMemo(() => {
  const q = cookieKeyword.trim().toLowerCase();
  if (!q) return viewData;

  return viewData.filter((c) => {
    const hay = [
      c.title,
      c.alternateTitle,
      c.country,
      c.pronounced,
      c.culturalNote,
      c.personalNote,
      c.birthdayTip,
      Array.isArray(c.ingredients) ? c.ingredients.join(" ") : "",
      Array.isArray(c.steps) ? c.steps.join(" ") : "",
      Array.isArray(c.tags) ? c.tags.join(" ") : "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  });
}, [viewData, cookieKeyword]);

const cookieCount = filteredByKeyword.length;

const countryCountShown = new Set(
  filteredByKeyword
    .map((c) => (c.country || "").trim())
    .filter(Boolean)
).size;

  const heroCopy =
   <p className="text-zinc-700">
  <strong className="block mb-1 text-base sm:text-lg font-semibold">
    Cookie Accord gathers the world’s beloved cookies into one welcoming place—
    each one carrying its own notes of culture, memory, and meaning.
  </strong>
  Wander through these traditions, and let the kindness baked into every cookie
  meet you along the way. Our companion book takes these flavors a step further—
  lingering in stories and reflections for your shared moments off screen. It also
  helps expand the Cookie Accord project—finding common ground, one tradition at a time.
  <Cookie
    className="inline-block ml-1 h-4 w-4 opacity-90 translate-y-[1px]"
    style={{ color: "#A25528" }}
  />
</p>

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-50 via-white to-emerald-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Hero section */}
        <section className="rounded-3xl border border-amber-100 bg-white/70 p-4 shadow-sm">
          {/* HERO SECTION WITH WATERMARK + SHIMMER */}
<p className="text-sm text-zinc-800 leading-relaxed bg-white/80 rounded-3xl px-5 py-4 shadow-sm border border-amber-100">
  {heroCopy}
</p>

           </section>

        {/* Two-column body */}
        <main className="block">
          {/* Left Column */}
<section>
  <motion.div {...fadeIn}>
    <Card className="p-4">

      {/* Cookie keyword search */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-zinc-500" />
          <Input
            value={cookieKeyword}
            onChange={(e) => {
              setCookieKeyword(e.target.value);
              setSelectedCookie(null);
            }}
            placeholder="Search cookies (e.g., coconut, chocolate, almond)…"
            aria-label="Search cookies"
          />
          {cookieKeyword && (
            <button
              type="button"
              className="text-xs text-amber-700 hover:underline"
              onClick={() => {
                setCookieKeyword("");
                setSelectedCookie(null);
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* 👇 THIS LINE GOES HERE */}
        <p className="mt-1 text-xs text-zinc-600">
          Showing{" "}
          <span className="font-medium text-zinc-800">{cookieCount}</span>{" "}
          {cookieCount === 1 ? "cookie" : "cookies"} across{" "}
          <span className="font-medium text-zinc-800">
            {countryCountShown}
          </span>{" "}
          {countryCountShown === 1 ? "country" : "countries"}
        </p>
      </div>

      {/* Country list */}
      <CountryPicker
        data={filteredByKeyword}
        favorites={favorites}
        onPick={handlePick}
        onToggleFavorite={toggleFavorite}
        onSearchChange={() => setSelectedCookie(null)}
      />

    </Card>
  </motion.div>

  {/* Selected cookie card */}
  {selectedCookie && (
    <motion.div ref={detailsRef} className="mt-4" {...fadeIn}>
      <CookieCard
        data={selectedCookie}
        isFavorite={isFavorite(selectedCookie.id)}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedCookie(null)}
      />
    </motion.div>
  )}
</section>

       </main>

        {/* How it works */}
        <section className="grid grid-cols-1 gap-4 rounded-3xl border border-amber-100 bg-white/70 p-4 text-sm text-zinc-700 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-amber-50 p-2">
              <BookOpen className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Explore traditions</h3>
              <p className="text-xs text-zinc-600">
                Wander through cookies by country and discover how different cultures celebrate
                with something sweet.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-emerald-50 p-2">
              <PlusCircle className="h-4 w-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Share your story</h3>
              <p className="text-xs text-zinc-600">
                Soon you’ll be able to share your own cookie traditions, memories, and recipes.
  For now, enjoy exploring the world’s favorites.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-amber-50 p-2">
              <Heart className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Save your favorites</h3>
              <p className="text-xs text-zinc-600">
                Mark recipes you love as favorites so you can find them again for birthdays,
                holidays, and rainy afternoons.
              </p>
            </div>
          </div>
        </section>

          </div>
    </div>
  );
}
