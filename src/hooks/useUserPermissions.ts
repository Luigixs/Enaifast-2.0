import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Lista de todas as permissões disponíveis no sistema
export const AVAILABLE_PERMISSIONS = {
  // Gestão de Cursos
  "courses.create": "Criar cursos",
  "courses.edit": "Editar cursos",
  "courses.delete": "Deletar cursos",
  "courses.view": "Visualizar cursos",
  
  // Gestão de Módulos
  "modules.create": "Criar módulos",
  "modules.edit": "Editar módulos",
  "modules.delete": "Deletar módulos",
  
  // Gestão de Aulas
  "lessons.create": "Criar aulas",
  "lessons.edit": "Editar aulas",
  "lessons.delete": "Deletar aulas",
  
  // Gestão de Usuários
  "users.view": "Visualizar usuários",
  "users.edit": "Editar usuários",
  "users.delete": "Deletar usuários",
  "users.manage_roles": "Gerenciar roles de usuários",
  "users.manage_permissions": "Gerenciar permissões de usuários",
  
  // Gestão de Vendas
  "sales.view": "Visualizar vendas",
  "sales.create": "Criar vendas",
  "sales.edit": "Editar vendas",
  
  // Gestão de Planos
  "plans.view": "Visualizar planos",
  "plans.create": "Criar planos",
  "plans.edit": "Editar planos",
  "plans.delete": "Deletar planos",
  
  // Gestão de Questões
  "questions.view": "Visualizar questões",
  "questions.create": "Criar questões",
  "questions.edit": "Editar questões",
  "questions.delete": "Deletar questões",
  
  // Analytics
  "analytics.view_all": "Visualizar analytics de todos",
  "analytics.view_own": "Visualizar próprio analytics",
  
  // Escola
  "school.manage": "Gerenciar configurações da escola",
} as const;

export type PermissionKey = keyof typeof AVAILABLE_PERMISSIONS;

interface UserPermission {
  permission_key: string;
  granted: boolean;
  granted_at: string;
}

export function useUserPermissions(userId?: string) {
  const { user, role } = useAuth();
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    fetchPermissions();
  }, [targetUserId]);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase.rpc("get_user_permissions", {
        _user_id: targetUserId,
      });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permissionKey: PermissionKey): boolean => {
    // Admin tem TODAS as permissões sem exceção
    if (role === "admin") return true;

    // Verifica se tem permissão específica concedida
    const permission = permissions.find((p) => p.permission_key === permissionKey);
    return permission?.granted || false;
  };

  const canPerform = (permissionKey: PermissionKey): boolean => {
    return hasPermission(permissionKey);
  };

  return {
    permissions,
    loading,
    hasPermission,
    canPerform,
    refreshPermissions: fetchPermissions,
  };
}
