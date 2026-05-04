// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Myst33d <myst33d@gmail.com>

import type { ParcelTrackEvent } from "./parcel_track_event";

export interface TrackClient {
    name: string;

    fetch(trackNumber: string): Promise<ParcelTrackEvent[]>;
}
