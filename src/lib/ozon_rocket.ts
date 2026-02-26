// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import z from "zod";
import axios, { AxiosError } from "axios";
import type { Event } from "./event";
import type { TrackClient } from "./track_client";
import { Cookies } from "./cookies";

const ResponseSchema = z.object({
    items: z.array(z.object({
        event: z.string(),
        moment: z.iso.datetime({ offset: true }).transform(v => new Date(v)),
    })),
});

type Response = z.infer<typeof ResponseSchema>;

class OzonRocketClient implements TrackClient {
    private cookies: Cookies = new Cookies([
        { key: "__Secure-ETC", value: "4de46e95f3ad488333d2b6c95ee22e78" },
        { key: "abt_data", value: "7.LWBQtLuF1wp8z5Apwtl-lXrA2mPzrybrhEKFSFIurpwLCyF6KgsNrVk-t8G_0XgklvlC500BNOkMXU6AMqGw5pvRilx-dK2IFijsE8QecMerLQmQkDuyrDCEnlp4nWfKZ9aT5Jrj9VQLy5C10y3MRjpt98wsoTSOgemjvgQd-swVYWS0Gohb9q43eIL5RK_QNnlwpawpfSsR8VAeu1RZxS4eQ5T0bGOQjdTf6MqpV5Tissji68l9p2RlIamG4FD0p3WmdVnSDJLV9aCA34bnBbPt2vLAL6NpzGXd97B-4zJ2volzGK-TBoQk6u2RY3zrkWIIGh7pzmgCP9qMhp3IyhFM7QhKAxGKxjnT-oy4cP6w2xzDQqVb43jz_-X9ClfWLdk4-zTCt0ZqTiB7idgBgy9Y6s_u2nmMZ8TX8YlUgn8RnzyKUltsRt5233xyvPpQ_8lBViZVqw" },
    ]);

    async fetch(trackNumber: string): Promise<Event[]> {
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

    private transformEvent(event: string): string {
        const split = [];
        let sb = "";
        for (let i = 0; i < event.length; i++) {
            if (i !== 0 && /[A-Z]/.test(event[i])) {
                split.push(sb);
                sb = event[i];
            } else {
                sb += event[i];
            }
        }
        if (sb !== "") {
            split.push(sb);
        }
        return split.map((v, i) => i === 0 ? v : v.toLowerCase()).join(" ");
    }

    private async _fetch(trackNumber: string): Promise<Event[]> {
        const r = this.cookies.apply(
            await axios.get<Response>(`https://tracking.ozon.ru/p-api/ozon-track-bff/tracking/${trackNumber}`, {
                maxRedirects: 0,
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
                    "Cookie": this.cookies.value(),
                },
            })
        );
        const d = ResponseSchema.parse(r.data);
        return d.items.map(e => ({ date: e.moment, location: undefined, description: this.transformEvent(e.event), source: "OZON Rocket" }));
    }
}

export const client = new OzonRocketClient();
