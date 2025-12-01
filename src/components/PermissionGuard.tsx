import { ReactNode } from "react";
import { useUserPermissions, PermissionKey } from "@/hooks/useUserPermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

interface PermissionGuardProps {
  permission: PermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para proteger elementos baseado em permissões granulares
 * 
 * Exemplo de uso:
 * <PermissionGuard permission="courses.create">
 *   <Button>Criar Curso</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({ 
  permission, 
  children, 
  fallback 
}: PermissionGuardProps) {
  const { hasPermission, loading } = useUserPermissions();

  if (loading) {
    return null;
  }

  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
}

interface PermissionMessageProps {
  permissions: PermissionKey[];
  message?: string;
}

/**
 * Componente para mostrar mensagem quando usuário não tem permissão
 * 
 * Exemplo de uso:
 * <PermissionMessage 
 *   permissions={["courses.create", "courses.edit"]}
 *   message="Você precisa de permissão para gerenciar cursos"
 * />
 */
export function PermissionMessage({ 
  permissions, 
  message 
}: PermissionMessageProps) {
  const { hasPermission } = useUserPermissions();
  
  const hasAnyPermission = permissions.some(perm => hasPermission(perm));

  if (hasAnyPermission) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertDescription>
        {message || "Você não tem permissão para acessar este recurso."}
      </AlertDescription>
    </Alert>
  );
}
