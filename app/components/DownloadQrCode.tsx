import QRCode from "qrcode";

export async function DownloadQrCode({ href, label }: { href: string; label: string }) {
  const markup = await QRCode.toString(href, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#121216", light: "#f7f6f2" },
  });

  return (
    <aside className="download-qr" aria-label={`${label} QR 코드`}>
      <div role="img" aria-label={`${label} QR 코드`} dangerouslySetInnerHTML={{ __html: markup }} />
      <small>휴대전화에서 받기</small>
    </aside>
  );
}
