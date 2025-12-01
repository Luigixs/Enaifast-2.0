import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function DashboardCard({ title, description, icon: Icon, onClick, href, className }: DashboardCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (href) {
      navigate(href);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden transition-all duration-300",
        "border-border/30 bg-card/40 backdrop-blur-sm",
        "hover:border-primary/40 hover:bg-card/60",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6 h-full flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-muted/70 transition-colors">
            <Icon className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-base text-primary group-hover:text-primary/80 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground/80 line-clamp-2">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
