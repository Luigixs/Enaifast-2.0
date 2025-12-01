import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface UserMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
  userWhatsapp?: string | null;
}

export function UserMessageDialog({ 
  open, 
  onOpenChange, 
  userName, 
  userEmail,
  userWhatsapp 
}: UserMessageDialogProps) {
  const [message, setMessage] = useState("");

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Mensagem da plataforma`);
    const body = encodeURIComponent(message);
    window.open(`mailto:${userEmail}?subject=${subject}&body=${body}`, '_blank');
    toast.success('Cliente de email aberto');
    setMessage("");
    onOpenChange(false);
  };

  const handleSendWhatsApp = () => {
    if (!userWhatsapp) {
      toast.error('Usuário não possui WhatsApp cadastrado');
      return;
    }
    const phone = userWhatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    toast.success('WhatsApp aberto');
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Mensagem - {userName}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger 
              value="whatsapp" 
              disabled={!userWhatsapp}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <div>
              <Label>Email do destinatário</Label>
              <p className="text-sm text-muted-foreground mt-1">{userEmail}</p>
            </div>
            <div>
              <Label htmlFor="email-message">Mensagem</Label>
              <Textarea
                id="email-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={6}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendEmail} disabled={!message.trim()}>
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="whatsapp" className="space-y-4">
            <div>
              <Label>WhatsApp do destinatário</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {userWhatsapp || 'Não cadastrado'}
              </p>
            </div>
            <div>
              <Label htmlFor="whatsapp-message">Mensagem</Label>
              <Textarea
                id="whatsapp-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={6}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSendWhatsApp} 
                disabled={!message.trim() || !userWhatsapp}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar WhatsApp
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
