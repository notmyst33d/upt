import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    let cookieLang = event.request.headers.get("cookie")?.split("; ")?.find(s => s.startsWith("lang="))?.substring(5);
    const systemLang = event.request.headers.get("accept-language")?.split(",")[0]?.split("-")[0];

    if (cookieLang === "system") {
        cookieLang = systemLang;
    }

    event.locals.lang = cookieLang ?? systemLang ?? "en";

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace("%lang%", event.locals.lang)
    });
};