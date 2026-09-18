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

export async function getSiteBrand(): Promise<SiteBrand> {
  // Hanstree is the parent brand. NasFinder remains directly usable through
  // its product pages, downloads, and support routes without taking over the site chrome.
  return HANSTREE;
}
