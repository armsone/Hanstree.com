import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { AdminBlogClient } from "./AdminBlogClient";
import "../../../app/blog/blog.css";

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  return (
    <main className="blog-admin-page">
      <SiteHeader />
      <AdminBlogClient />
      <SiteFooter />
    </main>
  );
}
