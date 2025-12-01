import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Submodule {
  id: string;
  module_id: string;
  name: string;
  description: string | null;
  status: "draft" | "published";
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function useSubmodules(moduleId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: submodules, isLoading } = useQuery({
    queryKey: ["submodules", moduleId],
    queryFn: async () => {
      if (!moduleId) return [];
      
      const { data, error } = await supabase
        .from("submodules")
        .select("*")
        .eq("module_id", moduleId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Submodule[];
    },
    enabled: !!moduleId,
  });

  const createSubmodule = useMutation({
    mutationFn: async (submodule: Partial<Submodule>) => {
      const { data, error } = await supabase
        .from("submodules")
        .insert([submodule as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] });
      toast.success("Submódulo criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar submódulo: " + error.message);
    },
  });

  const updateSubmodule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Submodule> & { id: string }) => {
      const { data, error } = await supabase
        .from("submodules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] });
      toast.success("Submódulo atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar submódulo: " + error.message);
    },
  });

  const deleteSubmodule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("submodules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] });
      toast.success("Submódulo excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir submódulo: " + error.message);
    },
  });

  const reorderSubmodules = useMutation({
    mutationFn: async (items: { id: string; order_index: number }[]) => {
      const updates = items.map((item) =>
        supabase
          .from("submodules")
          .update({ order_index: item.order_index })
          .eq("id", item.id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submodules", moduleId] });
    },
  });

  return {
    submodules: submodules || [],
    isLoading,
    createSubmodule,
    updateSubmodule,
    deleteSubmodule,
    reorderSubmodules,
  };
}
