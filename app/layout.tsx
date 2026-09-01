import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VisitTracker } from "./components/VisitTracker";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hanstree.com"),
  title: { default: "Hanstree — 직접 만든 결과물의 인덱스", template: "%s · Hanstree" },
  description: "나스파인더를 비롯한 디지털 제품과 창작 공간 Hanstree Studio까지, 직접 필요하고 좋아해서 만들고 오래 다듬은 결과물을 소개합니다.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: { type: "website", locale: "ko_KR", siteName: "Hanstree", title: "Hanstree — 직접 만든 결과물의 인덱스", description: "앱과 디지털 제품, 창작 공간까지 직접 만들고 오래 다듬은 결과물을 소개합니다.", images: [{ url: "/og.png", width: 1731, height: 909, alt: "Hanstree가 직접 만든 결과물" }] },
  twitter: { card: "summary_large_image", title: "Hanstree — 직접 만든 결과물의 인덱스", description: "앱과 디지털 제품, 창작 공간까지 직접 만들고 오래 다듬은 결과물", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><head><link rel="preconnect" href="https://hanstree.com" /></head><body className={`${geistSans.variable} ${geistMono.variable}`}><VisitTracker />{children}</body></html>;
}
