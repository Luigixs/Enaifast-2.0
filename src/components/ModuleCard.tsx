import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  moduleNumber: number;
  totalDuration: number;
  lessonCount: number;
  progress?: number;
  onClick: () => void;
  className?: string;
}

export function ModuleCard({
  title,
  description,
  thumbnailUrl,
  moduleNumber,
  totalDuration,
  lessonCount,
  progress = 0,
  onClick,
  className = "",
}: ModuleCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden border-border/50 hover:shadow-lg transition-all ${className}`}
    >
      <div className="relative aspect-[3/4] flex flex-col">
        {/* Image Section - 70% */}
        <div className="relative h-[70%] bg-muted overflow-hidden">
          {thumbnailUrl ? (
            <div
              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
              style={{
                backgroundImage: `url(${thumbnailUrl})`,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-12 w-12 text-primary/40" />
            </div>
          )}
          
          <Badge className="absolute top-2 left-2 bg-background/90 text-foreground border-border/50 backdrop-blur-sm text-xs">
            Módulo {moduleNumber}
          </Badge>
          
          {/* Progress bar at bottom of image */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5">
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </div>
        
        {/* Info Section - 30% */}
        <div className="h-[30%] bg-card border-t border-border/30 p-3 flex flex-col justify-between">
          <div className="flex-1 min-h-0 overflow-hidden">
            <h3 className="font-bold text-sm line-clamp-2 leading-tight">{title}</h3>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5 flex-shrink-0">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{totalDuration} min • {lessonCount} aulas</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
