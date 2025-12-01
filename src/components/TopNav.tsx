import { Bell, Moon, Sun, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/components/ThemeProvider";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/NotificationBell";
import logo from "@/assets/logo.png";

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="h-14 sm:h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-3 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger />
          <img 
            src={logo} 
            alt="EduVerse" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain cursor-pointer" 
            onClick={() => navigate("/student/dashboard")}
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-popover">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/student/dashboard")}>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Meu Plano</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/school")}>
                Área Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
