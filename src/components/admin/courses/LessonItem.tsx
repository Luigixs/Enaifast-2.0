import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LessonItemProps {
  lesson: any;
  onEdit: () => void;
  onDelete: () => void;
}

export function LessonItem({ lesson, onEdit, onDelete }: LessonItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: lesson.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-2 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-medium">{lesson.name}</p>
            <p className="text-xs text-muted-foreground">
              {lesson.type === "video" && "📹 Vídeo"}
              {lesson.type === "pdf" && "📄 PDF"}
              {lesson.type === "image" && "🖼️ Imagem"}
              {lesson.type === "text" && "📝 Texto"}
            </p>
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
    </Card>
  );
}
