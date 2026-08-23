import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteCounters = sqliteTable("site_counters", {
  key: text("key").primaryKey(),
  value: integer("value").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const whattoeatRedTablePhotoShards = sqliteTable("whattoeat_redtable_photo_shards", {
  shardId: integer("shard_id").primaryKey(),
  entriesJSON: text("entries_json").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const whattoeatRedTablePhotoShardsNext = sqliteTable("whattoeat_redtable_photo_shards_next", {
  shardId: integer("shard_id").primaryKey(),
  entriesJSON: text("entries_json").notNull(),
  updatedAt: text("updated_at").notNull(),
});
