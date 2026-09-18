import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VisitTracker } from "./components/VisitTracker";
import { getSiteBrand } from "./site-brand";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#f5f2eb",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getSiteBrand();
  const shareImage = brand.name === "NASFINDER" ? brand.icon : "/og-catalog-20260918.png";
  return {
  metadataBase: new URL(brand.canonical),
  title: { default: brand.title, template: `%s · ${brand.koreanName}` },
  description: brand.description,
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: brand.icon, sizes: "any" }],
    apple: [{ url: brand.appleIcon, type: "image/png" }],
  },
  openGraph: { type: "website", locale: "ko_KR", siteName: brand.koreanName, title: brand.title, description: brand.description, images: [{ url: shareImage, width: brand.name === "NASFINDER" ? 1024 : 1727, height: brand.name === "NASFINDER" ? 1024 : 910, alt: `${brand.koreanName}가 직접 만든 결과물` }] },
  twitter: { card: "summary_large_image", title: brand.title, description: brand.description, images: [shareImage] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><head><link rel="preconnect" href="https://hanstree.com" /></head><body className={`${geistSans.variable} ${geistMono.variable}`}><VisitTracker />{children}</body></html>;
}
