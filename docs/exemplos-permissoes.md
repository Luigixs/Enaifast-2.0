# Exemplos Práticos de Uso de Permissões

Este documento contém exemplos práticos de como aplicar o sistema de permissões granulares em diferentes partes do sistema.

## 1. Página de Cursos

```typescript
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { PermissionGuard } from "@/components/PermissionGuard";

function CoursesPage() {
  const { hasPermission } = useUserPermissions();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Cursos</h1>
        
        {/* Botão de criar curso - apenas para quem tem permissão */}
        <PermissionGuard permission="courses.create">
          <Button onClick={handleCreateCourse}>
            <Plus className="mr-2" />
            Criar Curso
          </Button>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {courses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course}
            canEdit={hasPermission("courses.edit")}
            canDelete={hasPermission("courses.delete")}
          />
        ))}
      </div>
    </div>
  );
}
```

## 2. Card de Curso com Ações Condicionais

```typescript
import { PermissionGuard } from "@/components/PermissionGuard";

interface CourseCardProps {
  course: Course;
  canEdit: boolean;
  canDelete: boolean;
}

function CourseCard({ course, canEdit, canDelete }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      
      <CardFooter className="flex gap-2">
        {/* Botão de visualizar - todos podem ver */}
        <Button variant="outline" onClick={() => viewCourse(course.id)}>
          Ver Detalhes
        </Button>
        
        {/* Botão de editar - apenas com permissão */}
        {canEdit && (
          <Button variant="secondary" onClick={() => editCourse(course.id)}>
            <Edit className="mr-2" />
            Editar
          </Button>
        )}
        
        {/* Botão de deletar - apenas com permissão */}
        <PermissionGuard permission="courses.delete">
          <Button 
            variant="destructive" 
            onClick={() => deleteCourse(course.id)}
          >
            <Trash className="mr-2" />
            Deletar
          </Button>
        </PermissionGuard>
      </CardFooter>
    </Card>
  );
}
```

## 3. Formulário de Edição com Campos Condicionais

```typescript
import { useUserPermissions } from "@/hooks/useUserPermissions";

function CourseEditForm({ courseId }: { courseId: string }) {
  const { hasPermission } = useUserPermissions();
  
  const canEditBasicInfo = hasPermission("courses.edit");
  const canEditAdvanced = hasPermission("school.manage");

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos básicos - qualquer um com courses.edit */}
      {canEditBasicInfo && (
        <div className="space-y-4">
          <Input label="Nome do Curso" {...register("name")} />
          <Textarea label="Descrição" {...register("description")} />
          <Input label="Carga Horária" {...register("workload")} />
        </div>
      )}

      {/* Campos avançados - apenas school.manage */}
      {canEditAdvanced && (
        <div className="space-y-4 border-t pt-4 mt-4">
          <h3 className="font-semibold">Configurações Avançadas</h3>
          <Switch label="Acesso Gratuito" {...register("is_free_access")} />
          <Switch label="Certificado Habilitado" {...register("enable_certificates")} />
          <Input label="Nota Mínima" {...register("passing_grade")} />
        </div>
      )}

      {/* Botão de salvar */}
      <Button type="submit" disabled={!canEditBasicInfo}>
        Salvar Alterações
      </Button>
    </form>
  );
}
```

## 4. Menu Lateral Dinâmico

```typescript
import { useUserPermissions } from "@/hooks/useUserPermissions";

function AdminSidebar() {
  const { hasPermission } = useUserPermissions();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      visible: true, // Todos veem
    },
    {
      title: "Cursos",
      url: "/admin/courses",
      icon: BookOpen,
      visible: hasPermission("courses.view") || hasPermission("courses.create"),
    },
    {
      title: "Usuários",
      url: "/admin/users",
      icon: Users,
      visible: hasPermission("users.view"),
    },
    {
      title: "Gerenciar Roles",
      url: "/admin/user-management",
      icon: Shield,
      visible: hasPermission("users.manage_roles"),
    },
    {
      title: "Vendas",
      url: "/admin/sales",
      icon: DollarSign,
      visible: hasPermission("sales.view"),
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {menuItems
            .filter(item => item.visible)
            .map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url}>
                    <item.icon />
                    {item.title}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
```

