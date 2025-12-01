import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

type Period = "weekly" | "monthly" | "all";

interface RankingUser {
  userId: string;
  email: string;
  xp: number;
  rank: string;
}

const rankIcons: Record<string, React.ReactNode> = {
  bronze: <Award className="w-4 h-4 text-amber-700" />,
  silver: <Medal className="w-4 h-4 text-gray-400" />,
  gold: <Trophy className="w-4 h-4 text-yellow-500" />,
  platinum: <Trophy className="w-4 h-4 text-cyan-400" />,
  diamond: <Trophy className="w-4 h-4 text-blue-400" />,
  master: <Trophy className="w-4 h-4 text-purple-500" />,
  challenger: <Trophy className="w-4 h-4 text-red-500" />,
};

export default function StudentRanking() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user
  useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      return user;
    },
  });

  // Fetch ranking data
  const { data: rankings = [], isLoading } = useQuery({
    queryKey: ["rankings", period],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      if (period === "all") {
        // Get all-time rankings from user_stats
        const { data: stats, error } = await supabase
          .from("user_stats")
          .select("user_id, total_xp, rank")
          .order("total_xp", { ascending: false });

        if (error) throw error;

        // Get user emails
        const { data: users } = await supabase.rpc("get_users_with_roles");
        
        const userMap = new Map(users?.map(u => [u.user_id, u.email]) || []);

        return stats.map(s => ({
          userId: s.user_id,
          email: userMap.get(s.user_id) || "Usuário",
          xp: s.total_xp,
          rank: s.rank,
        })) as RankingUser[];
      } else {
        // Calculate weekly or monthly XP
        const today = new Date();
        const startDate = new Date(today);
        
        if (period === "weekly") {
          startDate.setDate(today.getDate() - 7);
        } else {
          startDate.setDate(today.getDate() - 30);
        }

        const { data: progress, error } = await supabase
          .from("lesson_progress")
          .select("user_id, xp_earned")
          .eq("completed", true)
          .gte("completed_at", startDate.toISOString());

        if (error) throw error;

        // Group by user
        const xpByUser = new Map<string, number>();
        progress.forEach(p => {
          const current = xpByUser.get(p.user_id) || 0;
          xpByUser.set(p.user_id, current + (p.xp_earned || 0));
        });

        // Get user emails and ranks
        const { data: users } = await supabase.rpc("get_users_with_roles");
        const { data: stats } = await supabase.from("user_stats").select("user_id, rank");
        
        const userMap = new Map(users?.map(u => [u.user_id, u.email]) || []);
        const rankMap = new Map(stats?.map(s => [s.user_id, s.rank]) || []);

        const result: RankingUser[] = Array.from(xpByUser.entries())
          .map(([userId, xp]) => ({
            userId,
            email: userMap.get(userId) || "Usuário",
            xp,
            rank: rankMap.get(userId) || "bronze",
          }))
          .sort((a, b) => b.xp - a.xp);

        return result;
      }
    },
  });

  // Get current user position
  const currentUserPosition = rankings.findIndex(r => r.userId === currentUserId);
  const currentUser = rankings[currentUserPosition];

  const getUserInitials = (email: string) => {
    const name = email.split("@")[0];
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-orange-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-cyan-500",
      "bg-red-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-6">Ranking</h1>
        
        {/* Period Filter */}
        <div className="flex justify-center gap-2 mb-6">
          <Badge
            variant={period === "weekly" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm",
              period === "weekly" && "bg-primary text-primary-foreground"
            )}
            onClick={() => setPeriod("weekly")}
          >
            Semanal
          </Badge>
          <Badge
            variant={period === "monthly" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm",
              period === "monthly" && "bg-primary text-primary-foreground"
            )}
            onClick={() => setPeriod("monthly")}
          >
            Mensal
          </Badge>
          <Badge
            variant={period === "all" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm",
              period === "all" && "bg-primary text-primary-foreground"
            )}
            onClick={() => setPeriod("all")}
          >
            Geral
          </Badge>
        </div>
      </div>

      {/* My Position Card - Fixed */}
      {currentUser && currentUserPosition >= 0 && (
        <Card className="bg-primary/10 border-primary sticky top-0 z-10">
          <div className="flex items-center gap-4 p-4">
            <div className="w-8 text-center">
              <span className="text-lg font-bold text-primary">
                {currentUserPosition + 1}
              </span>
            </div>

            <Avatar className="w-10 h-10 bg-primary">
              <AvatarFallback className="text-primary-foreground font-semibold">
                {getUserInitials(currentUser.email)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <span className="font-semibold text-primary">
                Você - {currentUser.email.split("@")[0]}
              </span>
            </div>

            <div>{rankIcons[currentUser.rank] || rankIcons.bronze}</div>

            <div className="text-right min-w-[100px]">
              <span className="font-bold text-primary">
                {currentUser.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Ranking List */}
      <Card className="bg-card border-border">
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando ranking...
            </div>
          ) : rankings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum dado disponível
            </div>
          ) : (
            rankings.map((user, index) => (
              <div
                key={user.userId}
                className={cn(
                  "flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                  user.userId === currentUser?.userId && "bg-primary/5 border-l-4 border-primary"
                )}
              >
                {/* Position */}
                <div className="w-8 text-center">
                  <span className="text-lg font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                </div>

                {/* Avatar */}
                <Avatar className={cn("w-10 h-10", getAvatarColor(index))}>
                  <AvatarFallback className="text-white font-semibold">
                    {getUserInitials(user.email)}
                  </AvatarFallback>
                </Avatar>

                {/* Name */}
                <div className="flex-1">
                  <span className="font-medium text-foreground">
                    {user.email.split("@")[0]}
                  </span>
                </div>

                {/* Rank Icon */}
                <div>{rankIcons[user.rank] || rankIcons.bronze}</div>

                {/* XP */}
                <div className="text-right min-w-[100px]">
                  <span className="font-semibold text-foreground">
                    {user.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
