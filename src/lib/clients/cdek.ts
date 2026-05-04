// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import z from "zod";
import { AxiosError } from "axios";

import { getDefaultHttpClient } from "..";
import type { ParcelTrackEvent } from "../parcel_track_event";
import type { TrackClient } from "../track_client";
import { Cookies } from "../cookies";

const ResponseSchema = z.object({
    success: z.boolean(),
    data: z.optional(z.object({
        statuses: z.array(z.object({
            name: z.string(),
            date: z.nullable(z.string().transform(v => new Date(v))),
            completed: z.boolean(),
            items: z.optional(z.array(z.object({
                name: z.string(),
                statuses: z.array(z.object({
                    name: z.string(),
                    date: z.string().transform(v => new Date(v)),
                }))
            }))),
        })),
    })),
});

type Response = z.infer<typeof ResponseSchema>;

export class CdekClient implements TrackClient {
    name: string = "CDEK";

    private client = getDefaultHttpClient();

    private cookies = new Cookies();

    async fetch(trackNumber: string): Promise<ParcelTrackEvent[]> {
        try {
            return await this._fetch(trackNumber);
        } catch (e) {
            if (e instanceof AxiosError && e.response?.headers["set-cookie"] !== undefined) {
                this.cookies.apply(e.response);
                return await this._fetch(trackNumber);
            }
            throw e;
        }
    }

    private async _fetch(trackNumber: string): Promise<ParcelTrackEvent[]> {
        const response = this.cookies.apply(
            await this.client.get<Response>(`https://www.cdek.ru/api-site/track/info/?track=${trackNumber}&locale=ru&token=&phone=`, {
                maxRedirects: 0,
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
                    "Cookie": this.cookies.value(),
                },
            })
        );
        const data = ResponseSchema.parse(response.data);
        return data.data!.statuses.filter(status => status.completed).flatMap(status => {
            const events: ParcelTrackEvent[] = [{
                date: status.date!,
                location: undefined,
                description: status.name,
                source: this.name,
            }];
            if (status.items !== null && status.items !== undefined) {
                for (const item of status.items) {
                    for (const itemStatus of item.statuses) {
                        events.push({
                            date: itemStatus.date,
                            location: item.name,
                            description: itemStatus.name,
                            source: this.name,
                        });
                    }
                }
            }
            return events;
        });
    }
}
