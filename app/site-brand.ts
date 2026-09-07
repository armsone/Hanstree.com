import { headers } from "next/headers";

export type SiteBrand = {
  name: string;
  koreanName: string;
  icon: string;
  appleIcon: string;
  title: string;
  description: string;
  canonical: string;
};

const HANSTREE: SiteBrand = {
  name: "HANSTREE",
  koreanName: "한스트리",
  icon: "/hanstree/studio-symbol-dark.jpeg",
  appleIcon: "/apple-touch-icon-hanstree.png?v=20260904",
  title: "Hanstree — 직접 만든 결과물의 인덱스",
  description: "나스파인더를 비롯한 디지털 제품과 창작 공간 Hanstree Studio까지, 직접 필요하고 좋아해서 만들고 오래 다듬은 결과물을 소개합니다.",
  canonical: "https://hanstree.com",
};

const NASFINDER: SiteBrand = {
  name: "NASFINDER",
  koreanName: "나스파인더",
  icon: "/apps/nasfinder/icon.png",
  appleIcon: "/apple-touch-icon.png",
  title: "NasFinder — 내 저장공간을, 모든 기기에서",
  description: "NAS·클라우드·네트워크 장비와 기기 안의 파일을 한곳에서 보고 재생하는 NasFinder를 소개합니다.",
  canonical: "https://nasfinder.com",
};

export async function getSiteBrand(): Promise<SiteBrand> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host")
    ?? requestHeaders.get("x-original-host")
    ?? requestHeaders.get("cf-connecting-host");
  const host = (forwardedHost ?? requestHeaders.get("host"))?.split(",", 1)[0].trim().split(":", 1)[0].toLowerCase();
  return host === "nasfinder.com" || host?.endsWith(".nasfinder.com") ? NASFINDER : HANSTREE;
}
