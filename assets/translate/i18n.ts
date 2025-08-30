// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translate.json";
import kh from "./kh/translate.json";

const resources = {
    en: {
        translation: en,
    },
    kh: {
        translation: kh,
    },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    compatibilityJSON: "v4",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
