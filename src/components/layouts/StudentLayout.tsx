import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/sidebars/StudentSidebar";
import { AdminSidebar } from "@/components/sidebars/AdminSidebar";
import { TopNav } from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentLayout() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
