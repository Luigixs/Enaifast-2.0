import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourses, Course } from "@/hooks/useCourses";
import { CourseForm } from "@/components/admin/courses/CourseForm";
import { Search, Plus, Filter, Pencil, Trash2, GripVertical } from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

function SortableCourseRow({ course, onEdit, onDelete, onUpdateStatus, onToggleFreeAccess }: {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onToggleFreeAccess: (id: string, value: boolean) => void;
}) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="p-2 sm:p-4">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing hover:text-primary transition-colors">
          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        </button>
      </td>
      <td className="p-2 sm:p-4">
        <button onClick={() => navigate(`/admin/courses/${course.id}`)} className="text-left hover:text-primary transition-colors">
          <div className="font-medium text-sm sm:text-base">{course.name}</div>
          <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">{course.description || "Sem descrição"}</div>
        </button>
      </td>
      <td className="p-2 sm:p-4">
        <Switch
          checked={course.is_free_access}
          onCheckedChange={(checked) => onToggleFreeAccess(course.id, checked)}
          className="scale-75 sm:scale-100"
        />
      </td>
      <td className="p-2 sm:p-4">
        <Select
          value={course.status}
          onValueChange={(value) => onUpdateStatus(course.id, value)}
        >
          <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="published">Liberado</SelectItem>
            <SelectItem value="coming_soon">Em Breve</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground hidden md:table-cell">{formatDate(course.created_at)}</td>
      <td className="p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground hidden lg:table-cell">{formatDate(course.end_date)}</td>
      <td className="p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground hidden md:table-cell">{course.total_enrolled}</td>
      <td className="p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground hidden lg:table-cell">{course.total_completed}</td>
      <td className="p-2 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 text-primary" onClick={() => onEdit(course)}>
            <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 text-destructive" onClick={() => onDelete(course.id)}>
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const { courses, isLoading, createCourse, updateCourse, deleteCourse, reorderCourses } = useCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredCourses.findIndex((c) => c.id === active.id);
      const newIndex = filteredCourses.findIndex((c) => c.id === over.id);

      const newOrder = arrayMove(filteredCourses, oldIndex, newIndex);
      const updates = newOrder.map((course, index) => ({
        id: course.id,
        order_index: index,
      }));

      reorderCourses.mutate(updates);
    }
  };

  const handleCreate = (course: Partial<Course>) => {
    createCourse.mutate(course);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const handleUpdate = (updates: Partial<Course>) => {
    if (editingCourse) {
      updateCourse.mutate({ id: editingCourse.id, ...updates });
      setEditingCourse(null);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCourse.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateCourse.mutate({ id, status } as any);
  };

  const handleToggleFreeAccess = (id: string, value: boolean) => {
    updateCourse.mutate({ id, is_free_access: value });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumb items={[{ label: "Gestão" }, { label: "Cursos" }]} />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none" onClick={() => {
            setEditingCourse(null);
            setFormOpen(true);
          }}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Cadastrar</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full"  style={{ minWidth: '800px' }}>
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground w-12">Ordem</th>
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground">Curso</th>
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground">Livre</th>
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">Cadastrado</th>
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden lg:table-cell">Conclusão</th>
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">Inscritos</th>
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden lg:table-cell">Concluintes</th>
                  <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="p-6 sm:p-8 text-center text-sm text-muted-foreground">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-6 sm:p-8 text-center text-sm text-muted-foreground">
                      Nenhum curso encontrado
                    </td>
                  </tr>
                ) : (
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filteredCourses.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                      {filteredCourses.map((course) => (
                        <SortableCourseRow
                          key={course.id}
                          course={course}
                          onEdit={handleEdit}
                          onDelete={(id) => setDeleteId(id)}
                          onUpdateStatus={handleUpdateStatus}
                          onToggleFreeAccess={handleToggleFreeAccess}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CourseForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingCourse(null);
        }}
        onSubmit={editingCourse ? handleUpdate : handleCreate}
        course={editingCourse}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Curso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
