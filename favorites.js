import { kanaToRomaji } from "./romaji.js";

const STORE_KEYS = {
  favorites: "liftingup_favorites",
};

const MAX_FAVORITES = 5;

const elements = {
  grid: document.getElementById("favoritesGrid"),
  empty: document.getElementById("favoritesEmpty"),
  template: document.getElementById("favoriteRow"),
  toast: document.getElementById("toast"),
};

let toastTimer = null;
let favorites = loadFavorites();
renderFavorites();
bindEvents();

function loadFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEYS.favorites));
    if (!Array.isArray(parsed)) return [];
    const sanitized = parsed
      .map((fav) => ({
        kanji: tidy(fav.kanji),
        translation: tidy(fav.translation),
        kana: tidy(fav.kana),
        romaji: formatRomaji(tidy(fav.romaji)) || (fav.kana ? formatRomaji(kanaToRomaji(fav.kana)) : ""),
        note: tidy(fav.note),
        index: typeof fav.index === "number" ? fav.index : null,
      }))
      .slice(0, MAX_FAVORITES);
    if (sanitized.length !== parsed.length) {
      localStorage.setItem(STORE_KEYS.favorites, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch (error) {
    console.warn("Unable to read favorites", error);
    return [];
  }
}

function saveFavorites() {
  favorites = favorites.slice(0, MAX_FAVORITES);
  localStorage.setItem(STORE_KEYS.favorites, JSON.stringify(favorites));
}

function renderFavorites() {
  if (!elements.grid || !elements.template) return;
  elements.grid.innerHTML = "";
  if (!favorites.length) {
    elements.empty?.classList.remove("hidden");
    elements.grid.hidden = true;
    return;
  }
  elements.empty?.classList.add("hidden");
  elements.grid.hidden = false;
  favorites.forEach((fav) => {
    const clone = elements.template.content.cloneNode(true);
    const li = clone.querySelector("li");
    const key = favoriteKey(fav);
    li.dataset.key = key;
    clone.querySelector(".favorite-kanji").textContent = fav.kanji;
    const kanaEl = clone.querySelector(".favorite-kana");
    kanaEl.textContent = fav.kana ?? "";
    const romajiText = formatRomaji(fav.romaji || (fav.kana ? kanaToRomaji(fav.kana) : ""));
    clone.querySelector(".favorite-romaji").textContent = romajiText;
    const literalEl = clone.querySelector(".favorite-literal");
    literalEl.textContent = fav.translation ?? "";
    literalEl.hidden = !fav.translation;
    const noteEl = clone.querySelector(".favorite-note");
    noteEl.textContent = fav.note ?? "";
    noteEl.hidden = !fav.note;
    elements.grid.appendChild(clone);
  });
}

function bindEvents() {
  elements.grid?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest("li");
    if (!item) return;
    const key = item.dataset.key;
    if (!key) return;
    if (target.classList.contains("remove")) {
      removeFavorite(key);
    } else if (target.classList.contains("copy")) {
      copyFavorite(key);
    }
  });
}

function removeFavorite(key) {
  favorites = favorites.filter((fav) => favoriteKey(fav) !== key);
  saveFavorites();
  renderFavorites();
}

async function copyFavorite(key) {
  const fav = favorites.find((entry) => favoriteKey(entry) === key);
  if (!fav) return;
  const romajiText = formatRomaji(fav.romaji || (fav.kana ? kanaToRomaji(fav.kana) : ""));
  const lines = [fav.kanji, romajiText, fav.translation, fav.note]
    .map(tidy)
    .filter((part, idx, arr) => part && arr.indexOf(part) === idx);
  const payload = lines.join(" | ");
  try {
    await navigator.clipboard.writeText(payload);
    showToast("Copied, keep it close");
  } catch (error) {
    console.warn("Clipboard unsupported", error);
    showToast("Clipboard not supported");
  }
}

function favoriteKey(entry = {}) {
  return `${entry?.kanji ?? ""}::${entry?.translation ?? ""}`;
}

function showToast(message) {
  if (!elements.toast || !message) return;
  elements.toast.textContent = message;
  elements.toast.classList.remove("visible");
  void elements.toast.offsetWidth;
  elements.toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.toast?.classList.remove("visible");
  }, 2200);
}

function tidy(text = "") {
  if (!text) return "";
  return String(text).replace(/\s+/g, " ").trim();
}

function formatRomaji(text = "") {
  if (!text) return "";
  return text
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
