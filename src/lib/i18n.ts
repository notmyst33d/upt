import { page } from "$app/state";

interface I18nDictionary {
    [key: string]: string;
}

interface I18nLangMap {
    [lang: string]: I18nDictionary;
}

export const i18nData: I18nLangMap = {
    "en": {
        "tracking_number": "Tracking number",
        "location": "Location",
        "source": "Source",
        "date": "Date",
        "description": "Description",
        "track": "Track",
        "system_language": "System language",
        "language": "Select language",
        "apply": "Apply",
    },
    "ru": {
        "tracking_number": "Трек номер",
        "location": "Локация",
        "source": "Сервис",
        "date": "Время",
        "description": "Описание",
        "track": "Отследить",
        "system_language": "Системный язык",
        "language": "Выбрать язык",
        "apply": "Применить",
    },
};

export function i18n(key: string): string {
    if (i18nData[page.data.lang] === undefined) {
        return "Missing language";
    }
    return i18nData[page.data.lang][key];
}
