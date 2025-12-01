import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStats } from "@/hooks/useUserStats";
import { Zap, Trophy, Flame, Coins, HelpCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "challenger";

const rankNames: Record<RankTier, string> = {
  bronze: "Ferro II",
  silver: "Bronze I",
  gold: "Prata II",
  platinum: "Ouro I",
  diamond: "Platina II",
  master: "Diamante I",
  challenger: "Mestre",
};

const rankColors: Record<RankTier, string> = {
  bronze: "text-rank-bronze",
  silver: "text-rank-silver",
  gold: "text-rank-gold",
  platinum: "text-rank-platinum",
  diamond: "text-rank-diamond",
  master: "text-rank-master",
  challenger: "text-rank-challenger",
};

export default function StudentAnalytics() {
  const { userStats, isLoading } = useUserStats();

  // Fetch weekly XP progress
  const { data: weeklyXP = [] } = useQuery({
    queryKey: ["weekly-xp"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const { data, error } = await supabase
        .from("lesson_progress")
        .select("xp_earned, completed_at")
        .eq("user_id", user.id)
        .eq("completed", true)
        .gte("completed_at", sevenDaysAgo.toISOString())
        .order("completed_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const grouped: Record<string, number> = {};
      data.forEach((item) => {
        const date = new Date(item.completed_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });
        grouped[date] = (grouped[date] || 0) + (item.xp_earned || 0);
      });

      return Object.entries(grouped).map(([date, xp]) => ({
        date,
        xp,
      }));
    },
  });

  // Fetch course progress for discipline performance
  const { data: courseProgress = [] } = useQuery({
    queryKey: ["course-progress"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: enrollments, error } = await supabase
        .from("course_enrollments")
        .select(`
          progress_percentage,
          course_id,
          courses (
            name
          )
        `)
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (error) throw error;

      return enrollments.map((e: any) => ({
        name: e.courses?.name || "Curso",
        progress: e.progress_percentage || 0,
      }));
    },
  });

  // Calculate weekly XP
  const weeklyXPTotal = weeklyXP.reduce((sum, item) => sum + item.xp, 0);

  // Count completed questions (using lesson_progress as proxy)
  const { data: questionsCount = 0 } = useQuery({
    queryKey: ["questions-count"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error } = await supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("completed", true);

      if (error) throw error;
      return count || 0;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Carregando analytics...</div>
      </div>
    );
  }

  const rank = (userStats?.rank || "bronze") as RankTier;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div className="text-sm text-muted-foreground">
          Últimos 7 dias
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* XP Total */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-2">
              <Zap className="w-5 h-5 text-xp" />
              <span className="text-sm text-muted-foreground">XP Total</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {userStats?.total_xp.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>

        {/* XP Semanal */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">XP Semanal</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {weeklyXPTotal}
            </p>
          </CardContent>
        </Card>

        {/* Dias de Investida */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-2">
              <Flame className="w-5 h-5 text-streak" />
              <span className="text-sm text-muted-foreground">Dias de Investida</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {userStats?.current_streak || 0}
            </p>
          </CardContent>
        </Card>

        {/* ClassPoint */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-2">
              <Coins className="w-5 h-5 text-coins" />
              <span className="text-sm text-muted-foreground">ClassPoint</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {userStats?.total_coins || 0}
            </p>
          </CardContent>
        </Card>

        {/* Patente */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Patente</span>
            </div>
            <p className={cn("text-2xl font-bold", rankColors[rank])}>
              {rankNames[rank]}
            </p>
          </CardContent>
        </Card>

        {/* Questões */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-accent-foreground" />
              <span className="text-sm text-muted-foreground">Questões</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {questionsCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Desempenho no período */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              Desempenho no período
              <span className="ml-auto text-sm font-normal text-muted-foreground">ⓘ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyXP}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Legend 
                    iconType="square"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <Bar 
                    dataKey="xp" 
                    fill="hsl(142, 76%, 36%)" 
                    name="Certas"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rendimento por Disciplina */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Rendimento por Disciplina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Legend 
                    iconType="square"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <Bar 
                    dataKey="progress" 
                    fill="hsl(142, 76%, 36%)" 
                    name="Certas"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
