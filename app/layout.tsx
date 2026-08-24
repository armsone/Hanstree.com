import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VisitTracker } from "./components/VisitTracker";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nasfinder.com"),
  title: { default: "NasFinder.com — 일상 가까이, 꼭 필요한 앱", template: "%s · NasFinder.com" },
  description: "나스파인더로 iPhone Live Photo와 Android Motion Photo를 양방향 변환·전송하고, 직접 만드는 앱의 기능과 개발 과정을 소개합니다.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: { type: "website", locale: "ko_KR", siteName: "NasFinder.com", title: "NasFinder.com — 일상 가까이, 꼭 필요한 앱", description: "iPhone Live Photo와 Android Motion Photo를 양방향 변환·전송하는 나스파인더와 직접 만드는 앱을 소개합니다.", images: [{ url: "/og.png", width: 1024, height: 1024, alt: "Wi-Fi 신호와 NAS를 표현한 NasFinder.com 대표 이미지" }] },
  twitter: { card: "summary", title: "NasFinder.com — 일상 가까이, 꼭 필요한 앱", description: "iPhone Live Photo와 Android Motion Photo를 양방향 변환·전송하는 나스파인더와 직접 만드는 앱을 소개합니다.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body className={`${geistSans.variable} ${geistMono.variable}`}><VisitTracker />{children}</body></html>;
}
