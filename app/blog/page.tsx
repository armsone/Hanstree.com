import type { Metadata } from "next";
import Link from "next/link";
import { getSiteBrand } from "../site-brand";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { getD1 } from "../../db";
import { ensureSeedPost } from "./seed";
import "./blog.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getSiteBrand();
  return {
    title: `블로그 — ${brand.koreanName}`,
    description: "직접 개발하고 운영하며 얻은 기술 지식, 문제 해결 과정, 일상의 기록을 나눕니다.",
    alternates: { canonical: `${brand.canonical}/blog` },
    openGraph: {
      title: `블로그 — ${brand.koreanName}`,
      description: "기술 지식, 문제 해결 과정, 일상의 기록을 나눕니다.",
      url: `${brand.canonical}/blog`,
      siteName: brand.koreanName,
      locale: "ko_KR",
      type: "website",
    },
  };
}

const PAGE_SIZE = 9;

type SearchParams = Promise<{
  page?: string;
  category?: string;
  q?: string;
}>;

type PostRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
};

export default async function BlogIndexPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const selectedCategory = searchParams.category?.trim() || "";
  const query = searchParams.q?.trim() || "";

  let posts: PostRow[] = [];
  let totalCount = 0;
  let categories: string[] = [];
  let hasDbError = false;

  try {
    await ensureSeedPost();
    const d1 = getD1();

    // Fetch distinct categories of published posts
    const catRows = await d1
      .prepare(
        "SELECT DISTINCT category FROM blog_posts WHERE status = 'published' AND is_trashed = 0 ORDER BY category ASC"
      )
      .all<{ category: string }>();
    categories = (catRows.results ?? []).map((r) => r.category);

    // Build parameterized query for total count and posts
    let countSql = "SELECT COUNT(*) AS count FROM blog_posts WHERE status = 'published' AND is_trashed = 0";
    let listSql = "SELECT id, slug, title, category, summary, cover_image_url AS coverImageUrl, published_at AS publishedAt FROM blog_posts WHERE status = 'published' AND is_trashed = 0";
    const binds: unknown[] = [];

    if (selectedCategory) {
      countSql += " AND category = ?";
      listSql += " AND category = ?";
      binds.push(selectedCategory);
    }

    if (query) {
      const searchPattern = `%${query}%`;
      countSql += " AND (title LIKE ? OR summary LIKE ? OR category LIKE ? OR body LIKE ?)";
      listSql += " AND (title LIKE ? OR summary LIKE ? OR category LIKE ? OR body LIKE ?)";
      binds.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    listSql += " ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?";
    const offset = (currentPage - 1) * PAGE_SIZE;

    const countRes = await d1
      .prepare(countSql)
      .bind(...binds)
      .first<{ count: number }>();
    totalCount = countRes?.count ?? 0;

    const listRes = await d1
      .prepare(listSql)
      .bind(...binds, PAGE_SIZE, offset)
      .all<PostRow>();
    posts = listRes.results ?? [];
  } catch {
    posts = [];
    totalCount = 0;
    hasDbError = true;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function buildUrl(newPage: number, newCat = selectedCategory, newQ = query) {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", String(newPage));
    if (newCat) params.set("category", newCat);
    if (newQ) params.set("q", newQ);
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="blog-page-wrapper">
      <SiteHeader />

      <main className="blog-main">
        <div className="blog-shell">
          <nav className="blog-breadcrumb" aria-label="브레드크럼">
            <Link href="/">홈</Link>
            <span className="blog-breadcrumb-sep">/</span>
            <span>블로그</span>
          </nav>

          <header className="blog-header">
            <p className="blog-eyebrow">HANSTREE BLOG &amp; TECH NOTES</p>
            <h1 className="blog-title">이야기와 기술 기록</h1>
            <p className="blog-subtitle">
              직접 개발하고 마주한 기술 문제의 원인 분석, 해결 과정, 일상의 유용한 정보글을 남깁니다.
            </p>
          </header>

          <section className="blog-controls-card" aria-label="글 검색 및 분류">
            <form className="blog-search-form" method="GET" action="/blog">
              {selectedCategory && (
                <input type="hidden" name="category" value={selectedCategory} />
              )}
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="제목, 요약 또는 내용으로 검색..."
                className="blog-search-input"
                aria-label="블로그 글 검색"
              />
              <button type="submit" className="blog-search-btn">
                검색
              </button>
            </form>

            <div className="blog-category-list" role="navigation" aria-label="분류 선택">
              <Link
                href={buildUrl(1, "", query)}
                className={`blog-category-pill ${!selectedCategory ? "blog-category-pill-active" : ""}`}
              >
                전체
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={buildUrl(1, cat, query)}
                  className={`blog-category-pill ${selectedCategory === cat ? "blog-category-pill-active" : ""}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>

          {hasDbError ? (
            <div className="blog-empty-state">
              <div className="blog-empty-icon" aria-hidden="true">
                ⚠️
              </div>
              <h2 className="blog-empty-title">글 목록을 불러올 수 없습니다</h2>
              <p className="blog-empty-desc">
                일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="blog-empty-state">
              <div className="blog-empty-icon" aria-hidden="true">
                📭
              </div>
              <h2 className="blog-empty-title">
                {query
                  ? `“${query}”에 대한 검색 결과가 없습니다`
                  : selectedCategory
                  ? `“${selectedCategory}” 분류에 등록된 글이 없습니다`
                  : "등록된 글이 없습니다"}
              </h2>
              <p className="blog-empty-desc">
                {query || selectedCategory
                  ? "검색어나 필터를 초기화하여 모든 글을 확인해 보세요."
                  : "새로운 글이 곧 업데이트될 예정입니다."}
              </p>
              {(query || selectedCategory) && (
                <Link href="/blog" className="blog-category-pill blog-category-pill-active">
                  모든 글 보기
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="blog-posts-grid">
                {posts.map((post) => (
                  <article key={post.slug} className="blog-card">
                    <Link href={`/blog/${post.slug}`} className="blog-card-link">
                      {post.coverImageUrl ? (
                        <div className="blog-card-thumb-wrap">
                          <img
                            src={post.coverImageUrl}
                            alt=""
                            className="blog-card-thumb"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      <div className="blog-card-content">
                        <div className="blog-card-meta">
                          <span className="blog-badge">{post.category}</span>
                          {post.publishedAt ? (
                            <time dateTime={post.publishedAt.slice(0, 10)}>
                              {post.publishedAt.slice(0, 10)}
                            </time>
                          ) : null}
                        </div>
                        <h2 className="blog-card-title">{post.title}</h2>
                        <p className="blog-card-summary">{post.summary}</p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="blog-pagination" aria-label="페이지 이동">
                  <Link
                    href={buildUrl(currentPage - 1)}
                    className={`blog-pagination-btn ${currentPage <= 1 ? "blog-pagination-disabled" : ""}`}
                    aria-disabled={currentPage <= 1}
                  >
                    ← 이전
                  </Link>
                  <span className="blog-pagination-info">
                    {currentPage} / {totalPages}
                  </span>
                  <Link
                    href={buildUrl(currentPage + 1)}
                    className={`blog-pagination-btn ${currentPage >= totalPages ? "blog-pagination-disabled" : ""}`}
                    aria-disabled={currentPage >= totalPages}
                  >
                    다음 →
                  </Link>
                </nav>
              )}
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
