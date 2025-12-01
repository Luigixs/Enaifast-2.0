import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/logo.png";

// Validação de schemas
const signupSchema = z.object({
  fullName: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string().trim().min(10, "Telefone inválido").max(20, "Telefone inválido"),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20, "WhatsApp inválido").optional(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email ou telefone obrigatório"),
  password: z.string().min(1, "Senha obrigatória")
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  
  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Validar login
        const validation = loginSchema.safeParse({
          identifier,
          password: loginPassword
        });
        
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setLoading(false);
          return;
        }

        const { error } = await signIn(identifier, loginPassword);
        if (error) {
          toast.error(error.message || "Erro ao fazer login");
        } else {
          toast.success("Login realizado com sucesso!");
        }
      } else {
        // Validar cadastro
        const validation = signupSchema.safeParse({
          fullName,
          email,
          phone,
          whatsapp: whatsapp || phone, // Se WhatsApp não informado, usa o telefone
          password,
          confirmPassword
        });
        
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setLoading(false);
          return;
        }

        const { error } = await signUp(
          email, 
          password, 
          fullName, 
          phone, 
          whatsapp || phone
        );
        
        if (error) {
          toast.error(error.message || "Erro ao criar conta");
        } else {
          toast.success("Conta criada com sucesso!");
          // Limpar formulário
          setFullName("");
          setEmail("");
          setPhone("");
          setWhatsapp("");
          setPassword("");
          setConfirmPassword("");
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <img src={logo} alt="EduVerse" className="h-16 w-16 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Login" : "Criar Conta"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Entre com seu email ou telefone"
              : "Preencha seus dados para começar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
              // Formulário de Login
              <>
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email ou Telefone</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="seu@email.com ou (11) 99999-9999"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Senha</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            ) : (
              // Formulário de Cadastro
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se não informado, usaremos seu telefone
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                // Limpar campos ao trocar
                setIdentifier("");
                setLoginPassword("");
                setFullName("");
                setEmail("");
                setPhone("");
                setWhatsapp("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Faça login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
