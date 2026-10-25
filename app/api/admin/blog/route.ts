import { isTrustedSameSiteEvent } from "../../../requestTraffic";
import { isRequestAuthenticated } from "../../../testflight-auth";
import { getD1 } from "../../../../db";
import { ensureSeedPost } from "../../../blog/seed";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

export async function GET(request: Request) {
  try {
    if (!(await isRequestAuthenticated(request))) {
      return new Response(JSON.stringify({ error: "인증이 필요합니다." }), {
        status: 401,
        headers: NO_STORE_HEADERS,
      });
    }

    await ensureSeedPost();
    const d1 = getD1();
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter") || "all"; // all | published | draft | trash
    const search = url.searchParams.get("q")?.trim() || "";

    let sql = `
      SELECT id, slug, title, category, summary, cover_image_url AS coverImageUrl,
             status, is_trashed AS isTrashed, published_at AS publishedAt,
             created_at AS createdAt, updated_at AS updatedAt
      FROM blog_posts
      WHERE 1=1
    `;
    const binds: unknown[] = [];

    if (filter === "trash") {
      sql += " AND is_trashed = 1";
    } else {
      sql += " AND is_trashed = 0";
      if (filter === "published") {
        sql += " AND status = 'published'";
      } else if (filter === "draft") {
        sql += " AND status = 'draft'";
      }
    }

    if (search) {
      const pattern = `%${search}%`;
      sql += " AND (title LIKE ? OR slug LIKE ? OR category LIKE ? OR summary LIKE ?)";
      binds.push(pattern, pattern, pattern, pattern);
    }

    sql += " ORDER BY updated_at DESC, id DESC";

    const result = await d1.prepare(sql).bind(...binds).all();
    return new Response(JSON.stringify({ ok: true, posts: result.results ?? [] }), {
      status: 200,
      headers: NO_STORE_HEADERS,
    });
  } catch {
    return new Response(JSON.stringify({ error: "글 목록을 불러올 수 없습니다." }), {
      status: 500,
      headers: NO_STORE_HEADERS,
    });
  }
}

export async function POST(request: Request) {
  try {
    if (!isTrustedSameSiteEvent(request)) {
      return new Response(JSON.stringify({ error: "허용되지 않은 출처의 요청입니다." }), {
        status: 403,
        headers: NO_STORE_HEADERS,
      });
    }

    if (!(await isRequestAuthenticated(request))) {
      return new Response(JSON.stringify({ error: "인증이 필요합니다." }), {
        status: 401,
        headers: NO_STORE_HEADERS,
      });
    }

    let body: {
      title?: unknown;
      slug?: unknown;
      category?: unknown;
      summary?: unknown;
      body?: unknown;
      coverImageUrl?: unknown;
      status?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "잘못된 JSON 형식입니다." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const rawSlug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : "일반";
    const summary = typeof body.summary === "string" ? body.summary.trim() : "";
    const postBody = typeof body.body === "string" ? body.body : "";
    const coverImageUrl = typeof body.coverImageUrl === "string" && body.coverImageUrl.trim() ? body.coverImageUrl.trim() : null;
    const status = body.status === "published" ? "published" : "draft";

    if (!title || title.length > 200) {
      return new Response(JSON.stringify({ error: "제목은 1자 이상 200자 이하로 입력해 주세요." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    // Slug validation: letters, numbers, hyphens, and korean/unicode letters
    const slug = rawSlug || title.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9가-힣-_]/g, "").slice(0, 100);
    if (!slug || slug.length > 120 || !/^[a-zA-Z0-9가-힣-_]+$/.test(slug)) {
      return new Response(JSON.stringify({ error: "올바른 슬러그(문자, 숫자, 하이픈)를 입력해 주세요." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    if (summary.length > 500) {
      return new Response(JSON.stringify({ error: "요약은 500자 이하로 입력해 주세요." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    if (postBody.length > 200000) {
      return new Response(JSON.stringify({ error: "본문 크기가 너무 큽니다 (최대 200KB)." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    await ensureSeedPost();
    const d1 = getD1();

    // Check slug collision
    const existing = await d1
      .prepare("SELECT id FROM blog_posts WHERE slug = ?")
      .bind(slug)
      .first<{ id: number }>();

    if (existing) {
      return new Response(JSON.stringify({ error: "이미 존재하는 슬러그입니다. 다른 슬러그를 지정해 주세요." }), {
        status: 409,
        headers: NO_STORE_HEADERS,
      });
    }

    const now = new Date().toISOString().replace("T", " ").slice(0, 19);
    const publishedAt = status === "published" ? now : null;

    const insertRes = await d1
      .prepare(
        `INSERT INTO blog_posts (
          slug, title, category, summary, body, cover_image_url,
          status, is_trashed, published_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
      )
      .bind(
        slug,
        title,
        category,
        summary,
        postBody,
        coverImageUrl,
        status,
        publishedAt,
        now,
        now
      )
      .run();

    const newId = insertRes.meta?.last_row_id;

    return new Response(
      JSON.stringify({
        ok: true,
        post: {
          id: newId,
          slug,
          title,
          category,
          summary,
          body: postBody,
          coverImageUrl,
          status,
          publishedAt,
        },
      }),
      { status: 201, headers: NO_STORE_HEADERS }
    );
  } catch {
    return new Response(JSON.stringify({ error: "글을 저장하지 못했습니다." }), {
      status: 500,
      headers: NO_STORE_HEADERS,
    });
  }
}
