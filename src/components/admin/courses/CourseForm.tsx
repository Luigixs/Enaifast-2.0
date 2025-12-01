import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/hooks/useCourses";

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (course: Partial<Course>) => void;
  course?: Course | null;
}

export function CourseForm({ open, onOpenChange, onSubmit, course }: CourseFormProps) {
  const [formData, setFormData] = useState<Partial<Course>>(
    course || {
      name: "",
      description: "",
      type: "free",
      status: "draft",
      is_free_access: false,
      show_syllabus_to_all: false,
      enable_certificates: false,
      workload_hours: 0,
      passing_grade: 7.0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? "Editar Curso" : "Cadastrar Novo Curso"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Curso *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "free" | "paid") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Grátis (liberado após cadastro)</SelectItem>
                  <SelectItem value="paid">Pago (liberado após pagamento)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published" | "coming_soon" | "inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Liberado</SelectItem>
                  <SelectItem value="coming_soon">Em Breve</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workload_hours">Carga Horária (horas)</Label>
              <Input
                id="workload_hours"
                type="number"
                value={formData.workload_hours}
                onChange={(e) => setFormData({ ...formData, workload_hours: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing_grade">Média de Aprovação</Label>
              <Input
                id="passing_grade"
                type="number"
                step="0.1"
                value={formData.passing_grade}
                onChange={(e) => setFormData({ ...formData, passing_grade: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_free_access"
                checked={formData.is_free_access}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_free_access: checked as boolean })
                }
              />
              <Label htmlFor="is_free_access" className="font-normal cursor-pointer">
                Curso livre (acesso gratuito para todos)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show_syllabus_to_all"
                checked={formData.show_syllabus_to_all}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, show_syllabus_to_all: checked as boolean })
                }
              />
              <Label htmlFor="show_syllabus_to_all" className="font-normal cursor-pointer">
                Permitir que todos visualizem a grade do curso
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable_certificates"
                checked={formData.enable_certificates}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, enable_certificates: checked as boolean })
                }
              />
              <Label htmlFor="enable_certificates" className="font-normal cursor-pointer">
                Habilitar certificados
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {course ? "Salvar Alterações" : "Cadastrar Curso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
