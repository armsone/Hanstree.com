import { env } from "cloudflare:workers";
import { isRequestAuthenticated } from "../../../../testflight-auth";
import { getD1 } from "../../../../../db";

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ id: string }>;

export async function GET(request: Request, props: { params: RouteParams }) {
  try {
    const { id } = await props.params;
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      return new Response("Not found", { status: 404 });
    }

    const d1 = getD1();
    const mediaRow = await d1
      .prepare(
        `SELECT m.storage_key AS storageKey,
                m.mime_type AS mimeType,
                m.post_id AS postId,
                p.status AS postStatus,
                p.is_trashed AS postTrashed
         FROM blog_media m
         LEFT JOIN blog_posts p ON m.post_id = p.id
         WHERE m.id = ?`
      )
      .bind(id)
      .first<{
        storageKey: string;
        mimeType: string;
        postId: number | null;
        postStatus: string | null;
        postTrashed: number | null;
      }>();

    if (!mediaRow) {
      return new Response("Not found", { status: 404 });
    }

    // Privacy guard: If media is not associated with a published, non-trashed post,
    // only authenticated administrators can access it.
    const isPubliclyAvailable =
      mediaRow.postStatus === "published" &&
      (mediaRow.postTrashed === 0 || mediaRow.postTrashed === null);

    if (!isPubliclyAvailable) {
      const authenticated = await isRequestAuthenticated(request);
      if (!authenticated) {
        return new Response("Not found", { status: 404 });
      }
    }

    if (!env.BUCKET) {
      return new Response("Storage unavailable", { status: 500 });
    }

    const object = await env.BUCKET.get(mediaRow.storageKey);
    if (!object || !object.body) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", mediaRow.mimeType || "application/octet-stream");
    headers.set("Cache-Control", "no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    if (object.size) {
      headers.set("Content-Length", String(object.size));
    }

    return new Response(object.body, {
      status: 200,
      headers,
    });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
