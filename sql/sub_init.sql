CREATE TABLE subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    track_number TEXT NOT NULL,
    sources TEXT NOT NULL,
    service TEXT NOT NULL,
    options TEXT NOT NULL,
    retries INTEGER NOT NULL,
    last_update DATETIME
);
