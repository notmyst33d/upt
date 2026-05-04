// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request, locals, cookies }) => {
        const form = await request.formData();
        const lang = form.get("lang");
        if (typeof lang !== "string") {
            return fail(400);
        }
        if (lang !== locals.lang) {
            // 100 years should be enough
            cookies.set("lang", lang, { path: "/", maxAge: 100 * 60 * 60 * 24 * 365, secure: false });
            locals.lang = lang;
        }
    }
};
