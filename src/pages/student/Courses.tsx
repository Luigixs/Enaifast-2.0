import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useBanners } from "@/hooks/useBanners";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CourseCard } from "@/components/CourseCard";

export default function StudentCourses() {
  const navigate = useNavigate();
  const { banners, isLoading: bannersLoading } = useBanners();
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ["published-courses"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("status", "published")
        .order("order_index", { ascending: true });

      if (error) throw error;
      
      // Calculate progress for each course
      if (user) {
        const coursesWithProgress = await Promise.all(
          data.map(async (course) => {
            // Get all lessons for this course
            const { data: modules } = await supabase
              .from("modules")
              .select("id")
              .eq("course_id", course.id);
            
            if (!modules || modules.length === 0) {
              return { ...course, progress: 0 };
            }
            
            const moduleIds = modules.map(m => m.id);
            
            const { data: lessons } = await supabase
              .from("lessons")
              .select("id")
              .in("module_id", moduleIds);
            
            if (!lessons || lessons.length === 0) {
              return { ...course, progress: 0 };
            }
            
            const lessonIds = lessons.map(l => l.id);
            
            const { data: progressData } = await supabase
              .from("lesson_progress")
              .select("completed")
              .eq("user_id", user.id)
              .in("lesson_id", lessonIds);
            
            const completedCount = progressData?.filter(p => p.completed).length || 0;
            const progress = (completedCount / lessonIds.length) * 100;
            
            return { ...course, progress };
          })
        );
        
        return coursesWithProgress;
      }
      
      return data.map(c => ({ ...c, progress: 0 }));
    },
  });

  // Buscar progresso do usuário (agora não é mais necessário, mas mantemos para compatibilidade)
  const { data: userProgress } = useQuery({
    queryKey: ["user-course-progress"],
    queryFn: async () => [],
    enabled: false,
  });

  // Calcular cursos em progresso
  const coursesInProgress = courses?.filter((course: any) => course.progress > 0) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum curso disponível no momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1200px] mx-auto px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Meus Cursos</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Continue de onde parou</p>
      </div>

      {/* Banners Hero Section */}
      {!bannersLoading && banners && banners.length > 0 && (
        <section className="relative">
          {banners.length === 1 ? (
            <div
              className="relative w-full rounded-lg sm:rounded-xl overflow-hidden cursor-pointer shadow-xl sm:shadow-2xl"
              style={{
                aspectRatio: "16/6",
                backgroundImage: `url(${banners[0].image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => banners[0].link_url && window.open(banners[0].link_url, '_blank')}
            >
              {(banners[0].title || banners[0].subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex flex-col justify-end p-4 sm:p-8 md:p-12">
                  {banners[0].title && (
                    <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-1 sm:mb-2 font-serif">{banners[0].title}</h2>
                  )}
                  {banners[0].subtitle && (
                    <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl line-clamp-2 sm:line-clamp-none">{banners[0].subtitle}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {banners.map((banner) => (
                  <CarouselItem key={banner.id}>
                    <div
                      className="relative w-full rounded-lg sm:rounded-xl overflow-hidden cursor-pointer shadow-xl sm:shadow-2xl"
                      style={{
                        aspectRatio: "16/6",
                        backgroundImage: `url(${banner.image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      onClick={() => banner.link_url && window.open(banner.link_url, '_blank')}
                    >
                      {(banner.title || banner.subtitle) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex flex-col justify-end p-4 sm:p-8 md:p-12">
                          {banner.title && (
                            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-1 sm:mb-2 font-serif">{banner.title}</h2>
                          )}
                          {banner.subtitle && (
                            <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl line-clamp-2 sm:line-clamp-none">{banner.subtitle}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4" />
              <CarouselNext className="right-2 sm:right-4" />
            </Carousel>
          )}
        </section>
      )}

      {/* Todos os Cursos */}
      <section>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 font-serif">Todos os Cursos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {courses.map((course: any) => (
            <CourseCard
              key={course.id}
              title={course.name}
              thumbnailUrl={course.thumbnail_url}
              workloadHours={course.workload_hours}
              progress={course.progress || 0}
              onClick={() => navigate(`/student/courses/${course.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Em Progresso - só aparece se houver cursos com progresso */}
      {coursesInProgress.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 font-serif">Em Progresso</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {coursesInProgress.map((course: any) => (
              <CourseCard
                key={course.id}
                title={course.name}
                thumbnailUrl={course.thumbnail_url}
                workloadHours={course.workload_hours}
                progress={course.progress || 0}
                onClick={() => navigate(`/student/courses/${course.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
