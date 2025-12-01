import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  onDelete: () => void;
}

export function UserDeleteDialog({ open, onOpenChange, userId, userName, onDelete }: UserDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Delete user data (profile, enrollments, progress, etc)
      await Promise.all([
        supabase.from('profiles').delete().eq('user_id', userId),
        supabase.from('course_enrollments').delete().eq('user_id', userId),
        supabase.from('lesson_progress').delete().eq('user_id', userId),
        supabase.from('user_stats').delete().eq('user_id', userId),
        supabase.from('user_roles').delete().eq('user_id', userId)
      ]);

      toast.success('Usuário removido com sucesso');
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao remover usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription className="pt-4">
            Tem certeza que deseja remover o usuário <strong>{userName}</strong>?
            <br /><br />
            Esta ação irá:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Remover todos os dados do usuário</li>
              <li>Cancelar todas as matrículas</li>
              <li>Apagar todo o progresso</li>
              <li>Excluir estatísticas e histórico</li>
            </ul>
            <br />
            <strong className="text-destructive">Esta ação não pode ser desfeita!</strong>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? 'Removendo...' : 'Remover Usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
