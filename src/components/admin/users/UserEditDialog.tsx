import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onUpdate: () => void;
}

interface UserData {
  email: string;
  full_name: string;
  phone: string;
  whatsapp: string;
}

export function UserEditDialog({ open, onOpenChange, userId, onUpdate }: UserEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    email: '',
    full_name: '',
    phone: '',
    whatsapp: ''
  });

  useEffect(() => {
    if (open) {
      fetchUserData();
    }
  }, [open, userId]);

  const fetchUserData = async () => {
    try {
      const [profileRes, userRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.rpc('get_users_with_roles')
      ]);

      if (profileRes.data) {
        const user = (userRes.data || []).find((u: any) => u.user_id === userId);
        setUserData({
          email: user?.email || '',
          full_name: profileRes.data.full_name || '',
          phone: profileRes.data.phone || '',
          whatsapp: profileRes.data.whatsapp || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Erro ao carregar dados do usuário');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          full_name: userData.full_name,
          phone: userData.phone,
          whatsapp: userData.whatsapp
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Usuário atualizado com sucesso');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={userData.email}
              disabled
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado</p>
          </div>

          <div>
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input
              id="full_name"
              value={userData.full_name}
              onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
              placeholder="Digite o nome completo"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={userData.whatsapp}
              onChange={(e) => setUserData({ ...userData, whatsapp: e.target.value })}
              placeholder="(00) 00000-0000"
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
