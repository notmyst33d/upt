// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Event } from "$lib/event";
import { client as cellogClient } from "$lib/cellog";
import { client as ozonRocketClient } from "$lib/ozon_rocket";
import { client as celcnClient } from "$lib/celcn";

const defaultClients = [
    ozonRocketClient,
    cellogClient,
    celcnClient,
];

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const trackNumber = data.get("track-number");
        if (typeof trackNumber != "string") {
            return fail(400, { trackNumber });
        }

        let events: Event[] = [];
        for (const client of defaultClients) {
            events = [...events, ...await client.fetch(trackNumber)];
        }

        events.sort((a, b) => a.date.valueOf() - b.date.valueOf());
        events.reverse();

        return { success: true, trackNumber, events };
    }
};

export const load: PageServerLoad = async ({ cookies, locals, url }) => {
    const lang = url.searchParams.get("lang");
    if (lang !== null && lang != locals.lang) {
        cookies.set("lang", lang, { path: "/" });
        return { lang };
    }
};
