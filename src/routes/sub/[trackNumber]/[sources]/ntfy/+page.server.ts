// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import { AxiosError } from "axios";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

import { getDefaultHttpClient } from "$lib";
import { _i18n, i18nData } from "$lib/i18n";
import { open, SubscriptionSchema } from "$lib/sub_db";
import { NtfyOptionsSchema } from "$lib/options";

export const actions: Actions = {
    default: async ({ request, locals, params }) => {
        // TODO
        return fail(501);

        const form = await request.formData();
        const domain = form.get("domain");
        const topic = form.get("topic");
        const token = form.get("token");
        if (typeof domain !== "string" || typeof topic !== "string" || typeof token !== "string") {
            return fail(400);
        }

        const db = open();
        for (const row of db.prepare("SELECT * FROM subscriptions WHERE service = 'ntfy' AND track_number = ?").iterate(params.trackNumber)) {
            const sub = SubscriptionSchema.parse(row);
            const options = NtfyOptionsSchema.parse(JSON.parse(sub.options));
            if (options.domain == domain && options.topic == topic && options.token == token && sub.sources == params.sources) {
                return { domain, topic, token, fail: "sub_setup_already_exists" };
            }
        }

        const client = getDefaultHttpClient();
        try {
            const s = _i18n(i18nData, locals.lang, "sub_setup_test_md").replace("{track_number}", params.trackNumber);
            await client.post(`https://${domain}/${topic}`, s, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "text/markdown",
                }
            });
        } catch (e) {
            if (e instanceof AxiosError) {
                return { domain, topic, token, fail: "sub_setup_service_error", status: e.status, code: e.code };
            }
            return { domain, topic, token, fail: "sub_setup_service_error", status: "unknown", code: "unknown" };
        }

        db.prepare("INSERT INTO subscriptions (track_number, sources, service, options, retries, last_update) VALUES (?, ?, ?, ?, 0, NULL)").run(params.trackNumber, params.sources, "ntfy", JSON.stringify({ domain, topic, token }));
        db.close();

        return { domain, topic, token, success: true };
    }
};
