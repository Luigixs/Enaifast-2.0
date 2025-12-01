import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, GripVertical, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSubmodules } from "@/hooks/useSubmodules";
import { useLessons } from "@/hooks/useLessons";
import { SubmoduleForm } from "./SubmoduleForm";
import { LessonForm } from "./LessonForm";
import { SubmoduleSection } from "./SubmoduleSection";
import { LessonItem } from "./LessonItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ModuleSectionProps {
  module: any;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ModuleSection({ module, isExpanded, onToggle, onEdit, onDelete }: ModuleSectionProps) {
  const [submoduleFormOpen, setSubmoduleFormOpen] = useState(false);
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [editingSubmodule, setEditingSubmodule] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: module.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { submodules, createSubmodule, updateSubmodule, deleteSubmodule, reorderSubmodules } =
    useSubmodules(module.id);
  const { lessons, createLesson, updateLesson, deleteLesson, reorderLessons } = useLessons(
    module.id,
    undefined
  );

  const handleSubmoduleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = submodules.findIndex((s) => s.id === active.id);
    const newIndex = submodules.findIndex((s) => s.id === over.id);

    const reorderedSubmodules = arrayMove(submodules, oldIndex, newIndex);
    const updates = reorderedSubmodules.map((submodule, index) => ({
      id: submodule.id,
      order_index: index,
    }));

    reorderSubmodules.mutate(updates);
  };

  const handleLessonDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessons.findIndex((l) => l.id === active.id);
    const newIndex = lessons.findIndex((l) => l.id === over.id);

    const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);
    const updates = reorderedLessons.map((lesson, index) => ({
      id: lesson.id,
      order_index: index,
    }));

    reorderLessons.mutate(updates);
  };

  const handleSubmoduleSubmit = (submodule: any) => {
    if (editingSubmodule) {
      updateSubmodule.mutate({ ...submodule, id: editingSubmodule.id });
    } else {
      createSubmodule.mutate(submodule);
    }
    setEditingSubmodule(null);
  };

  const handleLessonSubmit = (lesson: any) => {
    if (editingLesson) {
      updateLesson.mutate({ ...lesson, id: editingLesson.id });
    } else {
      createLesson.mutate({ ...lesson, module_id: module.id, submodule_id: null });
    }
    setEditingLesson(null);
  };

  return (
    <>
      <Card ref={setNodeRef} style={style} className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1">
              <h3 className="font-semibold">{module.name}</h3>
              {module.description && (
                <p className="text-sm text-muted-foreground">{module.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 ml-8 space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingSubmodule(null);
                  setSubmoduleFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Submódulo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingLesson(null);
                  setLessonFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Aula
              </Button>
            </div>

            {submodules.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Submódulos:</h4>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleSubmoduleDragEnd}
                >
                  <SortableContext items={submodules.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                    {submodules.map((submodule) => (
                      <SubmoduleSection
                        key={submodule.id}
                        submodule={submodule}
                        onEdit={() => {
                          setEditingSubmodule(submodule);
                          setSubmoduleFormOpen(true);
                        }}
                        onDelete={() => deleteSubmodule.mutate(submodule.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {lessons.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Aulas:</h4>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleLessonDragEnd}
                >
                  <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    {lessons.map((lesson) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        onEdit={() => {
                          setEditingLesson(lesson);
                          setLessonFormOpen(true);
                        }}
                        onDelete={() => deleteLesson.mutate(lesson.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        )}
      </Card>

      <SubmoduleForm
        open={submoduleFormOpen}
        onOpenChange={setSubmoduleFormOpen}
        onSubmit={handleSubmoduleSubmit}
        moduleId={module.id}
        submodule={editingSubmodule}
      />

      <LessonForm
        open={lessonFormOpen}
        onOpenChange={setLessonFormOpen}
        onSubmit={handleLessonSubmit}
        moduleId={module.id}
        submoduleId={null}
        lesson={editingLesson}
      />
    </>
  );
}
