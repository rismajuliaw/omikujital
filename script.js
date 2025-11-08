import { kanaToRomaji } from "./romaji.js";

const elements = {
  kanji: document.getElementById("kanji"),
  kana: document.getElementById("kana"),
  romaji: document.getElementById("romaji"),
  translation: document.getElementById("translation"),
  original: document.getElementById("original"),
  card: document.querySelector(".spread"),
  cardBody: document.querySelector(".spread-body"),
  cover: document.getElementById("paperCover"),
  cardDate: document.getElementById("cardDate"),
  toast: document.getElementById("toast"),
  brandTitle: document.querySelector(".pixel-title"),
  footnotes: document.querySelector(".translation-footnotes"),
  buttons: {
    next: document.getElementById("newAffirmation"),
    favorite: document.getElementById("favorite"),
    refreshDaily: document.getElementById("refreshDaily"),
  },
};

const STORE_KEYS = {
  daily: "liftingup_daily",
  favorites: "liftingup_favorites",
};

const MAX_FAVORITES = 5;
const MAX_IDIOMS = 43;
const FALLBACK_IDIOM = {
  kanji: "心機一転",
  kana: "しんきいってん",
  translation: "Start fresh with a gentle heart.",
  note: "Still waters welcome planning. Big skies welcome you.",
};

const FLIP_DURATION_MS = 650;

const state = {
  idioms: [],
  currentIndex: null,
  favorites: loadFavorites(),
  isCardOpen: false,
  toastTimer: null,
};

function loadFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEYS.favorites));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((fav) => ({
        kanji: fav.kanji ?? "",
        translation: fav.translation ?? "",
        kana: fav.kana ?? "",
        romaji: fav.romaji ?? (fav.kana ? kanaToRomaji(fav.kana) : ""),
        note: fav.note ?? "",
        index: typeof fav.index === "number" ? fav.index : null,
      }))
      .slice(0, MAX_FAVORITES);
  } catch (error) {
    console.warn("Unable to read favorites", error);
    return [];
  }
}

function saveFavorites() {
  state.favorites = dedupeFavorites(state.favorites).slice(0, MAX_FAVORITES);
  localStorage.setItem(STORE_KEYS.favorites, JSON.stringify(state.favorites));
}

async function loadIdioms() {
  try {
    const res = await fetch("./data/idioms.json");
    if (!res.ok) throw new Error("Network error");
    const payload = await res.json();
    if (!Array.isArray(payload) || payload.length < 1) {
      throw new Error("No idioms found");
    }
    state.idioms = payload
      .slice(0, MAX_IDIOMS)
      .map(normalizeIdiom)
      .filter((entry) => entry.kanji && entry.translation);
    if (!state.idioms.length) {
      throw new Error("Idioms missing required fields");
    }
    return true;
  } catch (error) {
    console.error(error);
    state.idioms = [];
    return false;
  }
}

function renderFallback() {
  state.idioms = [normalizeIdiom(FALLBACK_IDIOM)];
  renderIdiom(0);
  updateFavoriteIndicator(false);
  sealPaper();
}

function selectDailyIndex(forceNew = false) {
  if (!state.idioms.length) return 0;
  const today = getTodayKey();
  const stored = localStorage.getItem(STORE_KEYS.daily);
  if (stored && !forceNew) {
    try {
      const parsed = JSON.parse(stored);
      if (
        parsed?.date === today &&
        typeof parsed?.index === "number" &&
        parsed.index >= 0 &&
        parsed.index < state.idioms.length
      ) {
        return parsed.index;
      }
    } catch (_) {
      // ignore
    }
  }
  const index = randomIndex();
  storeDailyIndex(today, index);
  return index;
}

function randomIndex(excludeIndex = null) {
  const total = state.idioms.length;
  if (!total) return 0;
  if (total === 1) return 0;
  let index = Math.floor(Math.random() * total);
  while (index === excludeIndex) {
    index = Math.floor(Math.random() * total);
  }
  return index;
}

function renderIdiom(index) {
  const idiom = state.idioms[index];
  if (!idiom) return;
  state.currentIndex = index;
  elements.kanji.textContent = idiom.kanji;
  const reading = idiom.kana ?? "";
  const romaji = idiom.romaji ?? (reading ? kanaToRomaji(reading) : "");
  elements.kana.textContent = reading;
  elements.romaji.textContent = formatRomaji(romaji);
  const literal = tidyLine(idiom.translation);
  const meaning = tidyLine(idiom.note);
  const displayLine = meaning || literal || "今日も穏やかに。";
  elements.translation.textContent = displayLine;
  setOptionalLine(elements.original, literal);
  setCardDate(new Date());
  updateFavoriteButton();
}

