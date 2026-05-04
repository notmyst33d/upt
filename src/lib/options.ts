// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import z from "zod";

export const NtfyOptionsSchema = z.object({
    domain: z.string(),
    topic: z.string(),
    token: z.string(),
});
