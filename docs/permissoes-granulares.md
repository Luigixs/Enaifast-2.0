# Sistema de Permissões Granulares

O sistema de permissões granulares permite que administradores definam ações específicas que cada usuário pode realizar, indo além dos roles básicos (admin, professor, aluno).

## Como Funciona

### 1. Estrutura de Permissões

As permissões são organizadas por categorias:

- **Cursos**: `courses.create`, `courses.edit`, `courses.delete`, `courses.view`
- **Módulos**: `modules.create`, `modules.edit`, `modules.delete`
- **Aulas**: `lessons.create`, `lessons.edit`, `lessons.delete`
- **Usuários**: `users.view`, `users.edit`, `users.delete`, `users.manage_roles`, `users.manage_permissions`
- **Vendas**: `sales.view`, `sales.create`, `sales.edit`
- **Planos**: `plans.view`, `plans.create`, `plans.edit`, `plans.delete`
- **Questões**: `questions.view`, `questions.create`, `questions.edit`, `questions.delete`
- **Analytics**: `analytics.view_all`, `analytics.view_own`
- **Escola**: `school.manage`

### 2. Gerenciamento pelo Admin

1. Acesse **Admin → Gerenciar Roles** no menu lateral
2. Localize o usuário pelo email
3. Clique em **"Gerenciar"** na coluna de Permissões
4. Ative/desative permissões específicas usando os switches
5. As alterações são salvas automaticamente

### 3. Hierarquia de Permissões

O sistema funciona com a seguinte hierarquia:

1. **Admin**: Tem TODAS as permissões automaticamente
2. **Permissões Específicas**: Verificadas individualmente por usuário
3. **Role Padrão**: Permissões baseadas no role (professor, aluno)

Exemplo: Um usuário com role "aluno" pode receber a permissão específica `courses.create`, permitindo criar cursos mesmo não sendo admin.

## Como Usar no Código

### Hook useUserPermissions

```typescript
import { useUserPermissions } from "@/hooks/useUserPermissions";

function MyComponent() {
  const { hasPermission } = useUserPermissions();
  
  if (hasPermission("courses.create")) {
    return <CreateCourseButton />;
  }
  
  return null;
}
```

### Componente PermissionGuard

```typescript
import { PermissionGuard } from "@/components/PermissionGuard";

function CoursesPage() {
  return (
    <div>
      <h1>Cursos</h1>
      
      <PermissionGuard permission="courses.create">
        <Button>Criar Novo Curso</Button>
      </PermissionGuard>
      
      <PermissionGuard 
        permission="courses.delete"
        fallback={<p>Você não pode deletar cursos</p>}
      >
        <DeleteButton />
      </PermissionGuard>
    </div>
  );
}
```

### Mensagem de Permissão Negada

```typescript
import { PermissionMessage } from "@/components/PermissionGuard";

function AdminPanel() {
  return (
    <div>
      <PermissionMessage 
        permissions={["users.manage_roles", "users.manage_permissions"]}
        message="Você precisa de permissão para gerenciar usuários"
      />
      
      {/* Resto do conteúdo */}
    </div>
  );
}
```

### Hook usePermissions (Simplificado)

Para verificações comuns, use o hook `usePermissions`:

```typescript
import { usePermissions } from "@/hooks/usePermissions";

function Dashboard() {
  const { canManageCourses, canViewAnalytics } = usePermissions();
  
  return (
    <div>
      {canManageCourses && <CoursesPanel />}
      {canViewAnalytics && <AnalyticsPanel />}
    </div>
  );
}
```

## Casos de Uso

### 1. Professor com Permissões Limitadas

Um professor pode ter:
- ✅ `courses.create` - Criar cursos
- ✅ `lessons.edit` - Editar suas aulas
- ✅ `analytics.view_own` - Ver analytics dos próprios cursos
- ❌ `users.manage_roles` - NÃO pode gerenciar usuários

### 2. Coordenador

Um coordenador pode ter:
- ✅ `courses.edit` - Editar todos os cursos
- ✅ `users.view` - Ver lista de usuários
- ✅ `analytics.view_all` - Ver analytics de todos
- ❌ `users.delete` - NÃO pode deletar usuários
- ❌ `school.manage` - NÃO pode alterar configurações da escola

### 3. Gestor de Conteúdo

Um gestor pode ter:
- ✅ `courses.create`, `courses.edit`
- ✅ `modules.create`, `modules.edit`
- ✅ `lessons.create`, `lessons.edit`
- ✅ `questions.create`, `questions.edit`
- ❌ Sem acesso a vendas ou gerenciamento de usuários

## Banco de Dados

### Tabela user_permissions

```sql
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  permission_key TEXT NOT NULL,
  granted BOOLEAN DEFAULT true,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission_key)
);
```

### Funções SQL

- `has_permission(_user_id, _permission_key)`: Verifica se usuário tem permissão
- `get_user_permissions(_user_id)`: Retorna todas as permissões de um usuário

## Segurança

- ✅ **RLS Habilitado**: Apenas admins podem gerenciar permissões
- ✅ **Security Definer**: Funções SQL protegidas contra recursão
- ✅ **Auditoria**: Rastreamento de quem concedeu cada permissão
- ✅ **Admin Sempre Autorizado**: Admins nunca perdem acesso

## Boas Práticas

1. **Princípio do Menor Privilégio**: Conceda apenas as permissões necessárias
2. **Revise Periodicamente**: Audite permissões regularmente
3. **Use Roles como Base**: Defina um role adequado antes de adicionar permissões específicas
4. **Documente Exceções**: Anote por que um usuário tem permissões especiais
5. **Teste Permissões**: Sempre teste após conceder novas permissões
