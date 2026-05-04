// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import z from "zod";
import { AxiosError } from "axios";

import { getDefaultHttpClient } from "..";
import type { ParcelTrackEvent } from "../parcel_track_event";
import type { TrackClient } from "../track_client";
import { Cookies } from "../cookies";

const ResponseSchema = z.object({
    items: z.array(z.object({
        event: z.string(),
        moment: z.iso.datetime({ offset: true }).transform(v => new Date(v)),
    })),
});

type Response = z.infer<typeof ResponseSchema>;

export class OzonRocketClient implements TrackClient {
    name: string = "OZON Rocket";

    private cookies: Cookies = new Cookies([
        { key: "__Secure-ETC", value: "71250e3801e52f3c811a792c599eb36b" },
        { key: "abt_data", value: "7.2kTpZGm2eYR5A6ThoO_a86pIeVxnfDV-7dh7wVY1WMy27__jt0rHFmQkFtW1UHO3nATo7KiVvEPBgUdHl2Vng5C4uzw5HWrezpWxtbpkbV8lDc2yfUHeNwJE1QWmsMoAj6kSxC6sgkVRiYwys-bCAL9mQCNL6qvtHXLszNDcG-h7dbeg46yJlC7oj60ZV9Kk4u9A6Fkg7ZrjXbMaoM7eYQDdgTTk3Frt-pHAB23uKSnlHtw4Pdm4kZtUZiAnoifsRrq7laeKBN_2lRDk5wn9z9wnzzspfPMPPNbLo-LkoBOPC0JAMG_fELp2G8FzI0ks31YF5SeT-UqjpKI4YKOYHt4LkbWStNguTyg-iiPXFP02kRwrNQQW5i0PzLyVNpzsVYv-CHQdHnwRz7l3PiBZSmFJp41ctn8-5hB0J_7gyuHn3AFOu35m3pAXVwuKaWkjxF_Xf6_L56YzPdmUE2JoFFhLkbyn_mHoDA8u_FnFIf_VU327Lx1ORSvzrBlhvPmJRk6j" },
    ]);

    private client = getDefaultHttpClient();

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

    private async _fetch(trackNumber: string): Promise<ParcelTrackEvent[]> {
        const r = this.cookies.apply(
            await this.client.get<Response>(`https://tracking.ozon.ru/p-api/ozon-track-bff/tracking/${trackNumber}`, {
                maxRedirects: 0,
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
                    "Cookie": this.cookies.value(),
                },
            })
        );
        const d = ResponseSchema.parse(r.data);
        return d.items.map(e => ({ date: e.moment, location: undefined, description: this.transformEvent(e.event), source: this.name }));
    }
}
