import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NotificationSetting {
  id: string;
  role: string;
  notification_type: string;
  enabled: boolean;
}

const notificationLabels: Record<string, string> = {
  course_enrollment: "Matrícula em curso",
  lesson_completion: "Conclusão de aula",
  achievement_unlocked: "Conquista desbloqueada",
  new_lesson: "Nova aula disponível",
  comment_reply: "Resposta em comentário",
  new_student: "Novo aluno",
  course_completion: "Conclusão de curso",
  student_question: "Pergunta de aluno",
  system_alert: "Alerta do sistema",
  new_enrollment: "Nova matrícula"
};

export default function AdminNotifications() {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .order('role', { ascending: true });

    if (error) {
      console.error('Error fetching notification settings:', error);
      toast.error('Erro ao carregar configurações');
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    const { error } = await supabase
      .from('notification_settings')
      .update({ enabled })
      .eq('id', id);

    if (error) {
      console.error('Error updating notification setting:', error);
      toast.error('Erro ao atualizar configuração');
    } else {
      setSettings(prev =>
        prev.map(s => s.id === id ? { ...s, enabled } : s)
      );
      toast.success('Configuração atualizada com sucesso');
    }
  };

  const roleLabels: Record<string, string> = {
    user: "Alunos",
    professor: "Professores",
    admin: "Administradores"
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.role]) {
      acc[setting.role] = [];
    }
    acc[setting.role].push(setting);
    return acc;
  }, {} as Record<string, NotificationSetting[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb 
        items={[
          { label: "Gestão", href: "/admin" },
          { label: "Gestão de Escola", href: "/admin/school" },
          { label: "Notificações" }
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Notificações</h1>
        <p className="text-muted-foreground mt-1">Configure quais notificações cada perfil pode receber</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {Object.entries(groupedSettings).map(([role, roleSettings]) => (
            <Card key={role}>
              <CardHeader>
                <CardTitle>{roleLabels[role] || role}</CardTitle>
                <CardDescription>
                  Configure as notificações para {roleLabels[role]?.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roleSettings.map(setting => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <Label htmlFor={setting.id} className="cursor-pointer">
                        {notificationLabels[setting.notification_type] || setting.notification_type}
                      </Label>
                      <Switch
                        id={setting.id}
                        checked={setting.enabled}
                        onCheckedChange={(enabled) => handleToggle(setting.id, enabled)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
