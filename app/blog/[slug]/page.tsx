import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteBrand } from "../../site-brand";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getD1 } from "../../../db";
import { ensureSeedPost } from "../seed";
import { BlogMarkdown } from "../BlogMarkdown";
import "../blog.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

type PostDetail = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
};

async function getPost(slug: string): Promise<PostDetail | null> {
  try {
    await ensureSeedPost();
    const row = await getD1()
      .prepare(
        `SELECT id, slug, title, category, summary, body, cover_image_url AS coverImageUrl,
                published_at AS publishedAt, created_at AS createdAt
         FROM blog_posts
         WHERE slug = ? AND status = 'published' AND is_trashed = 0`
      )
      .bind(slug)
      .first<PostDetail>();
    return row ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { slug } = await props.params;
  const brand = await getSiteBrand();
  const post = await getPost(slug);

  if (!post) {
    return {
      title: `글을 찾을 수 없습니다 — ${brand.koreanName}`,
    };
  }

  const postUrl = `${brand.canonical}/blog/${post.slug}`;
  const ogImages = post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined;

  return {
    title: `${post.title} — ${brand.koreanName}`,
    description: post.summary,
    alternates: { canonical: postUrl },
    openGraph: {
      title: `${post.title} — ${brand.koreanName}`,
      description: post.summary,
      url: postUrl,
      siteName: brand.koreanName,
      locale: "ko_KR",
      type: "article",
      publishedTime: post.publishedAt || undefined,
      images: ogImages,
    },
    twitter: {
      card: post.coverImageUrl ? "summary_large_image" : "summary",
      title: `${post.title} — ${brand.koreanName}`,
      description: post.summary,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostDetailPage(props: { params: Params }) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="blog-page-wrapper">
      <SiteHeader />

      <main className="blog-main">
        <article className="blog-article-shell">
          <nav className="blog-breadcrumb" aria-label="브레드크럼">
            <Link href="/">홈</Link>
            <span className="blog-breadcrumb-sep">/</span>
            <Link href="/blog">블로그</Link>
            <span className="blog-breadcrumb-sep">/</span>
            <span>{post.category}</span>
          </nav>

          <header className="blog-detail-header">
            <p className="blog-eyebrow">{post.category}</p>
            <h1 className="blog-detail-title">{post.title}</h1>

            <div className="blog-detail-meta">
              <span className="blog-badge">{post.category}</span>
              {post.publishedAt ? (
                <time dateTime={post.publishedAt.slice(0, 10)}>
                  발행일: {post.publishedAt.slice(0, 10)}
                </time>
              ) : null}
              <span>작성자: armsone</span>
            </div>
          </header>

          {post.coverImageUrl ? (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="blog-detail-cover"
              loading="eager"
            />
          ) : null}

          <BlogMarkdown content={post.body} />

          <footer className="blog-detail-footer">
            <Link href="/blog" className="blog-pagination-btn">
              ← 블로그 목록으로 돌아가기
            </Link>
            <Link href="/" className="blog-breadcrumb-sep">
              Hanstree 홈
            </Link>
          </footer>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
