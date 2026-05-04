// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import Database from "better-sqlite3";
import z from "zod";

export const SubscriptionSchema = z.object({
    id: z.int(),
    track_number: z.string(),
    sources: z.string(),
    service: z.string(),
    options: z.string(),
    retries: z.int(),
    last_update: z.nullable(z.date()),
});

export const open = () => new Database("sub.db");
