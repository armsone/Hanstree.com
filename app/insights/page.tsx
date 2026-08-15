import { SiteFooter, SiteHeader } from "../page";
import { SiteInsights } from "../components/SiteInsights";

export const metadata = {
  title: "사이트 기록 | NasFinder.com",
  description: "날짜별 홈페이지 방문과 Android APK 버튼 사용 기록을 그래프와 표로 확인합니다.",
};

export default function InsightsPage() {
  return <><SiteHeader /><SiteInsights /><SiteFooter /></>;
}
