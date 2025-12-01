import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { ModuleCard } from "@/components/ModuleCard";
import { SubmoduleCard } from "@/components/SubmoduleCard";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Fetch course details
  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch modules with lessons to calculate duration and progress
  const { data: modules = [] } = useQuery({
    queryKey: ["modules", courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("modules")
        .select(`
          *,
          lessons!lessons_module_id_fkey(id, duration_minutes)
        `)
        .eq("course_id", courseId)
        .eq("status", "published")
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      
      // Calculate progress for each module
      if (user) {
        const modulesWithProgress = await Promise.all(
          data.map(async (module) => {
            const lessonIds = module.lessons?.map((l: any) => l.id) || [];
            
            if (lessonIds.length === 0) {
              return { ...module, progress: 0 };
            }
            
            const { data: progressData } = await supabase
              .from("lesson_progress")
              .select("completed")
              .eq("user_id", user.id)
              .in("lesson_id", lessonIds);
            
            const completedCount = progressData?.filter(p => p.completed).length || 0;
            const progress = (completedCount / lessonIds.length) * 100;
            
            return { ...module, progress };
          })
        );
        
        return modulesWithProgress;
      }
      
      return data.map(m => ({ ...m, progress: 0 }));
    },
  });

  // Fetch submodules for selected module with lessons to calculate duration and progress
  const { data: submodules = [] } = useQuery({
    queryKey: ["submodules", selectedModuleId],
    queryFn: async () => {
      if (!selectedModuleId) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("submodules")
        .select(`
          *,
          lessons!lessons_submodule_id_fkey(id, duration_minutes, order_index)
        `)
        .eq("module_id", selectedModuleId)
        .eq("status", "published")
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      
      // Calculate progress for each submodule
      if (user) {
        const submodulesWithProgress = await Promise.all(
          data.map(async (submodule) => {
            const lessonIds = submodule.lessons?.map((l: any) => l.id) || [];
            
            if (lessonIds.length === 0) {
              return { ...submodule, progress: 0 };
            }
            
            const { data: progressData } = await supabase
              .from("lesson_progress")
              .select("completed")
              .eq("user_id", user.id)
              .in("lesson_id", lessonIds);
            
            const completedCount = progressData?.filter(p => p.completed).length || 0;
            const progress = (completedCount / lessonIds.length) * 100;
            
            return { ...submodule, progress };
          })
        );
        
        return submodulesWithProgress;
      }
      
      return data.map(s => ({ ...s, progress: 0 }));
    },
    enabled: !!selectedModuleId,
  });

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  const calculateTotalDuration = (lessons: any[]) => {
    if (!lessons || lessons.length === 0) return 0;
    return lessons.reduce((total, lesson) => total + (lesson.duration_minutes || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => selectedModuleId ? setSelectedModuleId(null) : navigate("/student/courses")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {selectedModule ? selectedModule.name : course?.name}
          </h1>
          {!selectedModuleId && course?.description && (
            <p className="text-muted-foreground mt-1">{course.description}</p>
          )}
          {selectedModule?.description && (
            <p className="text-muted-foreground mt-1">{selectedModule.description}</p>
          )}
        </div>
      </div>

      {/* Modules Grid */}
      {!selectedModuleId && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {modules.map((module: any, index) => {
            const totalDuration = calculateTotalDuration(module.lessons || []);
            const lessonCount = module.lessons?.length || 0;
            
            return (
              <ModuleCard
                key={module.id}
                title={module.name}
                description={module.description}
                thumbnailUrl={module.thumbnail_url}
                moduleNumber={index + 1}
                totalDuration={totalDuration}
                lessonCount={lessonCount}
                progress={module.progress || 0}
                onClick={() => setSelectedModuleId(module.id)}
              />
            );
          })}
        </div>
      )}

      {/* Submodules Grid */}
      {selectedModuleId && submodules.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {submodules.map((submodule: any, index) => {
            const totalDuration = calculateTotalDuration(submodule.lessons || []);
            const lessonCount = submodule.lessons?.length || 0;
            
            return (
              <SubmoduleCard
                key={submodule.id}
                title={submodule.name}
                description={submodule.description}
                thumbnailUrl={submodule.thumbnail_url}
                submoduleNumber={index + 1}
                totalDuration={totalDuration}
                lessonCount={lessonCount}
                progress={submodule.progress || 0}
                onClick={() => {
                  const firstLesson = submodule.lessons?.[0];
                  if (firstLesson) {
                    navigate(`/student/lesson/${firstLesson.id}`);
                  }
                }}
              />
            );
          })}
        </div>
      )}

      {/* No submodules message */}
      {selectedModuleId && submodules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum submódulo encontrado neste módulo.</p>
        </div>
      )}
    </div>
  );
}
