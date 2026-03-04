import { translations, type Language, type TranslationKeys } from "./locales";

export type { Language, TranslationKeys };
export { translations };

export function getLanguageFromURL(pathname: string): Language {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathWithoutBase = pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname;
  return pathWithoutBase.startsWith("/it") ? "it" : "en";
}

export function t(lang: Language): TranslationKeys {
  return translations[lang];
}

export function localPath(path: string, lang: Language): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (lang === "it") {
    return `${base}/it${path === "/" ? "" : path}`;
  }
  return `${base}${path}`;
}

export function switchLangPath(
  currentPath: string,
  targetLang: Language
): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathWithoutBase = currentPath.startsWith(base)
    ? currentPath.slice(base.length)
    : currentPath;

  if (targetLang === "it") {
    if (pathWithoutBase.startsWith("/it")) return currentPath;
    return `${base}/it${pathWithoutBase === "/" ? "" : pathWithoutBase}`;
  } else {
    const pathWithoutLang = pathWithoutBase.replace(/^\/it/, "") || "/";
    return `${base}${pathWithoutLang}`;
  }
}
