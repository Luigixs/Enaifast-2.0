import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  FileText,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  BookOpen,
  MessageSquare,
  StickyNote,
  Clock,
  Send
} from "lucide-react";
import { PDFViewer } from "@/components/student/PDFViewer";
import { RichTextDisplay } from "@/components/student/RichTextDisplay";
import { LessonTimer } from "@/components/student/LessonTimer";
import { CommentSection } from "@/components/student/CommentSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function LessonViewer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [newNote, setNewNote] = useState("");

  // Fetch lesson details
  const { data: lesson } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch module or submodule to get all lessons
  const { data: allLessons = [] } = useQuery({
    queryKey: ["lessons-list", lesson?.module_id, lesson?.submodule_id],
    queryFn: async () => {
      if (!lesson) return [];
      
      let query = supabase.from("lessons").select("*");
      
      if (lesson.submodule_id) {
        query = query.eq("submodule_id", lesson.submodule_id);
      } else if (lesson.module_id) {
        query = query.eq("module_id", lesson.module_id).is("submodule_id", null);
      }
      
      const { data, error } = await query
        .eq("status", "published")
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!lesson,
  });

  // Fetch lesson progress
  const { data: lessonProgress, refetch: refetchProgress } = useQuery({
    queryKey: ["lesson-progress", lessonId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch comments
  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ["lesson-comments", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_comments")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Comment[];
    },
  });

  // Fetch notes
  const { data: notes = [], refetch: refetchNotes } = useQuery({
    queryKey: ["lesson-notes", lessonId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("lesson_notes")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Update progress when it changes
  useEffect(() => {
    if (lessonProgress) {
      setProgress(lessonProgress.progress_percentage || 0);
    }
  }, [lessonProgress]);

  // Mark lesson as complete
  const markAsComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !lesson) return;

    // Apenas marcar ESTA aula como concluída
    const { error } = await supabase
      .from("lesson_progress")
      .upsert({
        lesson_id: lesson.id,
        user_id: user.id,
        completed: true,
        progress_percentage: 100,
        xp_earned: lesson.xp_reward || 0,
        completed_at: new Date().toISOString(),
      });

    if (error) {
      toast.error("Erro ao marcar aula como concluída");
      return;
    }

    toast.success("Aula marcada como concluída!");
    refetchProgress();
    queryClient.invalidateQueries({ queryKey: ["modules"] });
    queryClient.invalidateQueries({ queryKey: ["submodules"] });
    queryClient.invalidateQueries({ queryKey: ["published-courses"] });
    setProgress(100);
  };

  // Add note
  const addNote = async () => {
    if (!newNote.trim()) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !lesson) return;

    const { error } = await supabase
      .from("lesson_notes")
      .insert({
        lesson_id: lesson.id,
        user_id: user.id,
        content: newNote,
      });

    if (error) {
      toast.error("Erro ao adicionar anotação");
      return;
    }

    toast.success("Anotação adicionada!");
    setNewNote("");
    refetchNotes();
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Navigate to next/previous lesson
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const goToPreviousLesson = () => {
    if (previousLesson) {
      navigate(`/student/lesson/${previousLesson.id}`);
    }
  };

  const goToNextLesson = () => {
    if (nextLesson) {
      navigate(`/student/lesson/${nextLesson.id}`);
    }
  };

  // Render content based on lesson type
  const renderContent = () => {
    if (!lesson) return null;

    switch (lesson.type) {
      case "video":
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            {lesson.content_url && (
              <div className="w-full max-w-[1280px]" style={{ aspectRatio: '16/9' }}>
                <video
                  className="w-full h-full"
                  controls
                  src={lesson.content_url}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    setVideoTime(video.currentTime);
                    const newProgress = (video.currentTime / video.duration) * 100;
                    setProgress(Math.round(newProgress));
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    setVideoDuration(video.duration);
                  }}
                >
                  Seu navegador não suporta vídeos.
                </video>
              </div>
            )}
          </div>
        );

      case "pdf":
        return lesson.content_url ? (
          <div className="w-full h-full">
            <PDFViewer fileUrl={lesson.content_url} className="h-full" />
          </div>
        ) : null;

      case "image":
        return lesson.content_url ? (
          <div className="w-full h-full overflow-auto bg-background">
            <div className="flex justify-center items-start min-h-full p-4">
              <img
                src={lesson.content_url}
                alt={lesson.name}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        ) : null;

      case "text":
        return lesson.content ? (
          <ScrollArea className="w-full h-full">
            <div className="max-w-4xl mx-auto p-6 prose prose-lg dark:prose-invert">
              <RichTextDisplay content={lesson.content} />
            </div>
          </ScrollArea>
        ) : null;

      case "link":
        return lesson.content_url ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 p-12">
            <LinkIcon className="h-16 w-16 text-primary" />
            <h3 className="text-2xl font-bold">Link Externo</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Esta aula contém um recurso externo. Clique no botão abaixo para acessar.
            </p>
            <Button
              size="lg"
              onClick={() => window.open(lesson.content_url!, "_blank")}
            >
              Acessar Conteúdo
            </Button>
          </div>
        ) : null;

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Tipo de conteúdo não suportado</p>
          </div>
        );
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "text":
        return <BookOpen className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!lesson) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Lista de Aulas */}
      <aside className="w-56 border-r border-border bg-card flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-2 border-b border-border">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <h2 className="font-bold text-xs">Meu progresso</h2>
          </div>
          <Progress value={progress} className="h-1" />
          <p className="text-xs text-muted-foreground mt-1">
            {progress}%
          </p>
        </div>

        {/* Lista de Aulas */}
        <ScrollArea className="flex-1">
          <div className="p-1.5 space-y-1">
            {allLessons.map((l, index) => (
              <Card
                key={l.id}
                className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                  l.id === lessonId ? "bg-accent border-primary" : ""
                }`}
                onClick={() => navigate(`/student/lesson/${l.id}`)}
              >
                <div className="flex items-start gap-1.5">
                  <div className="mt-0.5">{getLessonIcon(l.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        {l.type === "pdf" ? "pdf" : l.type}
                      </Badge>
                      {lessonProgress?.completed && l.id === lessonId && (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <h3 className="font-medium text-xs line-clamp-2">
                      {l.name}
                    </h3>
                    {l.duration_minutes && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {l.duration_minutes} min
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Minimal Header */}
        <header className="border-b border-border bg-background px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {lesson && lesson.type !== "video" && (
              <LessonTimer
                durationMinutes={lesson.duration_minutes || 0}
                onComplete={markAsComplete}
              />
            )}
            {lesson?.type === "video" && videoDuration > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(videoTime)}</span>
              </div>
            )}
            {!lessonProgress?.completed ? (
              <Button size="sm" onClick={markAsComplete} className="h-7 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Concluído
              </Button>
            ) : (
              <Badge variant="default" className="bg-green-500 h-7 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Concluída
              </Badge>
            )}
          </div>
        </header>

        {/* Content Viewer - Full Height */}
        <div className="bg-muted/20 flex-shrink-0" style={{ height: 'calc(100vh - 3.5rem)' }}>
          {renderContent()}
        </div>

        {/* Tabs - Comentários, Descrição, Anotações - Below Viewer */}
        <div className="border-t border-border bg-background flex-shrink-0">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b h-10">
              <TabsTrigger value="comments" className="text-sm gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários
              </TabsTrigger>
              <TabsTrigger value="description" className="text-sm gap-2">
                <FileText className="h-4 w-4" />
                Descrição
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-sm gap-2">
                <StickyNote className="h-4 w-4" />
                Anotações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                <CommentSection
                  lessonId={lessonId!}
                  comments={comments}
                  onRefetch={refetchComments}
                />
              </div>
            </TabsContent>

            <TabsContent value="description" className="p-4">
              <div className="prose prose-sm dark:prose-invert max-w-4xl mx-auto">
                <h3 className="text-base font-bold mb-3">{lesson.name}</h3>
                {lesson.description ? (
                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem descrição disponível.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="p-4">
              <div className="space-y-3 max-w-4xl mx-auto">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Adicionar anotação..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 min-h-[60px] text-sm resize-none"
                  />
                  <Button onClick={addNote} size="sm" className="self-end">
                    Salvar
                  </Button>
                </div>
                {notes.map((note) => (
                  <Card key={note.id} className="p-2.5">
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer - Navigation */}
        <footer className="border-t border-border bg-background px-4 py-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousLesson}
              disabled={!previousLesson}
              className="h-7 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Anterior
            </Button>

            <div className="text-xs text-muted-foreground">
              {currentIndex + 1} de {allLessons.length}
            </div>

            <Button
              size="sm"
              onClick={goToNextLesson}
              disabled={!nextLesson}
              className="h-7 text-xs"
            >
              Próxima
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
