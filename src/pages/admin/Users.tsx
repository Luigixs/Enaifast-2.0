import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, UserPlus, Filter, Search, MessageSquare, FileText, Edit, Trash2, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { UserEnrollmentsDialog } from "@/components/admin/users/UserEnrollmentsDialog";
import { UserMessageDialog } from "@/components/admin/users/UserMessageDialog";
import { UserEditDialog } from "@/components/admin/users/UserEditDialog";
import { UserDeleteDialog } from "@/components/admin/users/UserDeleteDialog";
import { UserCreateDialog } from "@/components/admin/users/UserCreateDialog";
import { UserFiltersDialog } from "@/components/admin/users/UserFiltersDialog";

interface User {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}

interface Profile {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  is_active: boolean;
  last_access: string | null;
}

interface UserWithProfile extends User {
  profile?: Profile;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Dialog states
  const [enrollmentsDialog, setEnrollmentsDialog] = useState({ open: false, userId: '', userName: '' });
  const [messageDialog, setMessageDialog] = useState({ open: false, userId: '', userName: '', userEmail: '', userWhatsapp: '' });
  const [editDialog, setEditDialog] = useState({ open: false, userId: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: '', userName: '' });
  const [createDialog, setCreateDialog] = useState(false);
  const [filtersDialog, setFiltersDialog] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    role: 'all',
    isActive: 'all',
    sortBy: 'name_asc'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase.rpc('get_users_with_roles');
      
      if (usersError) throw usersError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const usersWithProfiles = (usersData || []).map(user => ({
        ...user,
        profile: profilesData?.find(p => p.user_id === user.user_id)
      }));

