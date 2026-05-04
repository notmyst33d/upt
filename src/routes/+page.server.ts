// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import type { Actions, PageServerLoad } from "./$types";

import { getDefaultClients, track } from "$lib";
import { fail, redirect } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, url }) => {
        const data = await request.formData();
        const trackNumber = data.get("track_number");
        let sources = data.get("sources");
        if (typeof trackNumber !== "string" || typeof sources !== "string") {
            return fail(400);
        }

        const urlTrackNumber = url.searchParams.get("track_number");
        const urlSources = url.searchParams.get("sources");

        if (trackNumber === urlTrackNumber && urlSources !== "all" && urlSources !== null) {
            return {};
        }

        const clients = getDefaultClients();
        const trackData = await track(clients, trackNumber);
        const newParams = new URLSearchParams();
        newParams.set("track_number", trackNumber);
        newParams.set("sources", trackData.sources.join(","));
        return redirect(307, "/?" + newParams.toString());
    },
};

export const load: PageServerLoad = async ({ url }) => {
    const trackNumber = url.searchParams.get("track_number");
    const sources = url.searchParams.get("sources");
    if (typeof trackNumber !== "string" || typeof sources !== "string") {
        return {};
    }

    const clients = getDefaultClients();
    const clientNames = sources.split(",");
    return await track(clients.filter(c => clientNames.includes(c.name)), trackNumber);
}
