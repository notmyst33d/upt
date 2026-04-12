// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import type { Event } from "./event";
import z from "zod";
import type { TrackClient } from "./track_client";
import { createDefaultClient } from "$lib";

const ResponseSchema = z.array(z.object({
    EventTime: z.iso.datetime({ offset: true }).transform(v => new Date(v)),
    EventText: z.string(),
    EventComment: z.string(),
}));

type Response = z.infer<typeof ResponseSchema>;

class CellogClient implements TrackClient {
    name: string = "CEL Logistics";

    private client = createDefaultClient();

    async fetch(trackNumber: string): Promise<Event[]> {
        return this.client.get<Response>(`https://cellog.ru/api/tracking/${trackNumber}`, { timeout: 5000 })
            .then(r => ResponseSchema.parse(r.data))
            .then(d => d.map(e => ({ date: e.EventTime, location: e.EventComment, description: e.EventText, source: this.name })));
    }
}

export const client = new CellogClient();
