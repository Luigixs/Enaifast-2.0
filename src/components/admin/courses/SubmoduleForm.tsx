import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Submodule } from "@/hooks/useSubmodules";

interface SubmoduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (submodule: Partial<Submodule>) => void;
  moduleId: string;
  submodule?: Submodule | null;
}

export function SubmoduleForm({ open, onOpenChange, onSubmit, moduleId, submodule }: SubmoduleFormProps) {
  const [formData, setFormData] = useState<Partial<Submodule>>({
    module_id: moduleId,
    name: "",
    description: "",
    status: "draft",
  });

  // Atualizar formData quando submodule mudar
  useState(() => {
    if (submodule && open) {
      setFormData({ ...submodule, module_id: moduleId });
    } else if (!submodule && open) {
      setFormData({
        module_id: moduleId,
        name: "",
        description: "",
        status: "draft",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, module_id: moduleId });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{submodule ? "Editar Submódulo" : "Cadastrar Novo Submódulo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Submódulo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "draft" | "published") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Liberado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {submodule ? "Salvar Alterações" : "Cadastrar Submódulo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
