// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Event } from '$lib/event';
import { client as cellogClient } from '$lib/cellog';
import { client as ozonRocketClient } from '$lib/ozon_rocket';
import { client as celcnClient } from '$lib/celcn';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const trackNumber = data.get("track-number");
        if (typeof trackNumber != "string") {
            return fail(400, { trackNumber });
        }

        let events: Event[] = [];
        for (const client of [ozonRocketClient, cellogClient, celcnClient]) {
            events = [...events, ...await client.fetch(trackNumber)];
        }

        events.sort((a, b) => a.date.valueOf() - b.date.valueOf());

        return { success: true, trackNumber, events };
    }
} satisfies Actions;
