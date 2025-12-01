import { useUserPermissions } from "@/hooks/useUserPermissions";

/**
 * Hook para verificar permissões baseadas em roles e permissões granulares
 */
export function usePermissions() {
  const { hasPermission } = useUserPermissions();

  const permissions = {
    // Admin e permissões específicas
    canManageUsers: hasPermission("users.manage_roles"),
    canManageCourses: hasPermission("courses.create") || hasPermission("courses.edit"),
    canManageSchool: hasPermission("school.manage"),
    canManageSales: hasPermission("sales.view") || hasPermission("sales.create"),
    canManagePlans: hasPermission("plans.create") || hasPermission("plans.edit"),
    canManageQuestions: hasPermission("questions.create") || hasPermission("questions.edit"),
    
    // Professor e permissões específicas
    canCreateContent: hasPermission("courses.create") || hasPermission("lessons.create"),
    canEditContent: hasPermission("courses.edit") || hasPermission("lessons.edit"),
    canViewAnalytics: hasPermission("analytics.view_all") || hasPermission("analytics.view_own"),
    
    // Permissões de visualização
    canAccessCourses: hasPermission("courses.view"),
    canAccessCommunity: true,
    canAccessLive: true,
    canViewContent: true,
  };

  return permissions;
}
