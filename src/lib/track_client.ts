// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import type { Event } from "./event";

export interface TrackClient {
    fetch(trackNumber: string): Promise<Event[]>;
}
