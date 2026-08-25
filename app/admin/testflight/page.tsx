"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SiteFooter, SiteHeader } from "../../page";
import { SiteInsights } from "../../components/SiteInsights";

export default function SiteRecordsAdminPage() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState("armsone");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/testflight/login", { cache: "no-store" });
      const data = await response.json();
      setConfigured(Boolean(data.configured));
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setConfigured(false);
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSetupToken(new URLSearchParams(window.location.search).get("setup") ?? "");
    void readAuth();
  }, [readAuth]);

  const submit = async (body: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/testflight/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "로그인할 수 없습니다.");
        return false;
      }
      setAuthenticated(true);
      setPassword("");
      return true;
    } catch {
      setError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해 주세요.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setError("두 비밀번호가 다릅니다. 다시 입력해 주세요.");
      return;
    }
    if (await submit({ action: "setup", password, setupToken })) {
      window.history.replaceState(null, "", "/admin/testflight");
      setConfigured(true);
      setPasswordConfirm("");
      setSetupToken("");
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    await submit({ userId: userId.trim(), password });
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
      setPassword("");
    }
  };

  return (
    <main className="admin-page">
      <SiteHeader />
      <div className="shell admin-shell">
        {authenticated === null ? (
          <div className="admin-loading-card"><p>관리자 환경을 확인하고 있습니다...</p></div>
        ) : authenticated === false ? (
          <div className="admin-login-wrapper">
            <div className="admin-login-card">
              <div className="admin-login-head">
                <p className="eyebrow">SITE RECORDS ADMIN</p>
                <h1>사이트 기록 관리자</h1>
                <p className="admin-login-sub">관리자만 유입 경로까지 확인할 수 있습니다.</p>
              </div>
              {configured === false ? (
                setupToken ? (
                  <form className="admin-login-form" onSubmit={handleSetup}>
                    <div className="admin-form-group"><label htmlFor="new-admin-password">새 비밀번호</label><input id="new-admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /></div>
                    <div className="admin-form-group"><label htmlFor="new-admin-password-confirm">비밀번호 다시 입력</label><input id="new-admin-password-confirm" type="password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} autoComplete="new-password" required /></div>
                    {error ? <div className="admin-error-banner" role="alert">{error}</div> : null}
                    <button type="submit" className="button button-primary admin-login-btn" disabled={loading}>{loading ? "저장 중..." : "비밀번호 저장하고 들어가기 →"}</button>
                  </form>
                ) : <div className="admin-locked-banner" role="alert"><strong>관리자 비밀번호 설정이 필요합니다</strong><p>안전한 최초 설정 링크로 이 페이지를 다시 열어 주세요.</p></div>
              ) : (
                <form className="admin-login-form" onSubmit={handleLogin}>
                  <div className="admin-form-group"><label htmlFor="admin-id">관리자 아이디</label><input id="admin-id" type="text" value={userId} onChange={(event) => setUserId(event.target.value)} autoComplete="username" required /></div>
                  <div className="admin-form-group"><label htmlFor="admin-password">비밀번호</label><input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></div>
                  {error ? <div className="admin-error-banner" role="alert">{error}</div> : null}
                  <button type="submit" className="button button-primary admin-login-btn" disabled={loading}>{loading ? "인증 확인 중..." : "관리자 로그인 →"}</button>
                </form>
              )}
              <div className="admin-login-footer"><Link href="/">← NasFinder.com 홈으로</Link></div>
            </div>
          </div>
        ) : (
          <div className="admin-dashboard">
            <header className="admin-dash-header">
              <div><p className="eyebrow">SITE RECORDS ADMIN</p><h1>사이트 기록</h1><p className="admin-ident">관리자 화면에서는 유입 경로까지 표시합니다.</p></div>
              <button type="button" className="button button-primary admin-logout-btn" onClick={handleLogout}>로그아웃</button>
            </header>
            <SiteInsights embedded showSources />
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
