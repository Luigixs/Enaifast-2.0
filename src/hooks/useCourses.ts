import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Course {
  id: string;
  name: string;
  description: string | null;
  type: "free" | "paid";
  status: "draft" | "published" | "coming_soon" | "inactive";
  is_free_access: boolean;
  show_syllabus_to_all: boolean;
  enable_certificates: boolean;
  workload_hours: number;
  passing_grade: number;
  start_date: string | null;
  end_date: string | null;
  thumbnail_url: string | null;
  thumbnail_mobile_url: string | null;
  order_index: number;
  total_enrolled: number;
  total_completed: number;
  created_at: string;
  updated_at: string;
}

export function useCourses() {
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Course[];
    },
  });

  const createCourse = useMutation({
    mutationFn: async (course: Partial<Course>) => {
      const { data, error} = await supabase
        .from("courses")
        .insert([course as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar curso: " + error.message);
    },
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Course> & { id: string }) => {
      const { data, error } = await supabase
        .from("courses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar curso: " + error.message);
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir curso: " + error.message);
    },
  });

  const reorderCourses = useMutation({
    mutationFn: async (items: { id: string; order_index: number }[]) => {
      const updates = items.map((item) =>
        supabase
          .from("courses")
          .update({ order_index: item.order_index })
          .eq("id", item.id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return {
    courses: courses || [],
    isLoading,
    createCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,
  };
}