function updateFavoriteButton() {
  if (!elements.buttons.favorite) return;
  const exists = isCurrentFavorite();
  elements.buttons.favorite.classList.toggle("active", exists);
  elements.buttons.favorite.setAttribute("aria-pressed", String(exists));
  elements.buttons.favorite.setAttribute(
    "aria-label",
    exists ? "Remove from favorites" : "Save this card",
  );
  updateFavoriteIndicator(exists);
}

function toggleFavorite() {
  if (state.currentIndex === null) return;
  const idiom = state.idioms[state.currentIndex];
  if (!idiom) return;
  const key = favoriteKeyFromEntry(idiom);
  const exists = state.favorites.some((fav) => favoriteKeyFromEntry(fav) === key);
  if (exists) {
    state.favorites = state.favorites.filter((fav) => favoriteKeyFromEntry(fav) !== key);
  } else {
    if (state.favorites.length >= MAX_FAVORITES) {
      showToast("Only five hearts fit in one hand.");
      return;
    }
    const reading = idiom.kana ?? "";
    const romajiValue = formatRomaji(idiom.romaji ?? (reading ? kanaToRomaji(reading) : ""));
    const literal = tidyLine(idiom.translation);
    const meaning = tidyLine(idiom.note);
    state.favorites.unshift({
      kanji: idiom.kanji,
      translation: literal,
      kana: reading,
      romaji: romajiValue,
      note: meaning,
      index: state.currentIndex,
    });
    showToast("Heart saved, keep it near");
  }
  saveFavorites();
  updateFavoriteButton();
}

function favoriteKeyFromEntry(entry = {}) {
  const kanji = entry?.kanji ?? "";
  const translation = entry?.translation ?? "";
  return `${kanji}::${translation}`;
}

