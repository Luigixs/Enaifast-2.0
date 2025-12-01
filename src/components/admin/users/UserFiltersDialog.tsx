import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface UserFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    role: string;
    isActive: string;
    sortBy: string;
  };
  onFiltersChange: (filters: any) => void;
  onApply: () => void;
  onClear: () => void;
}

export function UserFiltersDialog({ 
  open, 
  onOpenChange, 
  filters, 
  onFiltersChange,
  onApply,
  onClear
}: UserFiltersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros Avançados</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Perfil do Usuário</Label>
            <Select 
              value={filters.role} 
              onValueChange={(value) => onFiltersChange({ ...filters, role: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Todos os perfis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os perfis</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Aluno</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select 
              value={filters.isActive} 
              onValueChange={(value) => onFiltersChange({ ...filters, isActive: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="true">Apenas ativos</SelectItem>
                <SelectItem value="false">Apenas inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Ordenar por</Label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
                <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
                <SelectItem value="date_desc">Mais recentes</SelectItem>
                <SelectItem value="date_asc">Mais antigos</SelectItem>
                <SelectItem value="access_desc">Último acesso (recente)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClear}>
            Limpar Filtros
          </Button>
          <Button onClick={() => { onApply(); onOpenChange(false); }}>
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
