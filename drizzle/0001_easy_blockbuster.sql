CREATE TABLE `whattoeat_redtable_photo_shards` (
	`shard_id` integer PRIMARY KEY NOT NULL,
	`entries_json` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `whattoeat_redtable_photo_shards_next` (
	`shard_id` integer PRIMARY KEY NOT NULL,
	`entries_json` text NOT NULL,
	`updated_at` text NOT NULL
);
