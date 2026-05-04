// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
    return {
        service: "ntfy",
        notice: "sub_ntfy_notice",
    };
};
