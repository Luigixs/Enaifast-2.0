import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, GripVertical, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLessons } from "@/hooks/useLessons";
import { LessonForm } from "./LessonForm";
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

interface SubmoduleSectionProps {
  submodule: any;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubmoduleSection({ submodule, onEdit, onDelete }: SubmoduleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: submodule.id,
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

  const { lessons, createLesson, updateLesson, deleteLesson, reorderLessons } = useLessons(
    undefined,
    submodule.id
  );

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

  const handleLessonSubmit = (lesson: any) => {
    if (editingLesson) {
      updateLesson.mutate({ ...lesson, id: editingLesson.id });
    } else {
      createLesson.mutate({ ...lesson, module_id: null, submodule_id: submodule.id });
    }
    setEditingLesson(null);
  };

  return (
    <>
      <Card ref={setNodeRef} style={style} className="p-3 bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{submodule.name}</h4>
              {submodule.description && (
                <p className="text-xs text-muted-foreground">{submodule.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 ml-6 space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingLesson(null);
                setLessonFormOpen(true);
              }}
            >
              <Plus className="h-3 w-3 mr-2" />
              Adicionar Aula
            </Button>

            {lessons.length > 0 && (
              <div className="space-y-2">
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

      <LessonForm
        open={lessonFormOpen}
        onOpenChange={setLessonFormOpen}
        onSubmit={handleLessonSubmit}
        moduleId={null}
        submoduleId={submodule.id}
        lesson={editingLesson}
      />
    </>
  );
}
