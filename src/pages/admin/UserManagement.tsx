import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Shield, UserCheck, GraduationCap, Settings } from "lucide-react";
import { PermissionDialog } from "@/components/admin/PermissionDialog";

type UserRole = "admin" | "user" | "professor";

interface User {
  user_id: string;
  email: string;
  role: UserRole | null;
  created_at: string;
}

const roleIcons = {
  admin: Shield,
  professor: GraduationCap,
  user: UserCheck,
};

const roleColors = {
  admin: "bg-destructive text-destructive-foreground",
  professor: "bg-primary text-primary-foreground",
  user: "bg-secondary text-secondary-foreground",
};

const roleLabels = {
  admin: "Administrador",
  professor: "Professor",
  user: "Aluno",
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc("get_users_with_roles");
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar usuários: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdating(userId);
    
    try {
      // Delete existing role
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Insert new role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });

      if (insertError) throw insertError;

      toast.success("Role alterado com sucesso!");
      fetchUsers();
    } catch (error: any) {
      toast.error("Erro ao alterar role: " + error.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleOpenPermissions = (userId: string, email: string) => {
    setSelectedUser({ id: userId, email });
    setPermissionDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Usuários</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os roles dos usuários do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Total de {users.length} usuário(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role Atual</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Role</TableHead>
                <TableHead className="text-right">Permissões</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const Icon = user.role ? roleIcons[user.role] : UserCheck;
                return (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {user.role ? (
                        <Badge className={roleColors[user.role]}>
                          <Icon className="w-3 h-3 mr-1" />
                          {roleLabels[user.role]}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Sem role</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={user.role || "user"}
                        onValueChange={(value) =>
                          handleRoleChange(user.user_id, value as UserRole)
                        }
                        disabled={updating === user.user_id}
                      >
                        <SelectTrigger className="w-[140px] ml-auto">
                          {updating === user.user_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4" />
                              Aluno
                            </div>
                          </SelectItem>
                          <SelectItem value="professor">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              Professor
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Administrador
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPermissions(user.user_id, user.email)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Gerenciar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário cadastrado
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <PermissionDialog
          open={permissionDialogOpen}
          onOpenChange={setPermissionDialogOpen}
          userId={selectedUser.id}
          userEmail={selectedUser.email}
        />
      )}
    </div>
  );
}
