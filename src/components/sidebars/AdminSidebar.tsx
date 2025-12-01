import { useMemo, useState } from "react";
import { GraduationCap, BookOpen, Users, DollarSign, CreditCard, HelpCircle, Radio, ChevronDown, UserCog, LayoutDashboard, BarChart3, Trophy } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";
import { useLocation } from "react-router-dom";

const adminMenuItems = [
  { title: "Escola", url: "/admin/school", icon: GraduationCap },
  { title: "Cursos", url: "/admin/courses", icon: BookOpen },
  { title: "Usuários", url: "/admin/users", icon: Users },
  { title: "Gerenciar Roles", url: "/admin/user-management", icon: UserCog },
  { title: "Vendas", url: "/admin/sales", icon: DollarSign },
  { title: "Planos", url: "/admin/plans", icon: CreditCard },
  { title: "Banco de Questões", url: "/admin/questions", icon: HelpCircle },
];

const studentMenuItems = [
  { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
  { title: "Cursos", url: "/student/courses", icon: BookOpen },
  { title: "Comunidades", url: "/student/community", icon: Users },
  { title: "Analytics", url: "/student/analytics", icon: BarChart3 },
  { title: "Ranking", url: "/student/ranking", icon: Trophy },
  { title: "Live", url: "/student/live", icon: Radio },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith("/admin");
  const [openAdmin, setOpenAdmin] = useState(true);
  const [openStudent, setOpenStudent] = useState(true);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {open && (
          <UserProfile
            userName=""
            className="border-b border-sidebar-border"
          />
        )}

        {/* Diretor (Admin) */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-sidebar-foreground/70">
            Diretor
          </SidebarGroupLabel>
          <SidebarGroupAction onClick={() => setOpenAdmin((v) => !v)} aria-label="Alternar Diretor">
            <ChevronDown className={`transition-transform ${openAdmin ? '' : '-rotate-90'}`} />
          </SidebarGroupAction>
          {openAdmin && (
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
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
          )}
        </SidebarGroup>

        {/* Aluno (Student) */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-sidebar-foreground/70">
            Aluno
          </SidebarGroupLabel>
          <SidebarGroupAction onClick={() => setOpenStudent((v) => !v)} aria-label="Alternar Aluno">
            <ChevronDown className={`transition-transform ${openStudent ? '' : '-rotate-90'}`} />
          </SidebarGroupAction>
          {openStudent && (
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
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

