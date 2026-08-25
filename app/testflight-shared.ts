// TestFlight 신청 기능에서 서버·클라이언트·테스트가 함께 쓰는 순수 함수 모음.
// Node 테스트에서 직접 import하므로 런타임 의존성과 지워지지 않는 TS 문법(enum 등)을 쓰지 않습니다.

const SQLITE_TIMESTAMP_PATTERN = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?)$/;

// SQLite `CURRENT_TIMESTAMP`는 시간대 표기 없이 UTC(`YYYY-MM-DD HH:MM:SS`)를 돌려줍니다.
// 그 문자열을 `new Date()`에 그대로 넘기면 브라우저가 로컬 시각으로 해석해 KST 화면에서 9시간이 밀립니다.
// 시간대 표기가 없는 값은 UTC로 고정해 파싱하고, 오프셋이 있는 ISO 값은 그대로 신뢰합니다.
export function parseStoredTimestamp(value: string | null | undefined): Date | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const sqliteMatch = SQLITE_TIMESTAMP_PATTERN.exec(trimmed);
  const normalized = sqliteMatch ? `${sqliteMatch[1]}T${sqliteMatch[2]}Z` : trimmed;

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatSeoulDateTime(value: string | null | undefined): string {
  const parsed = parseStoredTimestamp(value);
  if (!parsed) return typeof value === "string" ? value : "";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(parsed);
}

// App Store Connect 사용자 생성에는 성·이름·이메일이 모두 필요합니다.
export const TESTER_NAME_MAX_LENGTH = 50;

export function normalizeTesterName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

const TESTER_NAME_FORBIDDEN_CHARACTER = /[@<>]/;

export function isValidTesterName(value: string): boolean {
  if (!value || value.length > TESTER_NAME_MAX_LENGTH) return false;
  // 이메일·태그가 이름 칸에 들어오는 것을 막습니다. 공백은 복합 성·이름을 위해 허용합니다.
  if (TESTER_NAME_FORBIDDEN_CHARACTER.test(value)) return false;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 0x20 || code === 0x7f) return false;
  }
  return true;
}

export type TesterNameFields = {
  lastName?: string | null;
  firstName?: string | null;
};

export function hasCompleteTesterName(fields: TesterNameFields): boolean {
  const lastName = normalizeTesterName(fields.lastName ?? "");
  const firstName = normalizeTesterName(fields.firstName ?? "");
  return isValidTesterName(lastName) && isValidTesterName(firstName);
}

export function missingTesterNameParts(fields: TesterNameFields): string[] {
  const missing: string[] = [];
  if (!isValidTesterName(normalizeTesterName(fields.lastName ?? ""))) missing.push("성");
  if (!isValidTesterName(normalizeTesterName(fields.firstName ?? ""))) missing.push("이름");
  return missing;
}

export type CodexRequestApplicant = TesterNameFields & {
  id: number;
  email: string;
  appSlug: string;
  appName: string;
  status: string;
};

export type CodexRequestSummary = {
  readyCount: number;
  blockedCount: number;
  appCount: number;
  text: string;
};

// 관리자 화면에서 한 번에 복사해 Codex에 붙여넣는 내부 테스터 등록 요청문을 만듭니다.
// 개인정보는 등록에 꼭 필요한 성·이름·이메일만 포함하고 기기·참여 동기는 넣지 않습니다.
export function buildCodexInternalTesterRequest(
  applicants: CodexRequestApplicant[],
  options?: { generatedAt?: Date },
): CodexRequestSummary {
  const pending = applicants.filter((applicant) => applicant.status === "pending");
  const ready = pending.filter((applicant) => hasCompleteTesterName(applicant));
  const blocked = pending.filter((applicant) => !hasCompleteTesterName(applicant));

  const groups = new Map<string, { appName: string; members: CodexRequestApplicant[] }>();
  for (const applicant of ready) {
    const group = groups.get(applicant.appSlug) ?? { appName: applicant.appName, members: [] };
    group.members.push(applicant);
    groups.set(applicant.appSlug, group);
  }
  const orderedGroups = [...groups.entries()].sort(([, a], [, b]) => a.appName.localeCompare(b.appName, "ko"));

  const generatedAt = options?.generatedAt ?? new Date();
  const generatedLabel = formatSeoulDateTime(generatedAt.toISOString());

  const lines: string[] = [];
  lines.push("[Codex 요청] NasFinder.com TestFlight 내부 테스터 등록");
  lines.push(`생성 시각: ${generatedLabel} (Asia/Seoul)`);
  lines.push(`등록 대상: 대기 중(pending) 상태이며 성·이름·이메일이 모두 있는 신청자 ${ready.length}명 / 앱 ${orderedGroups.length}개`);
  lines.push("");
  lines.push("작업 지시:");
  lines.push("1. 아래 각 사람이 App Store Connect 사용자로 아직 없으면 Users and Access에서 성·이름·이메일로 사용자 초대를 보내 주세요. 같은 이메일의 사용자나 아직 수락하지 않은 초대가 이미 있으면 중복으로 만들지 말고 기존 사용자·초대를 그대로 사용해 주세요.");
  lines.push("2. 권한은 최소로 제한합니다: 역할은 Marketing, 앱 접근은 각 그룹에 적힌 앱 하나만, 보고서(Reports) 접근 없음, Certificates/Identifiers/Profiles 등 추가 리소스 접근 없음.");
  lines.push("3. 각 사람을 해당 앱의 내부(Internal) TestFlight 그룹에 테스터로 추가해 주세요. 이미 그룹에 있으면 건너뜁니다. 외부(External) 그룹에는 추가하지 않습니다.");
  lines.push("4. 완료 후 사람마다 초대 발송 여부, App Store Connect 사용자 존재 여부, 지정 앱 접근 권한, 내부 TestFlight 그룹 포함 여부를 확인해서 결과를 표로 보고해 주세요.");
  lines.push("5. 확인되지 않았거나 실패한 사람은 완료로 표시하지 마세요. 아래 목록에 없는 사람은 등록하지 마세요.");
  lines.push("");

  if (orderedGroups.length === 0) {
    lines.push("== 등록 대상 없음 ==");
    lines.push("성·이름·이메일이 모두 갖춰진 대기 중 신청자가 없습니다. 이번 요청으로는 아무도 등록하지 마세요.");
    lines.push("");
  }

  for (const [appSlug, group] of orderedGroups) {
    lines.push(`== 앱: ${group.appName} (${appSlug}) — ${group.members.length}명 · 이 앱에만 접근 허용 ==`);
    for (const member of group.members) {
      lines.push(
        `- 성: ${normalizeTesterName(member.lastName)} / 이름: ${normalizeTesterName(member.firstName)} / 이메일: ${member.email.trim().toLowerCase()}`,
      );
    }
    lines.push("");
  }

  lines.push(`== 등록 보류 (성 또는 이름 누락) — ${blocked.length}명 ==`);
  if (blocked.length === 0) {
    lines.push("없음.");
  } else {
    lines.push("이름이 없는 신청자의 개인정보는 이 요청문에 포함하지 않았습니다. 아직 아무도 등록하지 말고, 관리자 화면에서 신청자에게 확인한 성·이름을 채운 뒤 다시 요청하세요. 이메일로 이름을 추측하지 마세요.");
  }

  return {
    readyCount: ready.length,
    blockedCount: blocked.length,
    appCount: orderedGroups.length,
    text: lines.join("\n"),
  };
}
