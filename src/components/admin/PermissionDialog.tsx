import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";
import { AVAILABLE_PERMISSIONS, PermissionKey } from "@/hooks/useUserPermissions";

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
}

interface Permission {
  permission_key: string;
  granted: boolean;
}

export function PermissionDialog({
  open,
  onOpenChange,
  userId,
  userEmail,
}: PermissionDialogProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPermissions();
    }
  }, [open, userId]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_user_permissions", {
        _user_id: userId,
      });

      if (error) throw error;

      const permMap: Record<string, boolean> = {};
      data?.forEach((p: Permission) => {
        permMap[p.permission_key] = p.granted;
      });
      setPermissions(permMap);
    } catch (error: any) {
      toast.error("Erro ao carregar permissões: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (permKey: string, granted: boolean) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("user_permissions").upsert({
        user_id: userId,
        permission_key: permKey,
        granted,
      });

      if (error) throw error;

      setPermissions((prev) => ({ ...prev, [permKey]: granted }));
      toast.success(granted ? "Permissão concedida" : "Permissão revogada");
    } catch (error: any) {
      toast.error("Erro ao atualizar permissão: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const groupPermissions = () => {
    const groups: Record<string, [PermissionKey, string][]> = {
      "Cursos": [],
      "Módulos": [],
      "Aulas": [],
      "Usuários": [],
      "Vendas": [],
      "Planos": [],
      "Questões": [],
      "Analytics": [],
      "Escola": [],
    };

    Object.entries(AVAILABLE_PERMISSIONS).forEach(([key, label]) => {
      const permKey = key as PermissionKey;
      if (key.startsWith("courses.")) groups["Cursos"].push([permKey, label]);
      else if (key.startsWith("modules.")) groups["Módulos"].push([permKey, label]);
      else if (key.startsWith("lessons.")) groups["Aulas"].push([permKey, label]);
      else if (key.startsWith("users.")) groups["Usuários"].push([permKey, label]);
      else if (key.startsWith("sales.")) groups["Vendas"].push([permKey, label]);
      else if (key.startsWith("plans.")) groups["Planos"].push([permKey, label]);
      else if (key.startsWith("questions.")) groups["Questões"].push([permKey, label]);
      else if (key.startsWith("analytics.")) groups["Analytics"].push([permKey, label]);
      else if (key.startsWith("school.")) groups["Escola"].push([permKey, label]);
    });

    return groups;
  };

  const groupedPermissions = groupPermissions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gerenciar Permissões
          </DialogTitle>
          <DialogDescription>
            Defina permissões específicas para: <strong>{userEmail}</strong>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([group, perms]) => (
                <div key={group}>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                    {group}
                  </h3>
                  <div className="space-y-3">
                    {perms.map(([permKey, label]) => (
                      <div
                        key={permKey}
                        className="flex items-center justify-between py-2"
                      >
                        <Label htmlFor={permKey} className="cursor-pointer">
                          {label}
                        </Label>
                        <Switch
                          id={permKey}
                          checked={permissions[permKey] || false}
                          onCheckedChange={(checked) =>
                            handleTogglePermission(permKey, checked)
                          }
                          disabled={saving}
                        />
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
