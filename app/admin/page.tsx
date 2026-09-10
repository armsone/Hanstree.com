import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default function AdminPage() {
  return (
    <main className="admin-page">
      <SiteHeader />
      <AdminDashboardClient />
      <SiteFooter />
    </main>
  );
}
