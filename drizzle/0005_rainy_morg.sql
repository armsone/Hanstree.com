CREATE TABLE `release_snapshots` (
	`key` text PRIMARY KEY NOT NULL,
	`record_json` text NOT NULL,
	`checked_at` text NOT NULL,
	`retry_after` text NOT NULL
);