function dedupeFavorites(list = []) {
  const seen = new Set();
  return list.filter((fav) => {
    const key = favoriteKeyFromEntry(fav);
    if (!key.trim()) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isCurrentFavorite() {
  if (state.currentIndex === null) return false;
  const idiom = state.idioms[state.currentIndex];
  if (!idiom) return false;
  const key = favoriteKeyFromEntry(idiom);
  return state.favorites.some((fav) => favoriteKeyFromEntry(fav) === key);
}

function updateFavoriteIndicator(isFavorite) {
  if (elements.card) {
    elements.card.classList.toggle("is-favorite", isFavorite);
  }
}

function sealPaper() {
  state.isCardOpen = false;
  elements.card?.classList.add("is-closed");
  elements.card?.classList.remove("is-open");
  updateDrawButton();
}

function revealPaper({ newDraw = false } = {}) {
  state.isCardOpen = true;
  elements.card?.classList.remove("is-closed");
  elements.card?.classList.add("is-open");
  updateDrawButton();
}

function updateDrawButton() {
  const button = elements.buttons.next;
  if (!button) return;
  button.textContent = state.isCardOpen ? "Next" : "Open paper";
}

function showToast(message) {
  if (!elements.toast || !message) return;
  elements.toast.textContent = message;
  elements.toast.classList.remove("visible");
  void elements.toast.offsetWidth;
  elements.toast.classList.add("visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    elements.toast?.classList.remove("visible");
  }, 2200);
}

function handlePaperAction() {
  if (!state.idioms.length) return;
  if (!state.isCardOpen) {
    triggerFoldAnimation();
    revealPaper();
    return;
  }
  cycleToNextCard();
}

function cycleToNextCard() {
  if (!state.idioms.length) return;
  const nextIndex = randomIndex(state.currentIndex);
  animateSwap(() => {
    renderIdiom(nextIndex);
    triggerFoldAnimation();
  });
}

function triggerFoldAnimation() {
  if (!elements.card) return;
  elements.card.classList.remove("is-folding");
  void elements.card.offsetWidth;
  elements.card.classList.add("is-folding");
}

function animateSwap(renderFn) {
  if (!elements.cardBody || typeof renderFn !== "function") {
    renderFn?.();
    return;
  }
  elements.cardBody.classList.add("is-swapping");
  setTimeout(() => {
    renderFn();
  }, FLIP_DURATION_MS / 2);
  setTimeout(() => {
    requestAnimationFrame(() => {
      elements.cardBody?.classList.remove("is-swapping");
    });
  }, FLIP_DURATION_MS);
}

function setOptionalLine(element, text = "") {
  if (!element) return;
  if (text) {
    element.textContent = text;
    element.classList.remove("hidden");
  } else {
    element.textContent = "";
    element.classList.add("hidden");
  }
  updateFootnotesVisibility();
}

function updateFootnotesVisibility() {
  if (!elements.footnotes) return;
  const hasContent = Array.from(elements.footnotes.children || []).some(
    (child) => !child.classList.contains("hidden") && child.textContent.trim(),
  );
  elements.footnotes.classList.toggle("hidden", !hasContent);
}

function formatRomaji(text = "") {
  if (!text) return "";
  return text
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
function tidyLine(text = "") {
  if (text === null || text === undefined) return "";
  return String(text).replace(/\s+/g, " ").trim();
}

function normalizeIdiom(entry = {}) {
  const kanji = tidyLine(entry.kanji ?? "");
  const literal = tidyLine(entry.literal ?? entry.translation ?? "");
  const meaning = tidyLine(entry.elaboration ?? entry.note ?? "");
  const kana = tidyLine(entry.kana ?? entry.reading ?? "");
  const romajiSource = entry.romaji ?? (kana ? kanaToRomaji(kana) : "");
  const romaji = tidyLine(romajiSource);
  return {
    kanji: kanji || "—",
    kana,
    romaji,
    translation: literal,
    note: meaning,
  };
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function storeDailyIndex(date, index) {
  try {
    localStorage.setItem(STORE_KEYS.daily, JSON.stringify({ date, index }));
  } catch (_) {
    // ignore
  }
}

async function copyCurrent() {
  if (state.currentIndex === null) return;
  const idiom = state.idioms[state.currentIndex];
  if (!idiom) return;
  const romaji = formatRomaji(idiom.romaji ?? "");
  const literal = tidyLine(idiom.translation);
  const meaning = tidyLine(idiom.note);
  const payload = [idiom.kanji, romaji, literal, meaning]
    .filter((part, idx, arr) => part && arr.indexOf(part) === idx)
    .join(" | ");
  try {
    await navigator.clipboard.writeText(payload);
    showToast("Copied, keep it close");
  } catch (error) {
    console.warn("Clipboard unsupported", error);
    showToast("Clipboard not supported");
  }
}

function setCardDate(date) {
  if (!elements.cardDate) return;
  const safe = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  const day = String(safe.getDate()).padStart(2, "0");
  const month = String(safe.getMonth() + 1).padStart(2, "0");
  const year = String(safe.getFullYear()).slice(-2);
  elements.cardDate.textContent = `${day} ${month} ${year}`;
  elements.cardDate.dateTime = safe.toISOString();
}

function bindEvents() {
  elements.buttons.next?.addEventListener("click", handlePaperAction);
  elements.cover?.addEventListener("click", handlePaperAction);
  elements.cover?.addEventListener("keydown", handleCoverKeydown);
  elements.buttons.favorite?.addEventListener("click", toggleFavorite);
elements.buttons.refreshDaily?.addEventListener("click", (event) => {
  if (typeof event?.preventDefault === "function") {
    event.preventDefault();
  }
  const index = selectDailyIndex(true);
  renderIdiom(index);
  sealPaper();
  showToast("Daily card refreshed");
});
  elements.brandTitle?.addEventListener("click", handleBrandReset);
  elements.brandTitle?.addEventListener("keydown", handleBrandKeydown);
}

function handleCoverKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handlePaperAction();
  }
}

function handleBrandReset() {
  sealPaper();
  elements.cover?.focus();
  showToast("Card sealed");
}

function handleBrandKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleBrandReset();
  }
}

async function init() {
  bindEvents();
  if (!canInitDeck()) return;
  const loaded = await loadIdioms();
  if (!loaded) {
    renderFallback();
    return;
  }
  const dailyIndex = selectDailyIndex();
  renderIdiom(dailyIndex);
  sealPaper();
}

function canInitDeck() {
  return Boolean(elements.card && elements.buttons.next && elements.cover && elements.kanji);
}

init();
