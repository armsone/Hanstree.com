import { getD1 } from "./index";

const ADMIN_SETTINGS_ID = 1;

export async function getStoredTestFlightAdminPasswordHash(): Promise<string | null> {
  const row = await getD1()
    .prepare("SELECT password_hash AS passwordHash FROM testflight_admin_settings WHERE id = ?")
    .bind(ADMIN_SETTINGS_ID)
    .first<{ passwordHash: string }>();

  return row?.passwordHash ?? null;
}

export async function createTestFlightAdminPasswordHash(passwordHash: string): Promise<boolean> {
  const result = await getD1()
    .prepare(
      `INSERT OR IGNORE INTO testflight_admin_settings (id, password_hash, created_at, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    )
    .bind(ADMIN_SETTINGS_ID, passwordHash)
    .run();

  return (result.meta?.changes ?? 0) > 0;
}
