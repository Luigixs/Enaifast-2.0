import { BookOpen, Users, BarChart3, Trophy, Radio } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Bem-vindo de volta!</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Continue sua jornada de aprendizado</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <DashboardCard
          title="Cursos"
          description="Explore e continue seus cursos"
          icon={BookOpen}
          onClick={() => navigate("/student/courses")}
        />
        <DashboardCard
          title="Comunidade"
          description="Conecte-se com outros alunos"
          icon={Users}
          onClick={() => navigate("/student/community")}
        />
        <DashboardCard
          title="Analytics"
          description="Acompanhe seu progresso"
          icon={BarChart3}
          onClick={() => navigate("/student/analytics")}
        />
        <DashboardCard
          title="Ranking"
          description="Veja sua posição no ranking"
          icon={Trophy}
          onClick={() => navigate("/student/ranking")}
        />
        <DashboardCard
          title="Live"
          description="Aulas ao vivo e eventos"
          icon={Radio}
          onClick={() => navigate("/student/live")}
        />
      </div>
    </div>
  );
}
