// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import axios, { type AxiosInstance } from "axios";

import type { ParcelTrackEvent } from "./parcel_track_event";
import type { TrackClient } from "./track_client";

import { CellogClient } from "./clients/cellog";
import { OzonRocketClient } from "./clients/ozon_rocket";
import { CelcnClient } from "./clients/celcn";
import { CdekClient } from "./clients/cdek";

export function getDefaultClients(): TrackClient[] {
    return [
        new CellogClient(),
        new OzonRocketClient(),
        new CelcnClient(),
        new CdekClient(),
    ];
}

export function getDefaultHttpClient(): AxiosInstance {
    return axios.create({ timeout: 3000 });
}

export async function track(clients: TrackClient[], trackNumber: string): Promise<{ trackNumber: string, sources: string[], events: ParcelTrackEvent[] }> {
    const events: ParcelTrackEvent[] = [];
    const sources: string[] = [];
    for (const client of clients) {
        try {
            const e = await client.fetch(trackNumber)
            if (e.length > 0) {
                sources.push(client.name);
            }
            events.push.apply(events, e);
        } catch (e) { }
    }

    events.sort((a, b) => a.date.valueOf() - b.date.valueOf());
    events.reverse();

    return { trackNumber, sources, events };
}