## 5. Rota Protegida por Permissão

```typescript
import { Navigate } from "react-router-dom";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { PermissionMessage } from "@/components/PermissionGuard";

function ProtectedCourseCreationPage() {
  const { hasPermission, loading } = useUserPermissions();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!hasPermission("courses.create")) {
    return (
      <div className="container py-8">
        <PermissionMessage 
          permissions={["courses.create"]}
          message="Você não tem permissão para criar cursos. Entre em contato com o administrador."
        />
        <Button onClick={() => navigate(-1)} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return <CourseCreationForm />;
}
```

## 6. Tabela com Ações Condicionais

```typescript
import { useUserPermissions } from "@/hooks/useUserPermissions";

function UsersTable({ users }: { users: User[] }) {
  const { hasPermission } = useUserPermissions();

  const canEditUsers = hasPermission("users.edit");
  const canDeleteUsers = hasPermission("users.delete");
  const canManageRoles = hasPermission("users.manage_roles");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          {(canEditUsers || canDeleteUsers || canManageRoles) && (
            <TableHead className="text-right">Ações</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge>{user.role}</Badge>
            </TableCell>
            {(canEditUsers || canDeleteUsers || canManageRoles) && (
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canEditUsers && (
                      <DropdownMenuItem onClick={() => editUser(user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {canManageRoles && (
                      <DropdownMenuItem onClick={() => changeRole(user.id)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Alterar Role
                      </DropdownMenuItem>
                    )}
                    {canDeleteUsers && (
                      <DropdownMenuItem 
                        onClick={() => deleteUser(user.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## 7. Dashboard com Cards Condicionais

```typescript
import { useUserPermissions } from "@/hooks/useUserPermissions";

function AdminDashboard() {
  const { hasPermission } = useUserPermissions();

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Card sempre visível */}
      <DashboardCard
        title="Meus Cursos"
        value={coursesCount}
        icon={BookOpen}
      />

      {/* Card condicional - Analytics */}
      {hasPermission("analytics.view_all") && (
        <DashboardCard
          title="Total de Alunos"
          value={studentsCount}
          icon={Users}
        />
      )}

      {/* Card condicional - Vendas */}
      {hasPermission("sales.view") && (
        <DashboardCard
          title="Vendas do Mês"
          value={formatCurrency(salesTotal)}
          icon={DollarSign}
        />
      )}

      {/* Card condicional - Gestão de Usuários */}
      {hasPermission("users.view") && (
        <DashboardCard
          title="Usuários Ativos"
          value={activeUsersCount}
          icon={UserCheck}
        />
      )}
    </div>
  );
}
```

## 8. API Request com Verificação de Permissão

```typescript
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { toast } from "sonner";

function CourseActions() {
  const { hasPermission } = useUserPermissions();

  const handleDeleteCourse = async (courseId: string) => {
    // Verifica permissão antes de fazer a requisição
    if (!hasPermission("courses.delete")) {
      toast.error("Você não tem permissão para deletar cursos");
      return;
    }

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;
      
      toast.success("Curso deletado com sucesso");
    } catch (error: any) {
      toast.error("Erro ao deletar curso: " + error.message);
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    // Publicar curso requer permissão de edição
    if (!hasPermission("courses.edit")) {
      toast.error("Você não tem permissão para publicar cursos");
      return;
    }

    try {
      const { error } = await supabase
        .from("courses")
        .update({ status: "published" })
        .eq("id", courseId);

      if (error) throw error;
      
      toast.success("Curso publicado com sucesso");
    } catch (error: any) {
      toast.error("Erro ao publicar curso: " + error.message);
    }
  };

  return {
    handleDeleteCourse,
    handlePublishCourse,
  };
}
```

## Resumo de Boas Práticas

1. **Sempre verifique permissões no cliente E no servidor** (RLS)
2. **Esconda elementos que o usuário não pode usar**
3. **Forneça feedback claro quando permissões são negadas**
4. **Use PermissionGuard para elementos visuais**
5. **Use hasPermission para lógica condicional**
6. **Combine múltiplas permissões quando necessário**
7. **Documente quais permissões cada funcionalidade requer**
