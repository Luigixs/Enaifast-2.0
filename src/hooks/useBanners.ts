import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  link_url: string | null;
  order_index: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export function useBanners() {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("status", "active")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Banner[];
    },
  });

  return {
    banners: banners || [],
    isLoading,
  };
}
