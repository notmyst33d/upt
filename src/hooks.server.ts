// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import { CronJob } from "cron";
import type { Handle } from "@sveltejs/kit";

import { getDefaultClients, getDefaultHttpClient, track } from "$lib";
import { open, SubscriptionSchema } from "$lib/sub_db";
import { NtfyOptionsSchema } from "$lib/options";

// TODO
export const subFunc = async () => {
    const db = open();
    for (const row of db.prepare("SELECT * FROM subscriptions").iterate()) {
        const sub = SubscriptionSchema.parse(row);
        const client = getDefaultHttpClient();
        const trackClients = getDefaultClients();
        const result = await track(trackClients.filter(c => c.name), sub.track_number);
        if (sub.service === "ntfy") {
            const options = NtfyOptionsSchema.parse(JSON.parse(sub.options));
            await client.post(`https://${options.domain}/${options.topic}`, "");
        }
    }
    db.close();
};

CronJob.from({
    cronTime: "* * * * * *",
    // start: true,
    onTick: subFunc,
});

export const handle: Handle = async ({ event, resolve }) => {
    const cookieLang = event.request.headers.get("cookie")?.split("; ")?.find(s => s.startsWith("lang="))?.substring(5);
    const systemLang = event.request.headers.get("accept-language")?.split(",")[0]?.split("-")[0];

    event.locals.lang = cookieLang ?? systemLang ?? "en";

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace("%lang%", event.locals.lang)
    });
};
