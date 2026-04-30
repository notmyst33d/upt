// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Event } from "$lib/event";
import { client as cellogClient } from "$lib/cellog";
import { client as ozonRocketClient } from "$lib/ozon_rocket";
import { client as celcnClient } from "$lib/celcn";
import { client as cdekClient } from "$lib/cdek";

const defaultClients = [
    cdekClient,
    ozonRocketClient,
    cellogClient,
    celcnClient,
];

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const trackNumber = data.get("track_number");
        if (typeof trackNumber !== "string") {
            return fail(400);
        }

        const events: Event[] = [];
        const failedClients: string[] = [];
        for (const client of defaultClients) {
            try {
                events.push.apply(events, await client.fetch(trackNumber));
            } catch (e) {
                failedClients.push(client.name);
            }
        }

        events.sort((a, b) => a.date.valueOf() - b.date.valueOf());
        events.reverse();

        return { trackNumber, events, failedClients };
    }
};

export const load: PageServerLoad = async ({ cookies, locals, url }) => {
    const lang = url.searchParams.get("lang");
    if (lang !== null && lang !== locals.lang) {
        // 100 years should be enough
        cookies.set("lang", lang, { path: "/", maxAge: 100 * 60 * 60 * 24 * 365 });
        return { lang };
    }
};
