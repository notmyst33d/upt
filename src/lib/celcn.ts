// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import axios from "axios";
import type { TrackClient } from "./track_client";
import type { Event } from "./event";
import { Cookies } from "./cookies";

class CelcnClient implements TrackClient {
    private viewState: string | undefined = undefined;

    private eventValidation: string | undefined = undefined;

    private cookies = new Cookies([{ key: "i18next_lng", value: "en" }]);

    async fetch(trackNumber: string): Promise<Event[]> {
        console.log(this.cookies);
        if (this.viewState === undefined || this.eventValidation === undefined) {
            const response = this.cookies.apply(
                await axios.get<string>("http://hccd.rtb56.com/track_query.aspx", {
                    headers: { "Cookie": this.cookies.value() }
                })
            );

            this.viewState = response.data.split("id=\"__VIEWSTATE\" value=\"", 2)[1].split("\"", 2)[0];
            this.eventValidation = response.data.split("id=\"__EVENTVALIDATION\" value=\"", 2)[1].split("\"", 2)[0];
        }

        let response = this.cookies.apply(
            await axios.get("http://hccd.rtb56.com/Captcha/CaptchaHandler.ashx?action=ValidateCaptcha&pageName=track_query", {
                headers: { "Cookie": this.cookies.value() }
            })
        );
        if (response.status != 200) {
            throw "captcha failed";
        }

        const form = new FormData();
        form.append("__VIEWSTATE", this.viewState!);
        form.append("__EVENTVALIDATION", this.eventValidation!);
        form.append("track_number", trackNumber);
        form.append("btnSearch", "Track");

        response = this.cookies.apply(
            await axios.post<string>("http://hccd.rtb56.com/track_query.aspx", form, {
                headers: { "Cookie": this.cookies.value() }
            })
        );

        const events: Event[] = [];
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
