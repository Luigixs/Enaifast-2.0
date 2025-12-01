import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface LessonTimerProps {
  durationMinutes?: number;
  onComplete?: () => void;
}

export function LessonTimer({ durationMinutes = 0, onComplete }: LessonTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          // Check if reached estimated duration
          if (durationMinutes > 0 && next >= durationMinutes * 60) {
            if (onComplete) {
              onComplete();
            }
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, durationMinutes, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-mono text-muted-foreground">
        {formatTime(seconds)}
      </span>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleTimer}
        className="h-7 w-7"
      >
        {isRunning ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={resetTimer}
        disabled={seconds === 0}
        className="h-7 w-7"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>
    </div>
  );
}
