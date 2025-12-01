import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Module } from "@/hooks/useModules";

interface ModuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (module: Partial<Module>) => void;
  courseId: string;
  module?: Module | null;
}

export function ModuleForm({ open, onOpenChange, onSubmit, courseId, module }: ModuleFormProps) {
  const [formData, setFormData] = useState<Partial<Module>>({
    course_id: courseId,
    name: "",
    description: "",
    status: "draft",
  });

  // Atualizar formData quando module mudar
  useState(() => {
    if (module && open) {
      setFormData({ ...module, course_id: courseId });
    } else if (!module && open) {
      setFormData({
        course_id: courseId,
        name: "",
        description: "",
        status: "draft",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, course_id: courseId });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{module ? "Editar Módulo" : "Cadastrar Novo Módulo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Módulo *</Label>
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
              {module ? "Salvar Alterações" : "Cadastrar Módulo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
