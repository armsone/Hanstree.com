import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VisitTracker } from "./components/VisitTracker";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hanstree.com"),
  title: { default: "Hanstree — 공간에서 시작해 제품으로 이어지는 생각", template: "%s · Hanstree" },
  description: "한스트리의 창작 공간 Han’s Tree와 나스파인더를 비롯해 직접 만든 디지털 제품을 소개합니다.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: { type: "website", locale: "ko_KR", siteName: "Hanstree", title: "Hanstree — 공간에서 시작해 제품으로 이어지는 생각", description: "창의성과 체력을 채우는 공간 Han’s Tree와 그곳에서 탄생한 디지털 제품을 소개합니다.", images: [{ url: "/og.png", width: 1731, height: 909, alt: "공간과 디지털 제품을 함께 만드는 Hanstree" }] },
  twitter: { card: "summary_large_image", title: "Hanstree — 공간에서 시작해 제품으로 이어지는 생각", description: "창의성과 체력을 채우는 공간과 그곳에서 탄생한 디지털 제품", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><head><link rel="preconnect" href="https://hanstree.com" /></head><body className={`${geistSans.variable} ${geistMono.variable}`}><VisitTracker />{children}</body></html>;
}
