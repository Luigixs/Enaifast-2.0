import { 
  List, 
  Shield, 
  FileText, 
  GraduationCap, 
  Bell, 
  Flag, 
  ShoppingCart, 
  Award, 
  Gamepad2,
  Users as UsersIcon 
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { Breadcrumb } from "@/components/Breadcrumb";

export default function AdminSchool() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb 
        items={[
          { label: "Gestão", href: "/admin" },
          { label: "Gestão de Escola" }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Dados"
          description="Preencha os dados da sua escola"
          icon={List}
        />
        <DashboardCard
          title="Política de Privacidade"
          description="Defina os termos de privacidade da escola"
          icon={Shield}
        />
        <DashboardCard
          title="Termos de uso"
          description="Elabore os termos de uso de sua escola"
          icon={FileText}
        />
        <DashboardCard
          title="Professores"
          description="Lista de professores da sua escola"
          icon={GraduationCap}
        />
        <DashboardCard
          title="Notificação"
          description="Gerencie as notificações"
          icon={Bell}
          href="/admin/school/notifications"
        />
        <DashboardCard
          title="Banners"
          description="Lista de banners da sua escola"
          icon={Flag}
        />
        <DashboardCard
          title="Assinatura"
          description="Área de assinaturas da escola"
          icon={ShoppingCart}
        />
        <DashboardCard
          title="Certificado"
          description="Edição do Certificado padrão da escola"
          icon={Award}
        />
        <DashboardCard
          title="Gamification"
          description="Personalize o Gamification definindo pontos, moedas, nomes e ligas"
          icon={Gamepad2}
        />
        <DashboardCard
          title="Turmas"
          description="Crie e configure turmas"
          icon={UsersIcon}
        />
      </div>
    </div>
  );
}
