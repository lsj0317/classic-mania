import { create } from "zustand";
import ko from "../locales/ko";
import en from "../locales/en";
import type { Translations } from "../locales/ko";

export type Language = "ko" | "en";

interface LanguageState {
    language: Language;
    t: Translations;
    setLanguage: (lang: Language) => void;
    /** 브라우저 저장소(localStorage)에서 상태를 불러온다. 하이드레이션 이후 StoreHydrator가 한 번 호출한다. */
    hydrate: () => void;
}

const translations: Record<Language, Translations> = { ko, en };

const loadLanguage = (): Language => {
    try {
        const saved = localStorage.getItem("language");
        if (saved === "ko" || saved === "en") return saved;
    } catch {
        // localStorage unavailable
    }
    return "ko";
};

export const useLanguageStore = create<LanguageState>((set) => ({
    // 서버 렌더링과 첫 클라이언트 렌더링이 일치하도록 기본값으로 시작한다.
    language: "ko",
    t: translations.ko,
    setLanguage: (lang: Language) => {
        try {
            localStorage.setItem("language", lang);
        } catch {
            // localStorage unavailable
        }
        set({ language: lang, t: translations[lang] });
    },
    hydrate: () => {
        const lang = loadLanguage();
        set({ language: lang, t: translations[lang] });
    },
}));
