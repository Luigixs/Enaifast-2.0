import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
}

export function UserCreateDialog({ open, onOpenChange, onCreate }: UserCreateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    whatsapp: '',
    role: 'user' as 'admin' | 'user' | 'professor'
  });

  const handleCreate = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Email e senha são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('Usuário não criado');

      // Create profile
      await supabase.from('profiles').upsert({
        user_id: data.user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        is_active: true
      });

      // Set role
      await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role: formData.role
      });

      toast.success('Usuário cadastrado com sucesso');
      onCreate();
      onOpenChange(false);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        whatsapp: '',
        role: 'user'
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@email.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="role">Perfil *</Label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Aluno</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Digite o nome completo"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="(00) 00000-0000"
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
