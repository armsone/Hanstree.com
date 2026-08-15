"use client";

import { useState } from "react";

export function ContactReveal() {
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function reveal() {
    setVisible(true);
    setFailed(false);
    try {
      const response = await fetch("/api/support-contact", { method: "POST" });
      if (!response.ok) throw new Error("support contact unavailable");
      const data = await response.json() as { address?: string };
      if (!data.address) throw new Error("support contact unavailable");
      setAddress(data.address);
    } catch {
      setFailed(true);
    }
  }

  if (address) {
    return <a className="button button-ghost-light" href={`mailto:${address}`} aria-live="polite">{address}</a>;
  }

  if (visible && !failed) {
    return <button className="button button-ghost-light" type="button" disabled aria-live="polite">문의 주소 확인 중…</button>;
  }

  return <button className="button button-ghost-light" type="button" onClick={reveal}>{failed ? "다시 확인하기" : "직접 문의 보기"}</button>;
}
