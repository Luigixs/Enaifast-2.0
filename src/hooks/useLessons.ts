import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Lesson {
  id: string;
  module_id: string | null;
  submodule_id: string | null;
  name: string;
  description: string | null;
  type: "video" | "pdf" | "image" | "text" | "link";
  content_url: string | null;
  content: string | null;
  thumbnail_url: string | null;
  thumbnail_mobile_url: string | null;
  status: "draft" | "published";
  xp_reward: number;
  duration_minutes: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function useLessons(moduleId: string | undefined | null, submoduleId: string | undefined | null = null) {
  const queryClient = useQueryClient();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["lessons", moduleId, submoduleId],
    queryFn: async () => {
      if (!moduleId && !submoduleId) return [];
      
      let query = supabase.from("lessons").select("*");
      
      if (submoduleId) {
        query = query.eq("submodule_id", submoduleId);
      } else if (moduleId) {
        query = query.eq("module_id", moduleId).is("submodule_id", null);
      }
      
      const { data, error } = await query.order("order_index", { ascending: true });

      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!moduleId || !!submoduleId,
  });

  const createLesson = useMutation({
    mutationFn: async (lesson: Partial<Lesson>) => {
      const { data, error } = await supabase
        .from("lessons")
        .insert([lesson as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Aula criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar aula: " + error.message);
    },
  });

  const updateLesson = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Lesson> & { id: string }) => {
      const { data, error } = await supabase
        .from("lessons")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Aula atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar aula: " + error.message);
    },
  });

  const deleteLesson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Aula excluída com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir aula: " + error.message);
    },
  });

  const reorderLessons = useMutation({
    mutationFn: async (items: { id: string; order_index: number }[]) => {
      const updates = items.map((item) =>
        supabase
          .from("lessons")
          .update({ order_index: item.order_index })
          .eq("id", item.id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  return {
    lessons: lessons || [],
    isLoading,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
  };
}
