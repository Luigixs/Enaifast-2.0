import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reply, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
}

interface CommentSectionProps {
  lessonId: string;
  comments: Comment[];
  onRefetch: () => void;
}

export function CommentSection({ lessonId, comments, onRefetch }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Check if user is admin
  const { data: userRole } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      return data?.role || null;
    },
  });

  const isAdmin = userRole === "admin";

  const addComment = async (content: string, parentId?: string | null) => {
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    // Check if trying to reply and not admin
    if (parentId && !isAdmin) {
      toast.error("Apenas administradores podem responder comentários");
      return;
    }

    const { error } = await supabase
      .from("lesson_comments")
      .insert({
        lesson_id: lessonId,
        user_id: user.id,
        content,
        parent_comment_id: parentId || null,
      });

    if (error) {
      toast.error("Erro ao adicionar comentário");
      return;
    }

    toast.success(parentId ? "Resposta adicionada!" : "Comentário adicionado!");
    setNewComment("");
    setReplyContent("");
    setReplyingTo(null);
    onRefetch();
  };

  const getUserInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  const topLevelComments = comments.filter(c => !c.parent_comment_id);
  const getReplies = (commentId: string) => comments.filter(c => c.parent_comment_id === commentId);

  return (
    <div className="space-y-4">
      {/* New comment form */}
      <Card className="p-4 bg-card border-border">
        <Textarea
          placeholder="Adicione um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] mb-3"
        />
        <Button
          onClick={() => addComment(newComment)}
          disabled={!newComment.trim()}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Comentar
        </Button>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        ) : (
          topLevelComments.map((comment) => {
            const replies = getReplies(comment.id);
            
            return (
              <Card key={comment.id} className="p-4 bg-card border-border">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 bg-primary">
                    <AvatarFallback className="text-primary-foreground text-sm">
                      {getUserInitials(comment.user_id)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Usuário</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {/* Reply button (admin only) */}
                    {isAdmin && replyingTo !== comment.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(comment.id)}
                        className="gap-2 text-xs"
                      >
                        <Reply className="h-3 w-3" />
                        Responder
                      </Button>
                    )}

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          placeholder="Digite sua resposta..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => addComment(replyContent, comment.id)}
                            disabled={!replyContent.trim()}
                          >
                            Enviar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-border">
                        {replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="w-8 h-8 bg-accent">
                              <AvatarFallback className="text-accent-foreground text-xs">
                                ADM
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">Administrador</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(reply.created_at), {
                                    addSuffix: true,
                                    locale: ptBR,
                                  })}
                                </span>
                              </div>
                              
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
