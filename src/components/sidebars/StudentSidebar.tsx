import { BookOpen, Users, BarChart3, Trophy, Radio, LayoutDashboard } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";

const studentMenuItems = [
  { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
  { title: "Cursos", url: "/student/courses", icon: BookOpen },
  { title: "Comunidade", url: "/student/community", icon: Users },
  { title: "Ranking", url: "/student/ranking", icon: Trophy },
  { title: "Live", url: "/student/live", icon: Radio },
  { title: "Analytics", url: "/student/analytics", icon: BarChart3 },
];

export function StudentSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {open && (
          <UserProfile
            userName=""
            className="border-b border-sidebar-border"
          />
        )}
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent hover:text-sidebar-primary transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="w-5 h-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
