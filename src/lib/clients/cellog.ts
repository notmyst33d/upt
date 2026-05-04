// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import z from "zod";

import { getDefaultHttpClient } from "..";
import type { ParcelTrackEvent } from "../parcel_track_event";
import type { TrackClient } from "../track_client";

const ResponseSchema = z.array(z.object({
    EventTime: z.iso.datetime({ offset: true }).transform(v => new Date(v)),
    EventText: z.string(),
    EventComment: z.string(),
}));

type Response = z.infer<typeof ResponseSchema>;

export class CellogClient implements TrackClient {
    name: string = "CEL Logistics";

    private client = getDefaultHttpClient();

    async fetch(trackNumber: string): Promise<ParcelTrackEvent[]> {
        return this.client.get<Response>(`https://cellog.ru/api/tracking/${trackNumber}`)
            .then(r => ResponseSchema.parse(r.data))
            .then(d => d.map(e => ({ date: e.EventTime, location: e.EventComment, description: e.EventText, source: this.name })));
    }
}
