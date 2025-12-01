import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface UserStats {
  id: string;
  user_id: string;
  total_xp: number;
  total_coins: number;
  current_streak: number;
  longest_streak: number;
  last_login_date: string | null;
  rank: string;
  created_at: string;
  updated_at: string;
}

export function useUserStats() {
  const queryClient = useQueryClient();

  // Fetch user stats
  const { data: userStats, isLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      // If no stats exist, create default stats
      if (!data) {
        const { data: newStats, error: insertError } = await supabase
          .from("user_stats")
          .insert({
            user_id: user.id,
            total_xp: 0,
            total_coins: 0,
            current_streak: 0,
            longest_streak: 0,
            rank: "bronze",
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newStats as UserStats;
      }

      return data as UserStats;
    },
  });

  // Register daily login
  const registerDailyLogin = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase
        .from("daily_logins")
        .insert({
          user_id: user.id,
          login_date: today,
        });

      // Ignore unique constraint violations (already logged in today)
      if (error && error.code !== "23505") {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });

  // Auto-register daily login on hook mount
  useEffect(() => {
    if (userStats) {
      registerDailyLogin.mutate();
    }
  }, []); // Only run once on mount

  return {
    userStats,
    isLoading,
    registerDailyLogin,
  };
}