      setUsers(usersWithProfiles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, is_active: isActive }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error updating user status:', error);
      toast.error('Erro ao atualizar status do usuário');
    } else {
      setUsers(prev =>
        prev.map(u =>
          u.user_id === userId
            ? { ...u, profile: { ...u.profile!, is_active: isActive } }
            : u
        )
      );
      toast.success('Status atualizado com sucesso');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user' | 'professor') => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole as any })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      toast.error('Erro ao atualizar perfil do usuário');
    } else {
      setUsers(prev =>
        prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u)
      );
      toast.success('Perfil atualizado com sucesso');
    }
  };

  // CSV Functions
  const generateCSVTemplate = () => {
    const template = `email,full_name,phone,whatsapp,role,password
exemplo@email.com,João Silva,(11) 98765-4321,(11) 98765-4321,user,senha123
exemplo2@email.com,Maria Santos,(11) 91234-5678,(11) 91234-5678,professor,senha456`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_usuarios.csv';
    link.click();
    toast.success('Template baixado com sucesso');
  };

  const downloadCSV = () => {
    const headers = ['Email', 'Nome', 'Perfil', 'Telefone', 'WhatsApp', 'Ativo', 'Data Cadastro', 'Último Acesso'];
    const rows = filteredUsers.map(user => [
      user.email,
      user.profile?.full_name || 'Sem nome',
      roleLabels[user.role] || user.role,
      user.profile?.phone || '',
      user.profile?.whatsapp || '',
      user.profile?.is_active ? 'Sim' : 'Não',
      user.created_at ? format(new Date(user.created_at), 'dd/MM/yyyy') : '',
      user.profile?.last_access ? format(new Date(user.profile.last_access), 'dd/MM/yyyy HH:mm') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('CSV exportado com sucesso');
  };

  const handleUploadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        let successCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          
          if (values.length < 6) continue;

          try {
            const [email, full_name, phone, whatsapp, role, password] = values;
            
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: { data: { full_name } }
            });

            if (error) throw error;
            if (!data.user) continue;

            await supabase.from('profiles').upsert({
              user_id: data.user.id,
              full_name,
              phone,
              whatsapp,
              is_active: true
            });

            await supabase.from('user_roles').insert({
              user_id: data.user.id,
              role: role as any
            });

            successCount++;
          } catch (err) {
            console.error('Error creating user from CSV:', err);
            errorCount++;
          }
        }

        toast.success(`${successCount} usuário(s) importado(s) com sucesso${errorCount > 0 ? `, ${errorCount} erro(s)` : ''}`);
        fetchUsers();
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Erro ao processar arquivo CSV');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Apply filters and sorting
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesActive = filters.isActive === 'all' || 
                         (filters.isActive === 'true' ? user.profile?.is_active : !user.profile?.is_active);
    
    return matchesSearch && matchesRole && matchesActive;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'name_asc':
        return (a.profile?.full_name || '').localeCompare(b.profile?.full_name || '');
      case 'name_desc':
        return (b.profile?.full_name || '').localeCompare(a.profile?.full_name || '');
      case 'date_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'date_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'access_desc':
        const aAccess = a.profile?.last_access ? new Date(a.profile.last_access).getTime() : 0;
        const bAccess = b.profile?.last_access ? new Date(b.profile.last_access).getTime() : 0;
        return bAccess - aAccess;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    user: 'Aluno',
    professor: 'Professor'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb 
        items={[
          { label: "Gestão", href: "/admin" },
          { label: "Gerenciar Usuários" }
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleUploadCSV}
            className="hidden"
            id="csv-upload"
          />
          <Button variant="outline" size="sm" onClick={() => document.getElementById('csv-upload')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={generateCSVTemplate}>
            <FileText className="w-4 h-4 mr-2" />
            Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCreateDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Cadastrar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFiltersDialog(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Nome ↑</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Cadastro ↑</TableHead>
              <TableHead>Último Acesso ↑</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <p className="text-muted-foreground">Carregando usuários...</p>
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(user.user_id)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedUsers);
                        if (checked) {
                          newSelected.add(user.user_id);
                        } else {
                          newSelected.delete(user.user_id);
                        }
                        setSelectedUsers(newSelected);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-primary">
                        {user.profile?.full_name || 'Sem nome'}
                      </div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.user_id, value as 'admin' | 'user' | 'professor')}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Aluno</SelectItem>
                        <SelectItem value="professor">Professor</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {user.profile?.whatsapp && (
                      <Button variant="ghost" size="sm" className="text-green-500">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.profile?.is_active ?? true}
                      onCheckedChange={(checked) => handleToggleActive(user.user_id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    {user.created_at ? format(new Date(user.created_at), 'dd/MM/yy') : '-'}
                  </TableCell>
                  <TableCell>
                    {user.profile?.last_access ? format(new Date(user.profile.last_access), 'dd/MM/yy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => setEnrollmentsDialog({ 
                          open: true, 
                          userId: user.user_id, 
                          userName: user.profile?.full_name || user.email 
                        })}
                        title="Ver matrículas e analytics"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-purple-500 hover:text-purple-600"
                        onClick={() => setMessageDialog({ 
                          open: true, 
                          userId: user.user_id, 
                          userName: user.profile?.full_name || user.email,
                          userEmail: user.email,
                          userWhatsapp: user.profile?.whatsapp || ''
                        })}
                        title="Enviar mensagem"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => setEditDialog({ open: true, userId: user.user_id })}
                        title="Editar usuário"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setDeleteDialog({ 
                          open: true, 
                          userId: user.user_id, 
                          userName: user.profile?.full_name || user.email 
                        })}
                        title="Remover usuário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Encontramos {filteredUsers.length} usuário(s) em {totalPages} página(s).
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 por página</SelectItem>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="25">25 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return pageNum <= totalPages ? (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ) : null;
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              »
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <UserEnrollmentsDialog
        open={enrollmentsDialog.open}
        onOpenChange={(open) => setEnrollmentsDialog({ ...enrollmentsDialog, open })}
        userId={enrollmentsDialog.userId}
        userName={enrollmentsDialog.userName}
      />

      <UserMessageDialog
        open={messageDialog.open}
        onOpenChange={(open) => setMessageDialog({ ...messageDialog, open })}
        userName={messageDialog.userName}
        userEmail={messageDialog.userEmail}
        userWhatsapp={messageDialog.userWhatsapp}
      />

      <UserEditDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
        userId={editDialog.userId}
        onUpdate={fetchUsers}
      />

      <UserDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        userId={deleteDialog.userId}
        userName={deleteDialog.userName}
        onDelete={fetchUsers}
      />

      <UserCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onCreate={fetchUsers}
      />

      <UserFiltersDialog
        open={filtersDialog}
        onOpenChange={setFiltersDialog}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={() => setCurrentPage(1)}
        onClear={() => {
          setFilters({ role: 'all', isActive: 'all', sortBy: 'name_asc' });
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
