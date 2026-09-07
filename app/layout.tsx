import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VisitTracker } from "./components/VisitTracker";
import { getSiteBrand } from "./site-brand";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getSiteBrand();
  return {
  metadataBase: new URL(brand.canonical),
  title: { default: brand.title, template: `%s · ${brand.koreanName}` },
  description: brand.description,
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: brand.icon, sizes: "any" }],
    apple: [{ url: brand.appleIcon, sizes: "180x180", type: "image/png" }],
  },
  openGraph: { type: "website", locale: "ko_KR", siteName: brand.koreanName, title: brand.title, description: brand.description, images: [{ url: "/og.png", width: 1731, height: 909, alt: `${brand.koreanName}가 직접 만든 결과물` }] },
  twitter: { card: "summary_large_image", title: brand.title, description: brand.description, images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><head><link rel="preconnect" href="https://hanstree.com" /></head><body className={`${geistSans.variable} ${geistMono.variable}`}><VisitTracker />{children}</body></html>;
}
