import { isTrustedSameSiteEvent } from "../../../../requestTraffic";
import { isRequestAuthenticated } from "../../../../testflight-auth";
import { getD1 } from "../../../../../db";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

type RouteParams = Promise<{ id: string }>;

export async function GET(request: Request, props: { params: RouteParams }) {
  try {
    if (!(await isRequestAuthenticated(request))) {
      return new Response(JSON.stringify({ error: "인증이 필요합니다." }), {
        status: 401,
        headers: NO_STORE_HEADERS,
      });
    }

    const { id: rawId } = await props.params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "올바르지 않은 글 번호입니다." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    const d1 = getD1();
    const post = await d1
      .prepare(
        `SELECT id, slug, title, category, summary, body, cover_image_url AS coverImageUrl,
                status, is_trashed AS isTrashed, published_at AS publishedAt,
                created_at AS createdAt, updated_at AS updatedAt
         FROM blog_posts
         WHERE id = ?`
      )
      .bind(id)
      .first();

    if (!post) {
      return new Response(JSON.stringify({ error: "글을 찾을 수 없습니다." }), {
        status: 404,
        headers: NO_STORE_HEADERS,
      });
    }

    return new Response(JSON.stringify({ ok: true, post }), {
      status: 200,
      headers: NO_STORE_HEADERS,
    });
  } catch {
    return new Response(JSON.stringify({ error: "글 정보를 불러오지 못했습니다." }), {
      status: 500,
      headers: NO_STORE_HEADERS,
    });
  }
}

export async function PUT(request: Request, props: { params: RouteParams }) {
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

    const { id: rawId } = await props.params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "올바르지 않은 글 번호입니다." }), {
        status: 400,
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
      isTrashed?: unknown;
      action?: unknown; // "trash" | "restore" | "publish" | "unpublish"
    };

    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "잘못된 JSON 형식입니다." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    const d1 = getD1();
    const existing = await d1
      .prepare(
        "SELECT id, slug, status, is_trashed AS isTrashed, published_at AS publishedAt FROM blog_posts WHERE id = ?"
      )
      .bind(id)
      .first<{
        id: number;
        slug: string;
        status: string;
        isTrashed: number;
        publishedAt: string | null;
      }>();

    if (!existing) {
      return new Response(JSON.stringify({ error: "글을 찾을 수 없습니다." }), {
        status: 404,
        headers: NO_STORE_HEADERS,
      });
    }

    const now = new Date().toISOString().replace("T", " ").slice(0, 19);

    // Quick action handling (soft trash / restore / publish / unpublish)
    if (body.action === "trash" || body.isTrashed === true || body.isTrashed === 1) {
      await d1
        .prepare("UPDATE blog_posts SET is_trashed = 1, updated_at = ? WHERE id = ?")
        .bind(now, id)
        .run();
      return new Response(
        JSON.stringify({ ok: true, message: "휴지통으로 이동되었습니다." }),
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    if (body.action === "restore" || body.isTrashed === false || body.isTrashed === 0) {
      await d1
        .prepare("UPDATE blog_posts SET is_trashed = 0, updated_at = ? WHERE id = ?")
        .bind(now, id)
        .run();
      return new Response(
        JSON.stringify({ ok: true, message: "글이 복구되었습니다." }),
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    // Full update
    if (typeof body.body !== "string") {
      return new Response(JSON.stringify({ error: "본문 내용이 필요합니다." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const rawSlug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : "일반";
    const summary = typeof body.summary === "string" ? body.summary.trim() : "";
    const postBody = body.body;
    const coverImageUrl = typeof body.coverImageUrl === "string" && body.coverImageUrl.trim() ? body.coverImageUrl.trim() : null;
    const status = body.status === "published" ? "published" : "draft";

    if (!title || title.length > 200) {
      return new Response(JSON.stringify({ error: "제목은 1자 이상 200자 이하로 입력해 주세요." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    const slug = rawSlug || existing.slug;
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

    // Check slug conflict with another post
    if (slug !== existing.slug) {
      const conflict = await d1
        .prepare("SELECT id FROM blog_posts WHERE slug = ? AND id != ?")
        .bind(slug, id)
        .first<{ id: number }>();

      if (conflict) {
        return new Response(JSON.stringify({ error: "이미 존재하는 슬러그입니다. 다른 슬러그를 지정해 주세요." }), {
          status: 409,
          headers: NO_STORE_HEADERS,
        });
      }
    }

    let publishedAt = existing.publishedAt;
    if (status === "published" && !publishedAt) {
      publishedAt = now;
    }

    await d1
      .prepare(
        `UPDATE blog_posts
         SET slug = ?, title = ?, category = ?, summary = ?, body = ?,
             cover_image_url = ?, status = ?, published_at = ?, updated_at = ?
         WHERE id = ?`
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
        id
      )
      .run();

    return new Response(
      JSON.stringify({
        ok: true,
        post: {
          id,
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
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch {
    return new Response(JSON.stringify({ error: "글을 수정하지 못했습니다." }), {
      status: 500,
      headers: NO_STORE_HEADERS,
    });
  }
}
