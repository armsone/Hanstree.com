import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../../page";

const instagramProfile = "https://www.instagram.com/armsone/";

const posts = [
  "Dcs5WxVj0YE", "DcsD7Ejj__l", "DcsAnADj623", "DcsAVQwjz-2",
  "DcqcKA8DxvC", "Dcpmqkrjx1E", "DcpYue9D2tR", "DcpWXZyD5Eh",
  "DcpR6pBD3-L", "DcoKKDkD1lf", "Dcm6d5MjwaM", "DckwWOyj5TE",
];

export const metadata: Metadata = {
  title: "먹탐자 — Instagram",
  description: "먹기를 탐하는 자, 먹탐자의 음식과 일상 기록을 한곳에서 봅니다.",
  alternates: { canonical: "https://hanstree.com/space/hanstree/instagram" },
  openGraph: {
    title: "먹탐자 — Instagram",
    description: "먹기를 탐하는 자, 먹탐자의 음식과 일상 기록.",
    url: "https://hanstree.com/space/hanstree/instagram",
    images: [{ url: "/instagram/meoktamja-hero.jpeg", width: 960, height: 638, alt: "먹탐자 대표 이미지" }],
  },
};

export default function MeoktamjaInstagramPage() {
  return (
    <main className="hanstree-space-page instagram-work-page">
      <SiteHeader />

      <section className="instagram-work-hero shell">
        <div className="instagram-work-copy reveal">
          <Link className="breadcrumb" href="/space/hanstree">← 한스트리 스튜디오</Link>
          <p className="eyebrow">WORK 21 · INSTAGRAM</p>
          <h1>먹탐자</h1>
          <p className="instagram-work-english">Instagram · @armsone</p>
          <p>먹기를 탐하는 자. 음식과 사람, 그날의 마음을 한 장의 기록으로 남깁니다. 오래전 예수님을 두고 쓰였던 별명에서 가져온 이름이기도 합니다.</p>
          <a className="button button-primary" href={instagramProfile} target="_blank" rel="noreferrer">Instagram에서 최신 게시물 보기 <span aria-hidden="true">↗</span></a>
        </div>
        <div className="instagram-work-visual reveal">
          <Image src="/instagram/meoktamja-hero.jpeg" alt="먹기를 탐하는 자, 먹탐자 대표 이미지" width={960} height={638} priority sizes="(max-width: 920px) 100vw, 56vw" />
        </div>
      </section>

      <section className="instagram-feed-section">
        <div className="shell">
          <div className="space-section-heading">
            <p className="eyebrow">FROM @ARMSONE</p>
            <h2>먹고, 만나고,<br />기억한 순간들.</h2>
            <p>공개된 Instagram 게시물을 이곳에서 바로 보고, 자세히 보고 싶은 사진을 누르면 Instagram 원본으로 이동합니다.</p>
          </div>
          <div className="instagram-embed-grid">
            {posts.map((shortcode, index) => {
              const permalink = `https://www.instagram.com/p/${shortcode}/`;
              return (
                <article className="instagram-embed-card" key={shortcode}>
                  <iframe src={`${permalink}embed/captioned/`} title={`먹탐자 Instagram 게시물 ${index + 1}`} loading="lazy" />
                  <a href={permalink} target="_blank" rel="noreferrer" aria-label={`먹탐자 Instagram 게시물 ${index + 1} 자세히 보기`} />
                </article>
              );
            })}
          </div>
          <div className="instagram-feed-action"><a className="button button-primary" href={instagramProfile} target="_blank" rel="noreferrer">@armsone에서 더 보기 <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
