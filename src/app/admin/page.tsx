import { SiteHeader } from "@/components/SiteHeader";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata = {
  title: "Admin | She Can Foundation",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-brand-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AdminPanel />
      </main>
    </div>
  );
}
