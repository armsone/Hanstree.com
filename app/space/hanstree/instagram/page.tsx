import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../../page";

const instagramProfile = "https://www.instagram.com/armsone/";

const fallbackPosts = [
  "Dcs5WxVj0YE", "DcsD7Ejj__l", "DcsAnADj623", "DcsAVQwjz-2",
  "DcqcKA8DxvC", "Dcpmqkrjx1E", "DcpYue9D2tR", "DcpWXZyD5Eh",
  "DcpR6pBD3-L", "DcoKKDkD1lf", "Dcm6d5MjwaM", "DckwWOyj5TE",
];

type InstagramPost = {
  id: string;
  permalink: string;
  caption?: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  timestamp?: string;
};

async function loadInstagramPosts() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!accessToken) return { posts: [] as InstagramPost[], live: false };

  try {
    const endpoint = new URL("https://graph.instagram.com/me/media");
    endpoint.searchParams.set("fields", "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp");
    endpoint.searchParams.set("limit", "12");

    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 900 },
    });
    if (!response.ok) return { posts: [] as InstagramPost[], live: false };

    const payload = await response.json() as { data?: InstagramPost[] };
    const posts = (payload.data ?? []).filter((post) => post.permalink && (post.media_url || post.thumbnail_url)).slice(0, 12);
    return { posts, live: posts.length > 0 };
  } catch {
    return { posts: [] as InstagramPost[], live: false };
  }
}

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

export default async function MeoktamjaInstagramPage() {
  const instagram = await loadInstagramPosts();

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
            {instagram.live ? <p className="instagram-live-status">공식 API로 최신 게시물을 자동 업데이트합니다.</p> : null}
          </div>
          <div className="instagram-embed-grid">
            {instagram.live ? instagram.posts.map((post, index) => (
              <article className="instagram-api-card" key={post.id}>
                <img src={post.thumbnail_url || post.media_url} alt={post.caption?.trim() || `먹탐자 Instagram 게시물 ${index + 1}`} loading="lazy" />
                <span className="instagram-api-card-copy">
                  <small>{post.timestamp ? new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(post.timestamp)) : "INSTAGRAM"}</small>
                  <strong>{post.caption?.trim() || "먹탐자의 새로운 기록"}</strong>
                </span>
                <a href={post.permalink} target="_blank" rel="noreferrer" aria-label={`먹탐자 Instagram 게시물 ${index + 1} 자세히 보기`} />
              </article>
            )) : fallbackPosts.map((shortcode, index) => {
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
