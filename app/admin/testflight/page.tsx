"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { SiteFooter, SiteHeader } from "../../page";
import { SiteInsights } from "../../components/SiteInsights";
import { testFlightBuilds } from "../../testflight";
import {
  buildCodexInternalTesterRequest,
  formatSeoulDateTime,
  hasCompleteTesterName,
  missingTesterNameParts,
} from "../../testflight-shared";
import type { TestFlightApplicationRow, TestFlightStatus, TestFlightSummaryStats } from "../../../db/testflight";

type NameDraft = { lastName: string; firstName: string };

async function fetchApplicationList(status: string, appSlug: string): Promise<Response> {
  const queryParams = new URLSearchParams();
  if (status !== "all") queryParams.set("status", status);
  if (appSlug !== "all") queryParams.set("appSlug", appSlug);

  return fetch(`/api/admin/testflight/applications?${queryParams.toString()}`, {
    cache: "no-store",
  });
}

export default function TestFlightAdminPage() {
  const [isPending, startTransition] = useTransition();

  // Auth State
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Login Form State
  const [userId, setUserId] = useState("armsone");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data State
  const [applications, setApplications] = useState<TestFlightApplicationRow[]>([]);
  // 화면 필터와 무관하게 '현재 대기 중' 전체 목록을 따로 보관해 Codex 요청문을 즉시(클릭 제스처 안에서) 만듭니다.
  const [pendingApplications, setPendingApplications] = useState<TestFlightApplicationRow[]>([]);
  const [nameDrafts, setNameDrafts] = useState<Record<number, NameDraft>>({});
  const [codexPreview, setCodexPreview] = useState<string | null>(null);
  const [stats, setStats] = useState<TestFlightSummaryStats>({
    total: 0,
    pending: 0,
    selected: 0,
    invited: 0,
    rejected: 0,
  });
  const [loadingData, setLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [appFilter, setAppFilter] = useState<string>("all");
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadApplications = useCallback(async (status = "all", appSlug = "all") => {
    setLoadingData(true);
    setActionFeedback(null);

    try {
      const [response, pendingResponse] = await Promise.all([
        fetchApplicationList(status, appSlug),
        fetchApplicationList("pending", "all"),
      ]);

      if (response.status === 401 || pendingResponse.status === 401) {
        setAuthenticated(false);
        return;
      }

      const data = await response.json();
      const pendingData = await pendingResponse.json();
      if (response.ok) {
        setApplications(data.applications || []);
        if (data.stats) setStats(data.stats);
        if (pendingResponse.ok) setPendingApplications(pendingData.applications || []);
      } else {
        setActionFeedback({
          type: "error",
          text: data.error || "신청 목록을 불러오지 못했습니다.",
        });
      }
    } catch {
      setActionFeedback({
        type: "error",
        text: "서버 통신 중 오류가 발생했습니다.",
      });
    } finally {
      setLoadingData(false);
    }
  }, []);

  const fetchAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/testflight/login", { cache: "no-store" });
      const data = await response.json();
      setConfigured(Boolean(data.configured));
      setAuthenticated(Boolean(data.authenticated));

      if (data.authenticated) {
        await loadApplications("all", "all");
      }
    } catch {
      setConfigured(false);
      setAuthenticated(false);
    }
  }, [loadApplications]);

  useEffect(() => {
    // The one-time setup token exists only in the browser URL after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSetupToken(new URLSearchParams(window.location.search).get("setup") ?? "");
    // Authentication is external server state and must be read after hydration.
    void fetchAuthStatus();
  }, [fetchAuthStatus]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (password !== passwordConfirm) {
      setLoginError("두 비밀번호가 다릅니다. 다시 입력해 주세요.");
      return;
    }

    setLoginLoading(true);
    try {
      const response = await fetch("/api/admin/testflight/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup", password, setupToken }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "비밀번호를 저장하지 못했습니다.");
        return;
      }

      window.history.replaceState(null, "", "/admin/testflight");
      setConfigured(true);
      setAuthenticated(true);
      setPassword("");
      setPasswordConfirm("");
      setSetupToken("");
      await loadApplications();
    } catch {
      setLoginError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const response = await fetch("/api/admin/testflight/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "로그인에 실패했습니다.");
        return;
      }

      setAuthenticated(true);
      setPassword("");
      loadApplications();
    } catch {
      setLoginError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/testflight/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } finally {
      setAuthenticated(false);
      setApplications([]);
      setPendingApplications([]);
      setCodexPreview(null);
      setPassword("");
    }
  };

  const handleNameDraftChange = (id: number, field: keyof NameDraft, value: string) => {
    setNameDrafts((prev) => ({
      ...prev,
      [id]: { lastName: "", firstName: "", ...prev[id], [field]: value },
    }));
  };

  // 이름 칸이 없던 시기의 기존 신청 행에 성·이름을 채웁니다. 이메일로 이름을 추측하지 않고 관리자가 확인한 값만 저장합니다.
  const handleNameSave = async (id: number) => {
    const draft = nameDrafts[id];
    const lastName = draft?.lastName.trim() ?? "";
    const firstName = draft?.firstName.trim() ?? "";
    if (!lastName || !firstName) {
      setActionFeedback({ type: "error", text: "성과 이름을 모두 입력한 뒤 저장해 주세요." });
      return;
    }

    setActionFeedback(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/testflight/applications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, lastName, firstName }),
        });

        const data = await response.json();

        if (response.ok) {
          const applyName = (list: TestFlightApplicationRow[]) =>
            list.map((app) => (app.id === id ? { ...app, lastName, firstName } : app));
          setApplications(applyName);
          setPendingApplications(applyName);
          setNameDrafts((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          setActionFeedback({ type: "success", text: "성·이름이 저장되어 등록 요청에 포함할 수 있습니다." });
          loadApplications(statusFilter, appFilter);
        } else {
          setActionFeedback({ type: "error", text: data.error || "이름 저장에 실패했습니다." });
        }
      } catch {
        setActionFeedback({ type: "error", text: "이름 저장 중 통신 오류가 발생했습니다." });
      }
    });
  };

  // 대기 중이며 성·이름이 모두 있는 신청자를 앱별로 묶어 Codex 등록 요청문 한 개로 복사합니다.
  const handleCopyCodexRequest = () => {
    setActionFeedback(null);
    setCodexPreview(null);

    const summary = buildCodexInternalTesterRequest(pendingApplications);

    if (summary.readyCount === 0) {
      setActionFeedback({
        type: "error",
        text:
          summary.blockedCount === 0
            ? "복사할 대기 중(pending) 신청자가 없습니다."
            : `등록 가능한 대기 중 신청자가 없습니다. 이름 미입력 ${summary.blockedCount}명은 성·이름을 먼저 채워 주세요.`,
      });
      return;
    }

    const successText = `Codex 등록 요청을 복사했습니다. 등록 대상 ${summary.readyCount}명 (앱 ${summary.appCount}개)${
      summary.blockedCount > 0 ? ` · 이름 미입력으로 보류 ${summary.blockedCount}명` : ""
    }`;

    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      setCodexPreview(summary.text);
      setActionFeedback({
        type: "error",
        text: "이 브라우저에서는 자동 복사를 사용할 수 없습니다. 아래 요청문을 직접 선택해 복사해 주세요.",
      });
      return;
    }

    navigator.clipboard
      .writeText(summary.text)
      .then(() => {
        setActionFeedback({ type: "success", text: successText });
      })
      .catch(() => {
        setCodexPreview(summary.text);
        setActionFeedback({
          type: "error",
          text: "클립보드 복사에 실패했습니다. 아래 요청문을 직접 선택해 복사해 주세요.",
        });
      });
  };

  const pendingReadyCount = pendingApplications.filter((app) => hasCompleteTesterName(app)).length;
  const pendingBlockedCount = pendingApplications.length - pendingReadyCount;

  const handleStatusChange = async (id: number, newStatus: TestFlightStatus) => {
    setActionFeedback(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/testflight/applications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: newStatus }),
        });

        const data = await response.json();

        if (response.ok) {
          setActionFeedback({ type: "success", text: `상태가 '${statusLabel(newStatus)}'(으)로 변경되었습니다.` });
          // Optimistically update local application list
          setApplications((prev) =>
            prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
          );
          // Reload fresh data and stats
          loadApplications(statusFilter, appFilter);
        } else {
          setActionFeedback({ type: "error", text: data.error || "상태 변경에 실패했습니다." });
        }
      } catch {
        setActionFeedback({ type: "error", text: "상태 변경 중 통신 오류가 발생했습니다." });
      }
    });
  };

  const handleDelete = async (id: number, email: string, appName: string) => {
    const confirmed = window.confirm(
      `[영구 삭제]\n\n'${appName}' 신청자 (${email})의 기록을 D1 데이터베이스에서 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    if (!confirmed) return;

    setActionFeedback(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/testflight/applications?id=${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok) {
          setActionFeedback({ type: "success", text: "신청자 기록이 영구 삭제되었습니다." });
          setApplications((prev) => prev.filter((app) => app.id !== id));
          loadApplications(statusFilter, appFilter);
        } else {
          setActionFeedback({ type: "error", text: data.error || "삭제에 실패했습니다." });
        }
      } catch {
        setActionFeedback({ type: "error", text: "삭제 중 통신 오류가 발생했습니다." });
      }
    });
  };

  const statusLabel = (status: TestFlightStatus) => {
    switch (status) {
      case "pending":
        return "대기 중";
      case "selected":
        return "선정";
      case "invited":
        return "초대 완료";
      case "rejected":
        return "제외";
      default:
        return status;
    }
  };

  // D1의 created_at은 시간대 표기 없는 UTC 문자열이므로 공용 파서로 UTC를 명시해 KST로 표시합니다.
  const formatDate = (storedValue: string) => {
    try {
      return formatSeoulDateTime(storedValue);
    } catch {
      return storedValue;
    }
  };

  return (
    <main className="admin-page">
      <SiteHeader />

      <div className="shell admin-shell">
        {/* Loading Initial Auth State */}
        {authenticated === null && (
          <div className="admin-loading-card">
            <p>관리자 환경을 확인하고 있습니다...</p>
          </div>
        )}

        {/* Unauthenticated / Login Card */}
        {authenticated === false && (
          <div className="admin-login-wrapper">
            <div className="admin-login-card">
              <div className="admin-login-head">
                <p className="eyebrow">ADMINISTRATOR ACCESS</p>
                <h1>TestFlight 관리자 로그인</h1>
                <p className="admin-login-sub">
                  관리자 계정(<code>armsone</code>) 전용 비공개 관리 화면입니다.
                </p>
              </div>

              {!configured && (
                setupToken ? (
                  <form className="admin-login-form" onSubmit={handleSetup}>
                    <div className="admin-locked-banner">
                      <strong>관리자 비밀번호 설정</strong>
                      <p>대표님이 사용할 비밀번호를 직접 정해 주세요. 길이 제한은 없습니다.</p>
                    </div>
                    <div className="admin-form-group">
                      <label htmlFor="new-admin-password">새 비밀번호</label>
                      <input
                        id="new-admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loginLoading}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label htmlFor="new-admin-password-confirm">비밀번호 다시 입력</label>
                      <input
                        id="new-admin-password-confirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        disabled={loginLoading}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    {loginError && <div className="admin-error-banner" role="alert">{loginError}</div>}
                    <button type="submit" className="button button-primary admin-login-btn" disabled={loginLoading}>
                      {loginLoading ? "저장 중..." : "비밀번호 저장하고 들어가기 →"}
                    </button>
                  </form>
                ) : (
                  <div className="admin-locked-banner" role="alert">
                    <strong>관리자 비밀번호 설정이 필요합니다</strong>
                    <p>안전한 최초 설정 링크로 이 페이지를 다시 열어 주세요.</p>
                  </div>
                )
              )}

              {configured && (
                <form className="admin-login-form" onSubmit={handleLogin}>
                  <div className="admin-form-group">
                    <label htmlFor="admin-id">관리자 아이디</label>
                    <input
                      id="admin-id"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      disabled={loginLoading}
                      autoComplete="username"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="admin-password">비밀번호</label>
                    <input
                      id="admin-password"
                      type="password"
                      placeholder="관리자 비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loginLoading}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="admin-error-banner" role="alert">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="button button-primary admin-login-btn"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "인증 확인 중..." : "관리자 로그인 →"}
                  </button>
                </form>
              )}

              <div className="admin-login-footer">
                <Link href="/">← NasFinder.com 홈으로</Link>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated Dashboard */}
        {authenticated === true && (
          <>
          <div className="admin-dashboard">
            <header className="admin-dash-header">
              <div>
                <p className="eyebrow">TESTFLIGHT ADMIN CONSOLE</p>
                <h1>TestFlight 신청자 관리</h1>
                <p className="admin-ident">
                  관리자: <strong>armsone</strong> · Cloudflare D1 저장소 연결
                </p>
              </div>
              <div className="admin-dash-actions">
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={() => loadApplications(statusFilter, appFilter)}
                  disabled={loadingData || isPending}
                >
                  새로고침 ↻
                </button>
                <button
                  type="button"
                  className="button button-primary admin-logout-btn"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            </header>

            {/* Metric Cards */}
            <section className="admin-metrics-grid" aria-label="신청 현황 통계">
              <article className="admin-metric-card">
                <span>전체 신청</span>
                <strong>{stats.total}</strong>
                <small>건 접수됨</small>
              </article>
              <article className="admin-metric-card metric-pending">
                <span>대기 중 (pending)</span>
                <strong>{stats.pending}</strong>
                <small>검토 필요</small>
              </article>
              <article className="admin-metric-card metric-selected">
                <span>선정 (selected)</span>
                <strong>{stats.selected}</strong>
                <small>초대 대상자</small>
              </article>
              <article className="admin-metric-card metric-invited">
                <span>초대 완료 (invited)</span>
                <strong>{stats.invited}</strong>
                <small>TestFlight 발송됨</small>
              </article>
              <article className="admin-metric-card metric-rejected">
                <span>제외 (rejected)</span>
                <strong>{stats.rejected}</strong>
                <small>미선정 / 보류</small>
              </article>
            </section>

            {/* Filter Toolbar */}
            <section className="admin-toolbar" aria-label="목록 필터링">
              <div className="admin-filter-group">
                <label htmlFor="filter-status">상태별 보기</label>
                <select
                  id="filter-status"
                  value={statusFilter}
                  onChange={(e) => {
                    const next = e.target.value;
                    setStatusFilter(next);
                    loadApplications(next, appFilter);
                  }}
                >
                  <option value="all">전체 상태 ({stats.total})</option>
                  <option value="pending">대기 중 ({stats.pending})</option>
                  <option value="selected">선정됨 ({stats.selected})</option>
                  <option value="invited">초대 완료 ({stats.invited})</option>
                  <option value="rejected">제외됨 ({stats.rejected})</option>
                </select>
              </div>

              <div className="admin-filter-group">
                <label htmlFor="filter-app">앱별 보기</label>
                <select
                  id="filter-app"
                  value={appFilter}
                  onChange={(e) => {
                    const next = e.target.value;
                    setAppFilter(next);
                    loadApplications(statusFilter, next);
                  }}
                >
                  <option value="all">전체 앱</option>
                  {testFlightBuilds.map((build) => (
                    <option key={build.slug} value={build.slug}>
                      {build.appName} ({build.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-count-badge">
                {loadingData ? "조회 중..." : `현재 표시: ${applications.length}건`}
              </div>
            </section>

            {/* Codex 내부 테스터 등록 요청 복사 */}
            <section className="admin-codex-panel" aria-label="Codex 내부 테스터 등록 요청">
              <div className="admin-codex-actions">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleCopyCodexRequest}
                  disabled={loadingData || isPending}
                  title="대기 중이며 성·이름이 있는 신청자 전체를 앱별로 묶어 Codex 등록 요청문으로 복사"
                >
                  대기 중 신청자 Codex 등록 요청 복사 📋
                </button>
                <span className="admin-codex-count">
                  {loadingData
                    ? "대기 목록 확인 중..."
                    : `등록 가능 ${pendingReadyCount}명 · 이름 미입력 보류 ${pendingBlockedCount}명`}
                </span>
              </div>
              <p>
                복사되는 요청문은 현재 <strong>대기 중(pending)</strong> 상태이며 성·이름·이메일이 모두 있는 신청자만 앱별로 묶어
                포함합니다. 기기 모델과 참여 동기는 넣지 않습니다. Codex에는 각 사람을 Marketing 역할·해당 앱만 접근·보고서와 추가
                리소스 접근 없음 조건의 App Store Connect 사용자로 초대(중복 방지)하고 내부 TestFlight 그룹에 추가한 뒤 확인하도록
                지시합니다. 성 또는 이름이 없는 신청자는 인원수만 표시하며 개인정보는 복사하지 않습니다.
              </p>
              {codexPreview && (
                <textarea
                  className="admin-codex-preview"
                  readOnly
                  value={codexPreview}
                  aria-label="Codex 등록 요청문 (직접 복사)"
                  onFocus={(e) => e.currentTarget.select()}
                />
              )}
            </section>

            {actionFeedback && (
              <div
                className={`admin-feedback-banner ${actionFeedback.type === "success" ? "feedback-success" : "feedback-error"}`}
                role="alert"
              >
                {actionFeedback.type === "success" ? "✓ " : "✕ "}
                {actionFeedback.text}
              </div>
            )}

            {/* Applications List */}
            <section className="admin-table-container" aria-label="신청자 목록">
              {applications.length === 0 ? (
                <div className="admin-empty-state">
                  <p>{loadingData ? "데이터를 불러오는 중입니다..." : "조회된 신청자가 없습니다."}</p>
                </div>
              ) : (
                <div className="admin-cards-list">
                  {applications.map((app) => {
                    const nameComplete = hasCompleteTesterName(app);
                    const missingParts = missingTesterNameParts(app);
                    const draft = nameDrafts[app.id] ?? { lastName: app.lastName ?? "", firstName: app.firstName ?? "" };
                    return (
                    <article className={`admin-app-card status-border-${app.status}`} key={app.id}>
                      <div className="admin-card-top">
                        <div className="admin-card-meta">
                          <span className="admin-id-badge">#{app.id}</span>
                          <strong className="admin-app-name">{app.appName}</strong>
                          <span className="admin-slug-badge">{app.appSlug}</span>
                          <time className="admin-time">{formatDate(app.createdAt)}</time>
                          {!nameComplete && (
                            <span className="admin-incomplete-badge" title="성·이름이 없어 App Store Connect 사용자 초대와 등록 요청에 포함되지 않습니다">
                              이름 미입력 · 등록 불가 ({missingParts.join(", ")} 누락)
                            </span>
                          )}
                        </div>
                        <div className="admin-status-badge-wrap">
                          <span className={`status-pill status-${app.status}`}>
                            {statusLabel(app.status)}
                          </span>
                        </div>
                      </div>

                      <div className="admin-card-body">
                        <div className="admin-info-row">
                          <span className="admin-label">성 / 이름</span>
                          {nameComplete ? (
                            <span className="admin-applicant-name">
                              {app.lastName} / {app.firstName}
                            </span>
                          ) : (
                            <div className="admin-name-edit">
                              <input
                                type="text"
                                placeholder="성 (Last name)"
                                aria-label={`#${app.id} 성`}
                                value={draft.lastName}
                                maxLength={50}
                                disabled={isPending}
                                onChange={(e) => handleNameDraftChange(app.id, "lastName", e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="이름 (First name)"
                                aria-label={`#${app.id} 이름`}
                                value={draft.firstName}
                                maxLength={50}
                                disabled={isPending}
                                onChange={(e) => handleNameDraftChange(app.id, "firstName", e.target.value)}
                              />
                              <button
                                type="button"
                                className="button button-quiet"
                                disabled={isPending}
                                onClick={() => handleNameSave(app.id)}
                              >
                                이름 저장
                              </button>
                              <span className="admin-name-hint">
                                이름 칸이 없던 시기의 신청입니다. 신청자에게 직접 확인한 성·이름만 입력하세요. 이메일로 추측하지 않습니다.
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="admin-info-row">
                          <span className="admin-label">이메일</span>
                          <strong className="admin-email">
                            <a href={`mailto:${app.email}?subject=[TestFlight] ${app.appName} 테스터 초대`}>
                              {app.email}
                            </a>
                          </strong>
                        </div>

                        <div className="admin-info-row">
                          <span className="admin-label">테스트 기기</span>
                          <span className="admin-device">{app.device}</span>
                        </div>

                        <div className="admin-info-row admin-reason-row">
                          <span className="admin-label">참여 동기</span>
                          <p className="admin-reason">{app.reason}</p>
                        </div>
                      </div>

                      <div className="admin-card-footer">
                        <div className="admin-status-changer">
                          <label htmlFor={`status-select-${app.id}`}>상태 변경:</label>
                          <select
                            id={`status-select-${app.id}`}
                            value={app.status}
                            disabled={isPending}
                            onChange={(e) =>
                              handleStatusChange(app.id, e.target.value as TestFlightStatus)
                            }
                          >
                            <option value="pending">대기 중 (pending)</option>
                            <option value="selected">선정 (selected)</option>
                            <option value="invited">초대 완료 (invited)</option>
                            <option value="rejected">제외 (rejected)</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          className="button button-quiet admin-delete-btn"
                          disabled={isPending}
                          onClick={() => handleDelete(app.id, app.email, app.appName)}
                          title="D1 데이터베이스에서 영구 삭제"
                        >
                          삭제 🗑
                        </button>
                      </div>
                    </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Privacy & Retention Disclosure Box */}
            <section className="admin-privacy-notice-box" aria-label="개인정보 관리 원칙">
              <h3>개인정보 처리 및 보관·삭제 지침</h3>
              <ul>
                <li>
                  <strong>수집 목적:</strong> Apple TestFlight 내부 테스터 선발에만 사용합니다. 내부 테스터는 App Store Connect
                  사용자여야 하므로 선정자는 성·이름·이메일로 사용자 초대(Marketing 역할, 신청한 앱 하나만 접근, 보고서·인증서 등
                  추가 리소스 접근 없음)를 받은 뒤 해당 앱의 내부 TestFlight 그룹에 추가됩니다. 신청이 선정을 보장하지 않습니다.
                </li>
                <li>
                  <strong>Apple 전달 범위:</strong> 성·이름·이메일만 App Store Connect 사용자 초대에 사용하며 기기 모델과 참여 동기는
                  전달하지 않습니다. 성 또는 이름이 없는 기존 신청은 &lsquo;이름 미입력 · 등록 불가&rsquo;로 표시되고 등록 요청에서
                  제외되며, 신청자에게 확인한 이름을 관리자가 직접 채운 뒤에만 포함됩니다.
                </li>
                <li>
                  <strong>Codex 전달 범위:</strong> 내부 테스터 등록 작업 지원을 위해 등록 대상자의 성·이름·이메일과 희망 앱만 OpenAI
                  Codex 요청문에 포함합니다. 기기 모델과 참여 동기는 포함하지 않으며 이름이 없는 보류 신청자의 개인정보도 복사하지 않습니다.
                </li>
                <li>
                  <strong>보관 및 파기:</strong> 신청자 기록은 테스터 모집 및 테스트 기간 동안 D1 데이터베이스에 보관되며,
                  각 신청 건의 <strong>[삭제]</strong> 버튼을 통해 언제든 즉시 영구 파기할 수 있습니다.
                </li>
                <li>
                  <strong>안전 조치:</strong> 신청자의 IP 주소는 직접 저장하지 않고 SHA-256 해시로 변환하여 남용 방지(시간당 5회 제한)에만 활용합니다.
                </li>
                <li>
                  <strong>외부 발송:</strong> 본 시스템은 외부 이메일 자동 발송이나 Apple API 호출을 수행하지 않습니다. 선정된 테스터의
                  App Store Connect 사용자 초대와 내부 TestFlight 그룹 추가는 복사한 요청문을 바탕으로 별도로 진행합니다.
                </li>
              </ul>
            </section>
          </div>
          <SiteInsights embedded />
          </>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
