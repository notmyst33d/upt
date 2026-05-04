// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

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
        "track_number": "Track number",
        "language": "Language",
        "apply": "Apply",
        "sources": "Sources",
        "settings": "Settings",

        "sub_subscribe": "Subscribe",
        "sub_subscription": "Subscribe to notifications",
        "sub_subscription_using": "Subscribe to notifications using {service}",
        "sub_setup_success": "Successfully subscribed to notifications",
        "sub_setup_service_error": "Cannot contact notification service (HTTP {status}, {code})",
        "sub_setup_already_exists": "This subscription already exists",
        "sub_setup_test_md": "**Test Message**: If you see this, it means everything is working correctly. New events will be sent soon for track number {track_number}.",
        "sub_setup_notice": "UnifiedParcelTracking will automatically unsubscribe under these conditions:",
        "sub_setup_notice1": "Track number didn't have updates in the last 30 days",
        "sub_setup_notice2": "Notification service didn't successfully respond with HTTP 200 within 3 requests (counter is reset upon successful response)",
        "sub_ntfy_domain": "Domain",
        "sub_ntfy_topic": "Topic",
        "sub_ntfy_token": "Token",
        "sub_ntfy_notice": "ntfy server should support HTTPS",
    },
    "ru": {
        "tracking_number": "Трек номер",
        "location": "Локация",
        "source": "Сервис",
        "date": "Время",
        "description": "Описание",
        "track": "Отследить",
        "track_number": "Трек код",
        "language": "Язык",
        "apply": "Применить",
        "sources": "Сервисы",
        "settings": "Настройки",

        "sub_subscribe": "Подписаться",
        "sub_subscription": "Подписка на уведомления",
        "sub_subscription_using": "Подписка на уведомления используя {service}",
        "sub_setup_success": "Подписка на уведомления прошла успешно",
        "sub_setup_service_error": "Не удалось отправить запрос сервису уведомлений (HTTP {status}, {code})",
        "sub_setup_already_exists": "Эта подписка уже существует",
        "sub_setup_test_md": "**Тестовое сообщение**: Если вы видите это сообщение, значит всё работает корректно. Скоро будут отправлены новые статусы трек кода {track_number}.",
        "sub_setup_notice": "UnifiedParcelTracking автоматически отпишется при следующих условиях:",
        "sub_setup_notice1": "Трек код не имел обновлений за последние 30 дней",
        "sub_setup_notice2": "Сервис уведомлений не смог выдать успешный HTTP 200 ответ за последние 3 запроса (счётчик сбрасывается при успешном ответе)",
        "sub_ntfy_domain": "Домен",
        "sub_ntfy_topic": "Тема",
        "sub_ntfy_token": "Токен",
        "sub_ntfy_notice": "ntfy сервер должен поддерживать HTTPS",
    },
};

export function i18n(key: string): string {
    return _i18n(i18nData, page.data.lang, key);
}

export function _i18n(langMap: I18nLangMap, lang: string, key: string): string {
    if (langMap[lang] === undefined) {
        lang = "en";
    }
    if (langMap[lang][key] === undefined) {
        return key;
    }
    return langMap[lang][key];
}
