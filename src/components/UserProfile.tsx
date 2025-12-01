import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Camera, Coins, Flame, Shield, Zap, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/contexts/AuthContext";

type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "challenger";

interface UserProfileProps {
  userName: string;
  userAvatar?: string;
  className?: string;
}

const rankColors: Record<RankTier, string> = {
  bronze: "text-rank-bronze",
  silver: "text-rank-silver",
  gold: "text-rank-gold",
  platinum: "text-rank-platinum",
  diamond: "text-rank-diamond",
  master: "text-rank-master",
  challenger: "text-rank-challenger",
};

const rankNames: Record<RankTier, string> = {
  bronze: "Ferro II",
  silver: "Bronze I",
  gold: "Prata II",
  platinum: "Ouro I",
  diamond: "Platina II",
  master: "Diamante I",
  challenger: "Mestre",
};

export function UserProfile({ userName, userAvatar, className }: UserProfileProps) {
  const [avatar, setAvatar] = useState(userAvatar);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userStats } = useUserStats();
  const { signOut, user } = useAuth();
  
  const displayName = userName || user?.email?.split("@")[0] || "Usuário";

  const xp = userStats?.total_xp || 0;
  const coins = userStats?.total_coins || 0;
  const streak = userStats?.current_streak || 0;
  const rank = (userStats?.rank || "bronze") as RankTier;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setIsDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn("flex items-center gap-4 p-4", className)}>
      {/* Avatar with Rank Shield */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer group">
            <div className={cn("absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-transparent animate-pulse", rankColors[rank])}>
              <Shield className="w-20 h-20 absolute -inset-2" strokeWidth={1.5} />
            </div>
            <Avatar className="w-16 h-16 border-4 border-background relative z-10">
              <AvatarImage src={avatar} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <Camera className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Foto de Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={avatar} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Escolher Foto</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setAvatar(undefined);
                setIsDialogOpen(false);
              }}
            >
              Remover Foto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Stats */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-foreground">{displayName}</h3>
            <p className={cn("text-sm font-semibold", rankColors[rank])}>{rankNames[rank]}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          {/* XP */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-xp/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-xp" fill="currentColor" />
            </div>
            <span className="font-semibold text-foreground">{xp.toLocaleString()}</span>
            <span className="text-muted-foreground">xp</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-coins/20 flex items-center justify-center">
              <Coins className="w-4 h-4 text-coins" fill="currentColor" />
            </div>
            <span className="font-semibold text-foreground">{coins.toLocaleString()}</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-streak/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-streak" fill="currentColor" />
            </div>
            <span className="font-semibold text-foreground">{streak}</span>
            <span className="text-muted-foreground">dias</span>
          </div>
        </div>
      </div>
    </div>
  );
}
