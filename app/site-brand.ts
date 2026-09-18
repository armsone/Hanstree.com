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
  title: "Hanstree — 일상을 바꾸는 앱과 도구",
  description: "NAS 속 사진 보기, 가족 호출, 수면 기록, AI 사용량 확인까지. 일상의 작은 불편을 해결하는 한스트리의 앱과 도구를 골라 보세요.",
  canonical: "https://hanstree.com",
};

const NASFINDER: SiteBrand = {
  name: "NASFINDER",
  koreanName: "나스파인더",
  icon: "/apps/nasfinder/icon.png",
  // /apple-touch-icon.png은 Hanstree 심볼(검정 배경 잎 모양)이라 nasfinder.com에서는 NasFinder 앱 아이콘(정사각 PNG)을 그대로 씁니다.
  appleIcon: "/apps/nasfinder/icon.png",
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
