import { getD1 } from "./index";

export type TestFlightStatus = "pending" | "selected" | "rejected" | "invited";

export type TestFlightApplicationRow = {
  id: number;
  email: string;
  // 이름 칸이 없던 시기의 기존 행은 null입니다. 두 값이 모두 있어야 App Store Connect 사용자 초대가 가능합니다.
  lastName: string | null;
  firstName: string | null;
  appSlug: string;
  appName: string;
  device: string;
  reason: string;
  status: TestFlightStatus;
  consentedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type TestFlightSummaryStats = {
  total: number;
  pending: number;
  selected: number;
  invited: number;
  rejected: number;
};

export async function createTestFlightApplication(data: {
  email: string;
  lastName: string;
  firstName: string;
  appSlug: string;
  appName: string;
  device: string;
  reason: string;
  ipHash: string;
}): Promise<number> {
  const db = getD1();
  // 시각은 SQLite CURRENT_TIMESTAMP(UTC, 'YYYY-MM-DD HH:MM:SS')로 저장합니다.
  // 화면에서는 app/testflight-shared.ts의 parseStoredTimestamp로 UTC임을 명시해 파싱합니다.
  const result = await db
    .prepare(
      `INSERT INTO testflight_applications (email, last_name, first_name, app_slug, app_name, device, reason, status, ip_hash, consented_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    )
    .bind(
      data.email.trim().toLowerCase(),
      data.lastName.trim(),
      data.firstName.trim(),
      data.appSlug.trim(),
      data.appName.trim(),
      data.device.trim(),
      data.reason.trim(),
      data.ipHash
    )
    .run();

  return Number(result.meta?.last_row_id ?? 0);
}

export async function listTestFlightApplications(filter?: {
  status?: string;
  appSlug?: string;
}): Promise<TestFlightApplicationRow[]> {
  const db = getD1();
  const conditions: string[] = [];
  const bindings: unknown[] = [];

  if (filter?.status && ["pending", "selected", "rejected", "invited"].includes(filter.status)) {
    conditions.push("status = ?");
    bindings.push(filter.status);
  }

  if (filter?.appSlug && filter.appSlug.trim().length > 0) {
    conditions.push("app_slug = ?");
    bindings.push(filter.appSlug.trim());
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const query = `
    SELECT
      id,
      email,
      last_name AS lastName,
      first_name AS firstName,
      app_slug AS appSlug,
      app_name AS appName,
      device,
      reason,
      status,
      consented_at AS consentedAt,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM testflight_applications
    ${whereClause}
    ORDER BY id DESC
    LIMIT 500
  `;

  const result = await db.prepare(query).bind(...bindings).all<TestFlightApplicationRow>();
  return result.results ?? [];
}

export async function updateTestFlightStatus(
  id: number,
  status: TestFlightStatus
): Promise<boolean> {
  const db = getD1();
  const result = await db
    .prepare(
      `UPDATE testflight_applications
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .bind(status, id)
    .run();

  return (result.meta?.changes ?? 0) > 0;
}

// 이름 칸이 생기기 전에 접수된 기존 행의 성·이름을 관리자가 직접 채울 때 사용합니다.
// 이메일에서 이름을 추측해 넣지 않고, 호출 측에서 검증된 값만 전달합니다.
export async function updateTestFlightApplicantName(
  id: number,
  lastName: string,
  firstName: string
): Promise<boolean> {
  const db = getD1();
  const result = await db
    .prepare(
      `UPDATE testflight_applications
       SET last_name = ?, first_name = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .bind(lastName.trim(), firstName.trim(), id)
    .run();

  return (result.meta?.changes ?? 0) > 0;
}

export async function deleteTestFlightApplication(id: number): Promise<boolean> {
  const db = getD1();
  const result = await db
    .prepare(`DELETE FROM testflight_applications WHERE id = ?`)
    .bind(id)
    .run();

  return (result.meta?.changes ?? 0) > 0;
}

export async function countRecentApplicationsByIpHash(
  ipHash: string,
  windowMinutes = 60
): Promise<number> {
  const db = getD1();
  const result = await db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM testflight_applications
       WHERE ip_hash = ?
         AND datetime(created_at) >= datetime('now', '-' || ? || ' minutes')`
    )
    .bind(ipHash, windowMinutes)
    .first<{ count: number }>();

  return Number(result?.count ?? 0);
}

export async function findRecentDuplicateApplication(
  email: string,
  appSlug: string
): Promise<boolean> {
  const db = getD1();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedSlug = appSlug.trim();

  const result = await db
    .prepare(
      `SELECT id
       FROM testflight_applications
       WHERE email = ?
         AND app_slug = ?
         AND status IN ('pending', 'selected', 'invited')
       LIMIT 1`
    )
    .bind(normalizedEmail, normalizedSlug)
    .first<{ id: number }>();

  return Boolean(result?.id);
}

export async function getTestFlightSummaryStats(): Promise<TestFlightSummaryStats> {
  const db = getD1();
  const result = await db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
         SUM(CASE WHEN status = 'selected' THEN 1 ELSE 0 END) AS selected,
         SUM(CASE WHEN status = 'invited' THEN 1 ELSE 0 END) AS invited,
         SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected
       FROM testflight_applications`
    )
    .first<{
      total: number;
      pending: number | null;
      selected: number | null;
      invited: number | null;
      rejected: number | null;
    }>();

  return {
    total: Number(result?.total ?? 0),
    pending: Number(result?.pending ?? 0),
    selected: Number(result?.selected ?? 0),
    invited: Number(result?.invited ?? 0),
    rejected: Number(result?.rejected ?? 0),
  };
}
