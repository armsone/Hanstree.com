import { env } from "cloudflare:workers";
import { isTrustedSameSiteEvent } from "../../../../requestTraffic";
import { isRequestAuthenticated } from "../../../../testflight-auth";
import { getD1 } from "../../../../../db";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

function verifyImageMagicBytes(buffer: Uint8Array): { valid: boolean; mimeType?: string } {
  if (buffer.length < 12) return { valid: false };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mimeType: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, mimeType: "image/png" };
  }

  // WebP: RIFF ... WEBP
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;
  if (isRiff && isWebp) {
    return { valid: true, mimeType: "image/webp" };
  }

  return { valid: false };
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

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "multipart/form-data 요청이어야 합니다." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const rawPostId = formData.get("postId");
    const postId = typeof rawPostId === "string" && rawPostId ? parseInt(rawPostId, 10) : NaN;
    if (isNaN(postId) || postId <= 0) {
      return new Response(JSON.stringify({ error: "올바른 게시글 번호(postId)가 필요합니다." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "업로드할 파일이 없습니다." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return new Response(JSON.stringify({ error: "파일 크기는 10MB 이하만 가능합니다." }), {
        status: 400,
        headers: NO_STORE_HEADERS,
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const magic = verifyImageMagicBytes(bytes);

    if (!magic.valid || !magic.mimeType) {
      return new Response(
        JSON.stringify({ error: "JPEG, PNG, WebP 형식의 이미지만 업로드할 수 있습니다." }),
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const d1 = getD1();
    const post = await d1
      .prepare("SELECT id FROM blog_posts WHERE id = ? AND is_trashed = 0")
      .bind(postId)
      .first<{ id: number }>();

    if (!post) {
      return new Response(JSON.stringify({ error: "대상 게시글을 찾을 수 없거나 삭제된 글입니다." }), {
        status: 404,
        headers: NO_STORE_HEADERS,
      });
    }

    if (!env.BUCKET) {
      return new Response(
        JSON.stringify({ error: "R2 스토리지(BUCKET)가 연결되지 않았습니다." }),
        { status: 500, headers: NO_STORE_HEADERS }
      );
    }

    const mediaId = crypto.randomUUID().replace(/-/g, "");
    const ext = magic.mimeType === "image/jpeg" ? "jpg" : magic.mimeType === "image/png" ? "png" : "webp";
    const storageKey = `blog/${mediaId}.${ext}`;

    // Upload object to R2
    await env.BUCKET.put(storageKey, arrayBuffer, {
      httpMetadata: {
        contentType: magic.mimeType,
      },
    });

    // Store metadata in D1
    await d1
      .prepare(
        `INSERT INTO blog_media (
          id, post_id, storage_key, mime_type, size, original_filename, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .bind(
        mediaId,
        postId,
        storageKey,
        magic.mimeType,
        file.size,
        file.name.slice(0, 100)
      )
      .run();

    const mediaUrl = `/api/blog/media/${mediaId}`;
    return new Response(
      JSON.stringify({
        ok: true,
        id: mediaId,
        url: mediaUrl,
        mimeType: magic.mimeType,
        size: file.size,
      }),
      { status: 201, headers: NO_STORE_HEADERS }
    );
  } catch {
    return new Response(JSON.stringify({ error: "이미지 업로드에 실패했습니다." }), {
      status: 500,
      headers: NO_STORE_HEADERS,
    });
  }
}
