import { useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useModules } from "@/hooks/useModules";
import { ModuleForm } from "@/components/admin/courses/ModuleForm";
import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ModuleSection } from "@/components/admin/courses/ModuleSection";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function CourseDetail() {
  const { id } = useParams();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [moduleFormOpen, setModuleFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { modules, createModule, updateModule, deleteModule, reorderModules } = useModules(id);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleModuleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((m) => m.id === active.id);
    const newIndex = modules.findIndex((m) => m.id === over.id);

    const reorderedModules = arrayMove(modules, oldIndex, newIndex);
    const updates = reorderedModules.map((module, index) => ({
      id: module.id,
      order_index: index,
    }));

    reorderModules.mutate(updates);
  };

  const handleModuleSubmit = (module: any) => {
    if (editingModule) {
      updateModule.mutate({ ...module, id: editingModule.id });
    } else {
      createModule.mutate(module);
    }
    setEditingModule(null);
  };

  if (!course) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Gestão" }, { label: "Cursos", href: "/admin/courses" }, { label: course.name }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{course.name}</h1>
      </div>
      <Tabs defaultValue="conteudo" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 space-x-6">
          <TabsTrigger value="conteudo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3">Conteúdo</TabsTrigger>
          <TabsTrigger value="dados" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3">Dados</TabsTrigger>
          <TabsTrigger value="banners" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3">Banners</TabsTrigger>
          <TabsTrigger value="arquivos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3">Arquivos</TabsTrigger>
          <TabsTrigger value="alunos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3">Alunos</TabsTrigger>
        </TabsList>
        <TabsContent value="conteudo" className="mt-6 space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleModuleDragEnd}
          >
            <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              {modules.map((module) => (
                <ModuleSection
                  key={module.id}
                  module={module}
                  isExpanded={expandedModules.has(module.id)}
                  onToggle={() => toggleModule(module.id)}
                  onEdit={() => {
                    setEditingModule(module);
                    setModuleFormOpen(true);
                  }}
                  onDelete={() => setDeleteModuleId(module.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button
            className="w-full gap-2"
            onClick={() => {
              setEditingModule(null);
              setModuleFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Cadastrar novo Módulo
          </Button>
        </TabsContent>
        <TabsContent value="dados" className="mt-6"><div className="text-center py-12 text-muted-foreground">Aba de Dados em construção</div></TabsContent>
        <TabsContent value="banners" className="mt-6"><div className="text-center py-12 text-muted-foreground">Aba de Banners em construção</div></TabsContent>
        <TabsContent value="arquivos" className="mt-6"><div className="text-center py-12 text-muted-foreground">Aba de Arquivos em construção</div></TabsContent>
        <TabsContent value="alunos" className="mt-6"><div className="text-center py-12 text-muted-foreground">Aba de Alunos em construção</div></TabsContent>
      </Tabs>
      {id && (
        <ModuleForm
          open={moduleFormOpen}
          onOpenChange={setModuleFormOpen}
          onSubmit={handleModuleSubmit}
          courseId={id}
          module={editingModule}
        />
      )}
      <AlertDialog open={!!deleteModuleId} onOpenChange={() => setDeleteModuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Módulo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza? Todas as aulas e submódulos serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteModuleId) {
                  deleteModule.mutate(deleteModuleId);
                  setDeleteModuleId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
