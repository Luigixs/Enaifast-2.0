import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Flame, BookOpen } from "lucide-react";

interface UserEnrollmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  progress_percentage: number;
  courses: {
    name: string;
    type: string;
  };
}

interface UserStats {
  total_xp: number;
  total_coins: number;
  current_streak: number;
  rank: string;
}

export function UserEnrollmentsDialog({ open, onOpenChange, userId, userName }: UserEnrollmentsDialogProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrollmentsRes, statsRes] = await Promise.all([
        supabase
          .from('course_enrollments')
          .select('*, courses(name, type)')
          .eq('user_id', userId),
        supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single()
      ]);

      if (enrollmentsRes.data) setEnrollments(enrollmentsRes.data as any);
      if (statsRes.data) setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Analytics e Matrículas - {userName}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Carregando dados...</p>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Total XP
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{stats.total_xp}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        Moedas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{stats.total_coins}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        Streak
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{stats.current_streak} dias</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        Rank
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="text-sm capitalize">{stats.rank}</Badge>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Enrollments */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Cursos Matriculados ({enrollments.length})</h3>
                {enrollments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum curso matriculado</p>
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{enrollment.courses.name}</h4>
                            <Badge variant="outline">{enrollment.courses.type}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className="font-medium">{enrollment.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2 transition-all"
                                style={{ width: `${enrollment.progress_percentage}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
