"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function ClientDownloadQrCode({ href, label, className }: { href: string; label: string; className?: string }) {
  const [markup, setMarkup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void QRCode.toString(href, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      color: { dark: "#121216", light: "#f7f6f2" },
    }).then((nextMarkup) => {
      if (!cancelled) setMarkup(nextMarkup);
    });
    return () => { cancelled = true; };
  }, [href]);

  if (!markup) return null;
  return <aside className={`download-qr${className ? ` ${className}` : ""}`} aria-label={`${label} QR 코드`}><div role="img" aria-label={`${label} QR 코드`} dangerouslySetInnerHTML={{ __html: markup }} /><small>휴대전화에서 받기</small></aside>;
}
