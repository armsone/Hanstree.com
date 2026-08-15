import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nasfinder.com"),
  title: { default: "NasFinder.com — 일상 가까이, 꼭 필요한 앱", template: "%s · NasFinder.com" },
  description: "나스파인더, 한클립, S.tand와 CCMB의 기능, 개발 과정, 사용법과 다운로드를 소개합니다.",
  icons: { icon: "/apps/nasfinder/icon.png", apple: "/apps/nasfinder/icon.png" },
  openGraph: { type: "website", locale: "ko_KR", siteName: "NasFinder.com", title: "NasFinder.com — 일상 가까이, 꼭 필요한 앱", description: "armsone이 만드는 앱과 그 과정을 소개합니다.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "NasFinder.com — 일상 가까이, 꼭 필요한 앱" }] },
  twitter: { card: "summary_large_image", title: "NasFinder.com — 일상 가까이, 꼭 필요한 앱", description: "armsone이 만드는 앱과 그 과정을 소개합니다.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
