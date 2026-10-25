// Verdant Signal v1.2 — theme helper for plain JS, React, and Vite.
// Import initializeTheme() early in your entry file, then call toggleTheme()
// from the theme button. The CSS expects <html data-theme="light|dark">.

const STORAGE_KEY = "theme";
const THEME_COLORS = {
  light: "#F6F8F5",
  dark: "#071118"
};

let mediaQuery = null;
let mediaChangeHandler = null;
let isInitialized = false;

export function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function getSystemTheme() {
  try {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function updateMetaThemeColor(theme) {
  if (typeof document === "undefined") return;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLORS[theme] || THEME_COLORS.light;
}

export function updateThemeButtons(theme) {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark";
  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.setAttribute("aria-pressed", String(isDark));
    // Do not replace button innerHTML; React or another UI framework may own it.
    button.dataset.currentTheme = theme;
  });
}

export function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  if (typeof document === "undefined") return nextTheme;

  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  document.documentElement.style.colorScheme = nextTheme;
  updateMetaThemeColor(nextTheme);
  updateThemeButtons(nextTheme);

  if (typeof window !== "undefined" && typeof window.CustomEvent === "function") {
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: nextTheme } }));
  }
  return nextTheme;
}

/** Apply a theme. Explicit user choices are saved by default. */
export function setTheme(theme, { persist = true } = {}) {
  const nextTheme = applyTheme(theme);
  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Theme changes still work for the current page if storage is unavailable.
    }
  }
  return nextTheme;
}

/**
 * Initialize once near application startup. A stored choice wins; otherwise,
 * use the system preference without writing an automatic default to storage.
 */
export function initializeTheme() {
  if (typeof document === "undefined" || typeof window === "undefined") return "light";

  const initialTheme = readStoredTheme() ?? getSystemTheme();
  applyTheme(initialTheme);

  if (mediaQuery && mediaChangeHandler) {
    mediaQuery.removeEventListener?.("change", mediaChangeHandler);
    mediaQuery.removeListener?.(mediaChangeHandler);
  }

  try {
    mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)") ?? null;
    mediaChangeHandler = (event) => {
      if (readStoredTheme() === null) applyTheme(event.matches ? "dark" : "light");
    };
    if (mediaQuery?.addEventListener) mediaQuery.addEventListener("change", mediaChangeHandler);
    else mediaQuery?.addListener?.(mediaChangeHandler);
  } catch {
    mediaQuery = null;
    mediaChangeHandler = null;
  }

  isInitialized = true;
  return initialTheme;
}

/** Toggle and persist the visitor's chosen theme. */
export function toggleTheme() {
  if (typeof document === "undefined") return "light";
  const current = document.documentElement.dataset.theme || (isInitialized ? "light" : initializeTheme());
  return setTheme(current === "dark" ? "light" : "dark", { persist: true });
}

// Optional global API for non-module scripts. ES module imports are preferred.
if (typeof window !== "undefined") {
  window.VerdantTheme = { setTheme, initializeTheme, toggleTheme };
}
