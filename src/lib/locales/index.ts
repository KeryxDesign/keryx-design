import { it } from "./it";
import { en } from "./en";

export type Language = "it" | "en";
export type TranslationKeys = typeof it;

export const translations: Record<Language, TranslationKeys> = {
  it,
  en
};
