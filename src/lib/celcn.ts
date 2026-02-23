// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import axios from "axios";
import type { Event } from "./event";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import type { TrackClient } from "./track_client";

class CelcnClient implements TrackClient {
    viewState: string | undefined;

    eventValidation: string | undefined;

    async fetch(trackNumber: string): Promise<Event[]> {
        const jar = new CookieJar();
        jar.setCookie("i18next_lng=en", "http://hccd.rtb56.com");

        const client = wrapper(axios.create({ jar }));

        if (this.viewState === undefined || this.eventValidation === undefined) {
            const response = await client.get<string>("http://hccd.rtb56.com/track_query.aspx");
            this.viewState = response.data.split("id=\"__VIEWSTATE\" value=\"", 2)[1].split("\"", 2)[0];
            this.eventValidation = response.data.split("id=\"__EVENTVALIDATION\" value=\"", 2)[1].split("\"", 2)[0];
        }

        let response = await client.get("http://hccd.rtb56.com/Captcha/CaptchaHandler.ashx?action=ValidateCaptcha&pageName=track_query");
        if (response.status != 200) {
            throw "captcha failed";
        }

        const form = new FormData();
        form.append("__VIEWSTATE", this.viewState);
        form.append("__EVENTVALIDATION", this.eventValidation);
        form.append("track_number", trackNumber);
        form.append("btnSearch", "Track");

        response = await client.post<string>("http://hccd.rtb56.com/track_query.aspx", form);

        const events = [];

        const lines = response.data.split("\n");
        for (let i = 0; i < lines.length - 3; i++) {
            const line = lines[i];
            if (line.includes("<tr>")) {
                const td1 = lines[i + 1];
                const td2 = lines[i + 2];
                const td3 = lines[i + 3];

                if (td1.includes("track.time")) {
                    continue;
                }

                const date = td1.split(">", 2)[1].split("</")[0];
                const location = td2.split(">", 2)[1].split("</")[0];
                const event = td3.split(">", 2)[1].split("</")[0];

                events.push({
                    date: new Date(date.replace(" ", "T") + "Z"),
                    location: location,
                    description: event,
                    source: "CEL Express",
                });
            }
        }

        return events;
    }
}

export const client = new CelcnClient();
