import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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

export const testflightApplications = sqliteTable(
  "testflight_applications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    // App Store Connect 사용자 초대에 필요한 성·이름. 기존 신청 행 보존을 위해 nullable로 추가했습니다.
    lastName: text("last_name"),
    firstName: text("first_name"),
    appSlug: text("app_slug").notNull(),
    appName: text("app_name").notNull(),
    device: text("device").notNull(),
    reason: text("reason").notNull(),
    status: text("status").notNull().default("pending"),
    ipHash: text("ip_hash").notNull(),
    consentedAt: text("consented_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_testflight_applications_ip_created").on(table.ipHash, table.createdAt),
    index("idx_testflight_applications_email_app_status").on(table.email, table.appSlug, table.status),
    index("idx_testflight_applications_status_app").on(table.status, table.appSlug),
  ],
);

export const testflightAdminSettings = sqliteTable("testflight_admin_settings", {
  id: integer("id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
