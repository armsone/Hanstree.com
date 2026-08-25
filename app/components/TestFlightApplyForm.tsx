"use client";

import { useEffect, useState } from "react";
import { testFlightBuilds } from "../testflight";

export function TestFlightApplyForm() {
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [appSlug, setAppSlug] = useState(testFlightBuilds[0]?.slug || "nasfinder");
  const [device, setDevice] = useState("");
  const [reason, setReason] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [hpWebsite, setHpWebsite] = useState(""); // Honeypot field
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const requestedApp = new URLSearchParams(window.location.search).get("testflightApp");
    if (requestedApp && testFlightBuilds.some((build) => build.slug === requestedApp)) {
      // The selected app comes from the site's fixed TestFlight inventory.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppSlug(requestedApp);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!lastName.trim()) {
      setStatusMessage({ type: "error", text: "성(Last name)을 입력해 주세요." });
      return;
    }

    if (!firstName.trim()) {
      setStatusMessage({ type: "error", text: "이름(First name)을 입력해 주세요." });
      return;
    }

    if (!email.trim()) {
      setStatusMessage({ type: "error", text: "이메일 주소를 입력해 주세요." });
      return;
    }

    if (!appSlug) {
      setStatusMessage({ type: "error", text: "신청할 앱을 선택해 주세요." });
      return;
    }

    if (!device.trim()) {
      setStatusMessage({
        type: "error",
        text: "사용하실 기기 모델명을 입력해 주세요. (예: iPhone 16 Pro, iPad Pro)",
      });
      return;
    }

    if (!reason.trim()) {
      setStatusMessage({ type: "error", text: "참여 동기를 간단히 입력해 주세요." });
      return;
    }

    if (!privacyConsent) {
      setStatusMessage({
        type: "error",
        text: "개인정보 수집 및 이용에 동의해 주셔야 신청하실 수 있습니다.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/testflight-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          lastName: lastName.trim(),
          firstName: firstName.trim(),
          appSlug,
          device: device.trim(),
          reason: reason.trim(),
          privacyConsent,
          hp_website: hpWebsite,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage({
          type: "error",
          text: data.error || "신청 접수 중 오류가 발생했습니다. 다시 시도해 주세요.",
        });
        return;
      }

      setStatusMessage({
        type: "success",
        text: data.message || "TestFlight 사전 신청이 정상 접수되었습니다.",
      });

      // Clear form on success
      setEmail("");
      setLastName("");
      setFirstName("");
      setDevice("");
      setReason("");
      setPrivacyConsent(false);
    } catch {
      setStatusMessage({
        type: "error",
        text: "네트워크 연결 또는 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="testflight-apply-box" id="testflight-apply" aria-labelledby="tf-apply-title">
      <div className="tf-apply-header">
        <div>
          <p className="eyebrow">TESTFLIGHT APPLICATION</p>
          <h3 id="tf-apply-title">내부 테스터 사전 신청</h3>
        </div>
        <p className="tf-apply-desc">
          출시 전 새로운 버전을 가장 먼저 써보고 소중한 의견을 나눠주실 분을 모십니다. 내부 테스트는 선택한 앱에만 접근하는
          App Store Connect 사용자로 초대된 분만 참여할 수 있어 성·이름·이메일이 필요합니다.
        </p>
      </div>

      <form className="tf-apply-form" onSubmit={handleSubmit} noValidate>
        {/* Honeypot field for anti-bot protection */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="tf-hp-website">Website (Leave blank)</label>
          <input
            id="tf-hp-website"
            type="text"
            name="hp_website"
            value={hpWebsite}
            onChange={(e) => setHpWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="tf-form-grid">
          <div className="tf-form-group">
            <label htmlFor="tf-app">
              체험 희망 앱 <span className="tf-req" aria-hidden="true">*</span>
            </label>
            <select
              id="tf-app"
              value={appSlug}
              onChange={(e) => setAppSlug(e.target.value)}
              disabled={loading}
              required
            >
              {testFlightBuilds.map((build) => (
                <option key={build.slug} value={build.slug}>
                  {build.appName}
                </option>
              ))}
            </select>
            <span className="tf-field-hint">현재 TestFlight 빌드가 제공되는 앱 목록입니다.</span>
          </div>

          <div className="tf-form-group">
            <label htmlFor="tf-email">
              이메일 주소 <span className="tf-req" aria-hidden="true">*</span>
            </label>
            <input
              id="tf-email"
              type="email"
              placeholder="appleid@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
            />
            <span className="tf-field-hint">App Store Connect 사용자 초대를 받을 이메일을 적어주세요.</span>
          </div>

          <div className="tf-form-group">
            <label htmlFor="tf-last-name">
              성 (Last name) <span className="tf-req" aria-hidden="true">*</span>
            </label>
            <input
              id="tf-last-name"
              type="text"
              placeholder="예: 홍"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              autoComplete="family-name"
              maxLength={50}
              required
            />
            <span className="tf-field-hint">App Store Connect 사용자 등록에 필요한 성입니다.</span>
          </div>

          <div className="tf-form-group">
            <label htmlFor="tf-first-name">
              이름 (First name) <span className="tf-req" aria-hidden="true">*</span>
            </label>
            <input
              id="tf-first-name"
              type="text"
              placeholder="예: 길동"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              autoComplete="given-name"
              maxLength={50}
              required
            />
            <span className="tf-field-hint">App Store Connect 사용자 초대에 사용할 이름입니다.</span>
          </div>

          <div className="tf-form-group tf-form-full">
            <label htmlFor="tf-device">
              사용 기기 모델 <span className="tf-req" aria-hidden="true">*</span>
            </label>
            <input
              id="tf-device"
              type="text"
              placeholder="예: iPhone 16 Pro, iPad Air M2, Mac Studio"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              disabled={loading}
              maxLength={100}
              required
            />
            <span className="tf-field-hint">앱을 주로 테스트하실 기기 종류와 모델명을 적어주세요.</span>
          </div>

          <div className="tf-form-group tf-form-full">
            <label htmlFor="tf-reason">
              참여 동기 및 사용 환경 <span className="tf-req" aria-hidden="true">*</span>
            </label>
            <textarea
              id="tf-reason"
              rows={3}
              placeholder="앱에 관심을 갖게 된 계기나 주로 활용할 환경을 간단히 적어주세요."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              maxLength={500}
              required
            />
            <span className="tf-field-hint">최대 500자까지 작성할 수 있습니다.</span>
          </div>
        </div>

        {/* Notice before submit */}
        <div className="tf-notice-box" role="note">
          <strong>안내사항</strong>
          <p>
            테스트 인원은 소수로 한정되어 있어 <strong>신청이 선정이나 참여를 보장하지 않습니다.</strong>{" "}
            Apple의 내부 테스트는 App Store Connect 사용자만 참여할 수 있으므로, 선정된 분은 입력하신 성·이름·이메일로{" "}
            <strong>선택한 앱 하나에만 접근하는 제한된 App Store Connect 사용자</strong>(Marketing 역할, 보고서·인증서 등 추가 접근 없음)로
            초대된 뒤 해당 앱의 내부 TestFlight 그룹에 추가됩니다.
          </p>
        </div>

        {/* Explicit Privacy Consent */}
        <div className="tf-privacy-consent">
          <label className="tf-checkbox-label">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              disabled={loading}
              required
            />
            <span>
              [필수] TestFlight 신청을 위한 개인정보 수집 및 이용에 동의합니다.
            </span>
          </label>
          <button
            type="button"
            className="tf-privacy-toggle"
            onClick={() => setShowPrivacyDetail(!showPrivacyDetail)}
            aria-expanded={showPrivacyDetail}
          >
            {showPrivacyDetail ? "내용 닫기 ▲" : "수집 내용 보기 ▼"}
          </button>
        </div>

        {showPrivacyDetail && (
          <div className="tf-privacy-details" role="region" aria-label="개인정보 수집 상세">
            <dl>
              <div>
                <dt>수집 목적</dt>
                <dd>Apple TestFlight 내부 테스터 선발, 선정 시 App Store Connect 사용자 초대(선택한 앱만 접근) 및 내부 TestFlight 그룹 등록</dd>
              </div>
              <div>
                <dt>수집 항목</dt>
                <dd>성(Last name), 이름(First name), 이메일, 희망 앱, 사용 기기 모델, 참여 동기</dd>
              </div>
              <div>
                <dt>Apple 전달 범위</dt>
                <dd>선정된 분의 성·이름·이메일만 App Store Connect 사용자 초대에 사용하며, 기기 모델과 참여 동기는 Apple에 전달하지 않습니다.</dd>
              </div>
              <div>
                <dt>등록 작업 지원</dt>
                <dd>내부 테스터 등록 작업을 돕기 위해 등록 대상자의 성·이름·이메일과 희망 앱만 OpenAI Codex에 전달할 수 있습니다. 기기 모델과 참여 동기는 전달하지 않습니다.</dd>
              </div>
              <div>
                <dt>보유 및 파기</dt>
                <dd>
                  테스터 모집 및 테스트 기간 동안 보관하며, 관리자 화면을 통해 언제든 직접 파기할 수 있습니다.
                </dd>
              </div>
              <div>
                <dt>동의 거부 권리</dt>
                <dd>동의를 거부할 수 있으나 미동의 시 TestFlight 사전 신청이 불가합니다.</dd>
              </div>
            </dl>
          </div>
        )}

        {statusMessage && (
          <div
            className={`tf-feedback-banner ${statusMessage.type === "success" ? "tf-feedback-success" : "tf-feedback-error"}`}
            role="alert"
          >
            {statusMessage.type === "success" ? "✓ " : "✕ "}
            {statusMessage.text}
          </div>
        )}

        <div className="tf-submit-row">
          <button
            type="submit"
            className="button button-light tf-submit-button"
            disabled={loading}
          >
            {loading ? "신청 접수 중..." : "내부 테스터 신청하기 →"}
          </button>
        </div>
      </form>
    </section>
  );
}
