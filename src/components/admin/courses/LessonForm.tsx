import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lesson } from "@/hooks/useLessons";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, FileText, Image as ImageIcon, Video } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";

interface LessonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (lesson: Partial<Lesson>) => void;
  moduleId: string | null;
  submoduleId?: string | null;
  lesson?: Lesson | null;
}

export function LessonForm({ open, onOpenChange, onSubmit, moduleId, submoduleId, lesson }: LessonFormProps) {
  const [formData, setFormData] = useState<Partial<Lesson>>({
    module_id: moduleId,
    submodule_id: submoduleId || null,
    name: "",
    description: "",
    type: "video",
    status: "draft",
    xp_reward: 10,
    duration_minutes: 0,
    content_url: null,
    thumbnail_url: null,
    content: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (lesson && open) {
      setFormData({
        ...lesson,
        module_id: moduleId,
        submodule_id: submoduleId || null,
      });
    } else if (!lesson && open) {
      setFormData({
        module_id: moduleId,
        submodule_id: submoduleId || null,
        name: "",
        description: "",
        type: "video",
        status: "draft",
        xp_reward: 10,
        duration_minutes: 0,
        content_url: null,
        thumbnail_url: null,
        content: "",
      });
    }
  }, [lesson, open, moduleId, submoduleId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "content" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Arquivo muito grande! Máximo de 100MB.");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const bucket = type === "content" ? "lesson-content" : "course-thumbnails";

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (type === "content") {
        setFormData(prev => ({ ...prev, content_url: publicUrl }));
        toast.success("✅ Conteúdo enviado com sucesso!");
      } else {
        setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
        toast.success("✅ Capa enviada com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      toast.error(`❌ Erro ao enviar: ${error.message || 'Tente novamente'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error("Nome da aula é obrigatório!");
      return;
    }
    
    onSubmit({ ...formData, module_id: moduleId, submodule_id: submoduleId || null });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? "Editar Aula" : "Cadastrar Nova Aula"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Aula *</Label>
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
                onValueChange={(value: "video" | "pdf" | "image" | "text" | "link") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          {formData.type === "text" ? (
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo em Texto Rico</Label>
              <RichTextEditor
                value={formData.content || ""}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Digite o conteúdo da aula aqui..."
              />
            </div>
          ) : formData.type === "link" ? (
            <div className="space-y-2">
              <Label htmlFor="content_url">URL do Link</Label>
              <Input
                id="content_url"
                type="url"
                value={formData.content_url || ""}
                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Label>Upload do Arquivo de Conteúdo</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("content-upload")?.click()}
                  disabled={uploading}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Enviando..." : "Escolher Arquivo"}
                </Button>
                {formData.content_url && (
                  <span className="text-sm text-success flex items-center gap-1">
                    ✓ Arquivo salvo
                  </span>
                )}
              </div>
              <input
                id="content-upload"
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "content")}
                accept={
                  formData.type === "video"
                    ? "video/*"
                    : formData.type === "pdf"
                    ? "application/pdf"
                    : "image/*"
                }
              />
              
              {/* Preview do conteúdo */}
              {formData.content_url && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border">
                  <p className="text-xs font-medium mb-2 text-muted-foreground">Preview:</p>
                  {formData.type === "video" && (
                    <div className="bg-background rounded border border-border overflow-hidden">
                      <video src={formData.content_url} controls className="w-full max-h-48" />
                    </div>
                  )}
                  {formData.type === "pdf" && (
                    <div className="flex items-center gap-2 p-3 bg-background rounded border border-border">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">PDF carregado</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{formData.content_url}</p>
                      </div>
                      <a 
                        href={formData.content_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Abrir
                      </a>
                    </div>
                  )}
                  {formData.type === "image" && (
                    <div className="bg-background rounded border border-border overflow-hidden">
                      <img src={formData.content_url} alt="Preview" className="w-full max-h-48 object-contain" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Label>Upload de Capa (Thumbnail)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("thumbnail-upload")?.click()}
                disabled={uploading}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Enviando..." : "Escolher Imagem"}
              </Button>
              {formData.thumbnail_url && (
                <span className="text-sm text-success flex items-center gap-1">
                  ✓ Capa salva
                </span>
              )}
            </div>
            <input
              id="thumbnail-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(e, "thumbnail")}
              accept="image/*"
            />
            
            {/* Preview da capa */}
            {formData.thumbnail_url && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs font-medium mb-2 text-muted-foreground">Preview da Capa:</p>
                <img src={formData.thumbnail_url} alt="Capa" className="w-full max-h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="xp_reward">Recompensa em XP</Label>
              <Input
                id="xp_reward"
                type="number"
                value={formData.xp_reward}
                onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duração (minutos)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading}>
              {lesson ? "Salvar Alterações" : "Cadastrar Aula"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
