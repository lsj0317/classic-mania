import { create } from "zustand";
import ko from "../locales/ko";
import en from "../locales/en";
import type { Translations } from "../locales/ko";

export type Language = "ko" | "en";

interface LanguageState {
    language: Language;
    t: Translations;
    setLanguage: (lang: Language) => void;
}

const translations: Record<Language, Translations> = { ko, en };

const getInitialLanguage = (): Language => {
    if (typeof window === "undefined") return "ko";
    try {
        const saved = localStorage.getItem("language");
        if (saved === "ko" || saved === "en") return saved;
    } catch {
        // localStorage unavailable
    }
    return "ko";
};

const initialLang = getInitialLanguage();

export const useLanguageStore = create<LanguageState>((set) => ({
    language: initialLang,
    t: translations[initialLang],
    setLanguage: (lang: Language) => {
        try {
            localStorage.setItem("language", lang);
        } catch {
            // localStorage unavailable
        }
        set({ language: lang, t: translations[lang] });
    },
}));
