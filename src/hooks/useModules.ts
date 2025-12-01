import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Module {
  id: string;
  course_id: string;
  name: string;
  description: string | null;
  status: "draft" | "published";
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function useModules(courseId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: modules, isLoading } = useQuery({
    queryKey: ["modules", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Module[];
    },
    enabled: !!courseId,
  });

  const createModule = useMutation({
    mutationFn: async (module: Partial<Module>) => {
      const { data, error } = await supabase
        .from("modules")
        .insert([module as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
      toast.success("Módulo criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar módulo: " + error.message);
    },
  });

  const updateModule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Module> & { id: string }) => {
      const { data, error } = await supabase
        .from("modules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
      toast.success("Módulo atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar módulo: " + error.message);
    },
  });

  const deleteModule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
      toast.success("Módulo excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir módulo: " + error.message);
    },
  });

  const reorderModules = useMutation({
    mutationFn: async (items: { id: string; order_index: number }[]) => {
      const updates = items.map((item) =>
        supabase
          .from("modules")
          .update({ order_index: item.order_index })
          .eq("id", item.id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
    },
  });

  return {
    modules: modules || [],
    isLoading,
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
  };
}
