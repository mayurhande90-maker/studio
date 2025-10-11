import { DashboardHeader } from '@/components/layout/dashboard-header';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-secondary/20">
          {children}
        </main>
      </div>
    </div>
  );
}
