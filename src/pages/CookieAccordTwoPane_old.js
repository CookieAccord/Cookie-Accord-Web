import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// CookieAccordTwoPane.tsx — Home page with flags, favorites, and share form
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cookie, Search, PlusCircle, Send, BookOpen, Heart } from "lucide-react";
import RAW from "../data/traditionalCookies.json";
console.log("Number of cookie entries in RAW:", RAW.length);
//import { countries } from "../data/countries";
import { countryRegions } from "../data/countries";
// ------------------------------- Sample Data (fallback) -------------------------------
const SAMPLE_DATA = [
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
        photoUrl: "https://images.unsplash.com/photo-1606313564200-6ecb8d6c5b36?auto=format&fit=crop&w=900&q=60",
    },
];
// ------------------------------- Normalize helper -------------------------------
function normalize(raw) {
    if (!Array.isArray(raw))
        return [];
    const pick = (obj, keys, fallback = "") => {
        for (const k of keys) {
            if (obj && obj[k] != null && obj[k] !== "")
                return obj[k];
        }
        return fallback;
    };
    const toLines = (v) => v == null
        ? undefined
        : Array.isArray(v)
            ? v.map(String).map((s) => s.trim()).filter(Boolean)
            : String(v)
                .split(/\r?\n|[|,;]/) // keep regex on ONE line
                .map((s) => s.trim())
                .filter(Boolean);
    const mapped = raw.map((r, i) => {
        const countryVal = pick(r, ["country", "Country", "nation", "Nation"], "Unknown");
        const titleVal = pick(r, ["title", "Title", "cookie", "Cookie", "name", "Name"], "Untitled");
        const descVal = pick(r, ["description", "Description", "note", "Note"], "");
        const storyVal = pick(r, ["story", "Story", "memory", "Memory", "context", "Context"], "");
        const ingredientsVal = pick(r, ["ingredients", "Ingredients", "ingredient", "Ingredient"], undefined);
        const stepsVal = pick(r, [
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
        ], undefined);
        const tagsRaw = pick(r, ["tags", "Tags", "tag", "Tag", "keywords", "Keywords"], "");
        const altTitleVal = pick(r, ["alternateTitle", "altTitle", "alsoKnownAs"], "");
        const pronouncedVal = pick(r, ["pronounced", "Pronounced"], "");
        const culturalNoteVal = pick(r, ["culturalNote", "CulturalNote", "cultureNote", "CultureNote"], "");
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
        };
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
function cx(...xs) {
    return xs.filter(Boolean).join(" ");
}
const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
};
const FLAG_IMAGES = {
    Afghanistan: "/flags/AfghanistanFlag.jpg",
    Albania: "/flags/AlbaniaFlag.jpg",
    Algeria: "/flags/AlgeriaFlag.jpg",
    Andorra: "/flags/AndorraFlag.jpg",
    Angola: "/flags/AngolaFlag.jpg",
    "Antigua & Barbuda": "/flags/AntiguaBarbudaFlag.jpg",
    Argentina: "/flags/ArgentinaFlag.jpg",
    Armenia: "/flags/ArmeniaFlag.jpg",
    Australia: "/flags/AustraliaFlag.jpg",
    "Australia Indigenous Tradition": "/flags/AustraliaIndigenousTraditionFlag.jpg",
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
function getFlagSrc(country) {
    const key = (country || "").trim();
    if (!key)
        return null;
    return FLAG_IMAGES[key] || null;
}
// ------------------------------- Minimal UI -------------------------------
function Button({ children, variant = "default", className = "", ...props }) {
    const base = "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-400";
    const styles = variant === "outline"
        ? "border border-amber-300 text-amber-800 bg-white hover:bg-amber-50"
        : "bg-amber-600 text-white hover:bg-amber-700";
    return (_jsx("button", { className: cx(base, styles, className), ...props, children: children }));
}
function Card({ className = "", ...props }) {
    return (_jsx("div", { className: cx("rounded-3xl border border-zinc-200 bg-white shadow-sm", className), ...props }));
}
function Input({ className = "", ...props }) {
    return (_jsx("input", { className: cx("w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200", className), ...props }));
}
function Textarea({ className = "", ...props }) {
    return (_jsx("textarea", { className: cx("w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200", className), ...props }));
}
// ------------------------------- Left: Country Picker -------------------------------
function CountryPicker({ data, favorites, onPick, onToggleFavorite, }) {
    const [filter, setFilter] = useState("");
    // 1. Countries from data (only once)
    const countries = useMemo(() => {
        const set = new Set();
        data.forEach((c) => set.add(c.country.trim()));
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [data]);
    // 2. Map: country → region
    const countryRegionsByName = useMemo(() => {
        const map = new Map();
        (countryRegions ?? []).forEach((c) => {
            map.set(c.country.trim(), c.region);
        });
        return map;
    }, []);
    // 3. Visible countries (filtered by name OR region)
    const visibleCountries = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q)
            return countries;
        return countries.filter((name) => {
            const region = countryRegionsByName.get(name) ?? "";
            return (name.toLowerCase().includes(q) ||
                region.toLowerCase().includes(q));
        });
    }, [countries, filter, countryRegionsByName]);
    // 4. Cookies by country (your original code)
    const cookiesByCountry = useMemo(() => {
        const map = new Map();
        data.forEach((row) => {
            const key = row.country.trim();
            const arr = map.get(key) || [];
            arr.push(row);
            map.set(key, arr);
        });
        return map;
    }, [data]);
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Search, { className: "h-4 w-4 text-zinc-500" }), _jsx(Input, { value: filter, onChange: (e) => setFilter(e.target.value), placeholder: "Type to jump to a country or region\u2026", "aria-label": "Filter countries" })] }), _jsx("div", { className: "max-h-[50vh] overflow-auto rounded-2xl border border-zinc-200", children: _jsx("ul", { className: "divide-y divide-zinc-100", children: visibleCountries.map((country) => (_jsx("li", { className: "p-2", children: _jsxs("details", { children: [_jsxs("summary", { className: "flex cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium text-zinc-800 hover:bg-zinc-50", children: [getFlagSrc(country) ? (_jsx("img", { src: getFlagSrc(country), alt: country + " flag", className: "h-4 w-6 rounded-sm border border-zinc-300 object-cover" })) : (_jsx("span", { className: "inline-block h-4 w-6 rounded-sm bg-zinc-200" })), _jsxs("span", { className: "flex flex-col", children: [_jsx("span", { children: country }), countryRegionsByName.get(country) && (_jsx("span", { className: "text-xs text-zinc-500", children: countryRegionsByName.get(country) }))] })] }), _jsx("div", { className: "mt-2 space-y-1 pl-2", children: (cookiesByCountry.get(country) || []).map((ck) => {
                                        const fav = favorites.includes(ck.id);
                                        return (_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("button", { className: "flex-1 rounded-xl px-2 py-1 text-left text-sm text-zinc-700 hover:bg-amber-50", onClick: () => onPick(ck), children: ck.title }), _jsx("button", { type: "button", onClick: () => onToggleFavorite(ck), className: "rounded-full p-1 hover:bg-amber-50", "aria-label": fav ? "Remove from favorites" : "Add to favorites", children: _jsx(Heart, { className: cx("h-4 w-4", fav ? "fill-red-500 text-red-500" : "text-zinc-400") }) })] }, ck.id));
                                    }) })] }) }, country))) }) })] }));
}
// ------------------------------- Right: Submission Form -------------------------------
function SubmissionForm({ onSubmit }) {
    const [title, setTitle] = useState("");
    const [country, setCountry] = useState("");
    const [story, setStory] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const tags = useMemo(() => {
        const words = (story + " " + title).toLowerCase().match(/[a-zA-Z]+/g) || [];
        const uniq = Array.from(new Set(words));
        return uniq.slice(0, 6);
    }, [story, title]);
    const preview = title || country || story || ingredients || steps || photoUrl
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
    function handleSubmit(e) {
        e.preventDefault();
        if (!preview)
            return;
        onSubmit(preview);
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-medium text-zinc-700", children: "Cookie Title" }), _jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g., Nonna\u2019s Almond Crescents" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-medium text-zinc-700", children: "Country" }), _jsx(Input, { value: country, onChange: (e) => setCountry(e.target.value), placeholder: "e.g., Italy" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-medium text-zinc-700", children: "Story (why this cookie matters)" }), _jsx(Textarea, { rows: 5, value: story, onChange: (e) => setStory(e.target.value), placeholder: "A short memory, celebration, or cultural note\u2026" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-medium text-zinc-700", children: "Ingredients (one per line)" }), _jsx(Textarea, { rows: 5, value: ingredients, onChange: (e) => setIngredients(e.target.value), placeholder: `1 cup flour\n1/2 cup sugar\n…` })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-medium text-zinc-700", children: "Steps (one per line)" }), _jsx(Textarea, { rows: 5, value: steps, onChange: (e) => setSteps(e.target.value), placeholder: `Preheat oven…\nMix butter and sugar…\n…` })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-medium text-zinc-700", children: "Photo URL (optional)" }), _jsx(Input, { value: photoUrl, onChange: (e) => setPhotoUrl(e.target.value), placeholder: "https://\u2026" })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-1 text-xs text-zinc-600", children: [_jsx("span", { className: "mr-1", children: "Auto-tags:" }), tags.length ? (tags.map((t) => (_jsxs("span", { className: "rounded bg-zinc-100 px-1.5 py-0.5", children: ["#", t] }, t)))) : (_jsx("span", { children: "(appear as you type)" }))] }), _jsxs(Button, { type: "submit", children: [_jsx(Send, { className: "h-4 w-4" }), " Submit"] })] })] }), preview && (_jsxs(motion.div, { ...fadeIn, children: [_jsx("h3", { className: "mb-2 text-sm font-semibold text-zinc-700", children: "Live Preview" }), _jsx(CookieCard, { data: preview, accent: "emerald" })] }))] }));
}
// ------------------------------- Cookie Card -------------------------------
function CookieCard({ data, accent = "amber", isFavorite, onToggleFavorite, }) {
    return (_jsxs(Card, { className: "overflow-hidden", children: [_jsx("div", { className: cx("h-1 w-full", accent === "amber" ? "bg-amber-300" : "bg-emerald-300") }), _jsxs("div", { className: "grid grid-cols-1 gap-4 p-4 sm:grid-cols-[160px,1fr]", children: [_jsx("div", { className: "h-32 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50", children: data.photoUrl ? (_jsx("img", { src: data.photoUrl, alt: data.title, className: "h-full w-full object-cover" })) : (_jsx("div", { className: "flex h-full min-h-[120px] items-center justify-center text-zinc-400", children: _jsx(Cookie, { className: "h-10 w-10" }) })) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("h4", { className: "text-lg font-semibold text-zinc-900", children: [data.title, data.pronounced && (_jsxs("span", { className: "ml-2 text-xs font-normal text-zinc-500", children: ["(", data.pronounced, ")"] }))] }), onToggleFavorite && (_jsx("button", { type: "button", onClick: () => onToggleFavorite(data), className: "rounded-full p-1 hover:bg-amber-50", "aria-label": isFavorite ? "Remove from favorites" : "Add to favorites", children: _jsx(Heart, { className: cx("h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "text-zinc-400") }) }))] }), _jsx("span", { className: "rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700", children: data.country })] }), data.alternateTitle && (_jsxs("p", { className: "text-xs text-zinc-600", children: ["Also known as: ", data.alternateTitle] })), data.description && _jsx("p", { className: "text-sm text-zinc-700", children: data.description }), data.story && _jsxs("p", { className: "text-sm italic text-zinc-600", children: ["\u201C", data.story, "\u201D"] }), (data.ingredients && data.ingredients.length > 0) ||
                                (data.steps && data.steps.length > 0) ? (_jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [data.ingredients && data.ingredients.length > 0 ? (_jsxs("div", { children: [_jsx("h5", { className: "mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Ingredients" }), _jsx("ul", { className: "list-disc pl-5 text-sm text-zinc-700", children: data.ingredients.map((it, i) => (_jsx("li", { children: it }, i))) })] })) : null, data.steps && data.steps.length > 0 ? (_jsxs("div", { children: [_jsx("h5", { className: "mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Steps" }), _jsx("ol", { className: "list-decimal pl-5 text-sm text-zinc-700", children: data.steps.map((it, i) => (_jsx("li", { children: it }, i))) })] })) : null] })) : (_jsx("div", { className: "rounded-xl bg-amber-50/60 p-3 text-xs text-amber-800", children: "No steps yet for this recipe. Add your tips on the right and we\u2019ll include them!" })), (data.culturalNote || data.birthdayTip || data.personalNote || data.passportStamp) && (_jsx(Card, { className: "mt-3 border-dashed border-amber-200 bg-amber-50/40 p-3", children: _jsxs("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: [data.culturalNote && (_jsxs("p", { className: "sm:col-span-2 text-xs italic text-zinc-700", children: ["\u201C", data.culturalNote, "\u201D"] })), data.birthdayTip && (_jsxs("p", { className: "text-xs text-zinc-700", children: [_jsx("strong", { children: "Birthday Tip:" }), " ", data.birthdayTip] })), data.personalNote && (_jsxs("p", { className: "text-xs italic text-zinc-700", children: [_jsx("strong", { children: "Personal Note:" }), " ", data.personalNote] }))] }) })), data.tags && data.tags.length > 0 ? (_jsx("div", { className: "flex flex-wrap gap-1 pt-1", children: data.tags.map((t) => (_jsxs("span", { className: "rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700", children: ["#", t] }, t))) })) : null] })] })] }));
}
// ------------------------------- Page Shell -------------------------------
export default function CookieAccordTwoPane() {
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(null);
    const [data] = useState(() => {
        try {
            const arr = Array.isArray(RAW)
                ? RAW
                : RAW.cookies ||
                    RAW.data ||
                    RAW.items ||
                    RAW.rows ||
                    RAW.recipes ||
                    [];
            const norm = normalize(arr);
            return norm.length ? norm : SAMPLE_DATA;
        }
        catch {
            return SAMPLE_DATA;
        }
    });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        if (typeof window === "undefined")
            return [];
        try {
            const raw = window.localStorage.getItem("cookie-favorites");
            return raw ? JSON.parse(raw) : [];
        }
        catch {
            return [];
        }
    });
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem("cookie-favorites", JSON.stringify(favorites));
            }
        }
        catch {
            // ignore storage errors
        }
    }, [favorites]);
    function isFavorite(id) {
        if (!id)
            return false;
        return favorites.includes(id);
    }
    function toggleFavorite(row) {
        if (!row.id)
            return;
        setFavorites((prev) => prev.includes(row.id) ? prev.filter((x) => x !== row.id) : [...prev, row.id]);
    }
    const viewData = useMemo(() => {
        if (!showFavoritesOnly)
            return data;
        return data.filter((r) => isFavorite(r.id));
    }, [data, showFavoritesOnly, favorites]);
    const heroCopy = "Cookie Accord gathers the world’s beloved cookies into one welcoming place—each one carrying its own notes of culture, memory, and meaning. Wander through these traditions, and let the kindness baked into every cookie meet you along the way.";
    return (_jsx("div", { className: "min-h-dvh bg-gradient-to-b from-amber-50 via-white to-emerald-50", children: _jsxs("div", { className: "mx-auto max-w-7xl space-y-6 px-4 py-6", children: [_jsxs("section", { className: "rounded-3xl border border-amber-100 bg-white/70 p-4 shadow-sm", children: [_jsx("p", { className: "text-sm text-zinc-700", children: heroCopy }), _jsxs("p", { className: "text-xs text-zinc-600", children: ["Currently sharing ", _jsx("strong", { children: data.length }), " cookie traditions from around the world."] })] }), _jsxs("main", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [_jsxs("section", { children: [_jsx(motion.div, { ...fadeIn, children: _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-2", children: [_jsxs("h2", { className: "flex items-center gap-2 text-base font-semibold text-zinc-800", children: [_jsx(BookOpen, { className: "h-5 w-5 text-amber-600" }), "Explore by Country or Region"] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-zinc-600", children: [_jsxs("span", { children: [viewData.length, " recipes"] }), _jsxs("label", { className: "inline-flex items-center gap-1", children: [_jsx("input", { type: "checkbox", checked: showFavoritesOnly, onChange: (e) => setShowFavoritesOnly(e.target.checked), className: "h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-400" }), _jsx("span", { children: "Show my favorite cookies" })] })] })] }), _jsx(CountryPicker, { data: viewData, favorites: favorites, onPick: (ck) => setSelected(ck), onToggleFavorite: toggleFavorite })] }) }), selected && (_jsx(motion.div, { className: "mt-4", ...fadeIn, children: _jsx(CookieCard, { data: selected, isFavorite: isFavorite(selected.id), onToggleFavorite: toggleFavorite }) }))] }), _jsxs("section", { children: [_jsx(motion.div, { ...fadeIn, children: _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsxs("h2", { className: "flex items-center gap-2 text-base font-semibold text-zinc-800", children: [_jsx(PlusCircle, { className: "h-5 w-5 text-emerald-600" }), "Share Your Story & Recipe"] }), submitted ? (_jsx("div", { className: "text-xs text-emerald-700", children: "Thanks for sharing!" })) : (_jsx("div", { className: "text-xs text-zinc-500", children: "Fields optional\u2014preview updates live" }))] }), _jsx(SubmissionForm, { onSubmit: (row) => setSubmitted(row) })] }) }), submitted && (_jsxs(motion.div, { className: "mt-4", ...fadeIn, children: [_jsx("h3", { className: "mb-2 text-sm font-semibold text-zinc-700", children: "Your Submitted Cookie" }), _jsx(CookieCard, { data: submitted, accent: "emerald" })] }))] })] }), _jsxs("section", { className: "grid grid-cols-1 gap-4 rounded-3xl border border-amber-100 bg-white/70 p-4 text-sm text-zinc-700 sm:grid-cols-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5 rounded-xl bg-amber-50 p-2", children: _jsx(BookOpen, { className: "h-4 w-4 text-amber-700" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-zinc-900", children: "Explore traditions" }), _jsx("p", { className: "text-xs text-zinc-600", children: "Wander through cookies by country and discover how different cultures celebrate with something sweet." })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5 rounded-xl bg-emerald-50 p-2", children: _jsx(PlusCircle, { className: "h-4 w-4 text-emerald-700" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-zinc-900", children: "Share your story" }), _jsx("p", { className: "text-xs text-zinc-600", children: "Add a recipe, a memory, or a family tradition. Every cookie has a story, and yours is welcome here." })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5 rounded-xl bg-amber-50 p-2", children: _jsx(Heart, { className: "h-4 w-4 text-amber-700" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-zinc-900", children: "Save your favorites" }), _jsx("p", { className: "text-xs text-zinc-600", children: "Mark recipes you love as favorites so you can find them again for birthdays, holidays, and rainy afternoons." })] })] })] }), _jsx("section", { className: "pb-2 text-center text-xs text-zinc-500", children: "Made with love, crumbs, and curiosity." })] }) }));
}
