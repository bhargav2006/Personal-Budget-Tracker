// Verdant & Obsidian Global Design System — Theme Controller
// Integrated into Personal Budget Tracker from D:\DesignSystems\Global-Design-System

const STORAGE_KEY = "gds-theme";
const THEME_COLORS = {
  light: "#F6F8F5",
  dark: "#0E1111"
};

let mediaQuery = null;
let mediaChangeHandler = null;

export function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem("theme");
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
  meta.content = THEME_COLORS[theme] || THEME_COLORS.dark;
}

export function updateThemeButtons(theme) {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark";
  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.setAttribute("aria-pressed", String(isDark));
    button.dataset.currentTheme = theme;
  });
}

export function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  if (typeof document === "undefined") return nextTheme;

  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.setAttribute("data-theme", nextTheme);
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  document.documentElement.style.colorScheme = nextTheme;
  updateMetaThemeColor(nextTheme);
  updateThemeButtons(nextTheme);

  if (typeof window !== "undefined" && typeof window.CustomEvent === "function") {
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: nextTheme } }));
    window.dispatchEvent(new CustomEvent("gds-theme-change", { detail: { theme: nextTheme } }));
  }
  return nextTheme;
}

/** Apply a theme. Explicit user choices are saved by default. */
export function setTheme(theme, { persist = true } = {}) {
  const nextTheme = applyTheme(theme);
  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      window.localStorage.setItem("theme", nextTheme);
    } catch {
      // Storage may be restricted
    }
  }
  return nextTheme;
}

/**
 * Initialize once near application startup. A stored choice wins; otherwise,
 * use the system preference without writing an automatic default to storage.
 */
export function initializeTheme() {
  if (typeof document === "undefined" || typeof window === "undefined") return "dark";

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

  return initialTheme;
}

/** Toggle and persist the visitor's chosen theme. */
export function toggleTheme() {
  if (typeof document === "undefined") return "dark";
  const current = document.documentElement.dataset.theme || "dark";
  return setTheme(current === "dark" ? "light" : "dark", { persist: true });
}
