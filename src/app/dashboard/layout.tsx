
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-4 md:p-8">
           <Breadcrumbs />
           <main className="mt-4">
             {children}
           </main>
        </div>
      </div>
    </div>
  );
}
