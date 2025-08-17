import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Flame, Star, Trophy } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  completed: boolean;
  xp: number;
  progress: number;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  low: { color: "bg-secondary", icon: Clock, xp: 10 },
  medium: { color: "bg-accent", icon: Star, xp: 25 },
  high: { color: "bg-warning", icon: Flame, xp: 50 },
  critical: { color: "bg-destructive", icon: Trophy, xp: 100 }
};

export const TaskCard = ({ task, onToggleComplete, onDelete }: TaskCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const config = priorityConfig[task.priority];
  const IconComponent = config.icon;

  const handleComplete = () => {
    if (!task.completed) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    onToggleComplete(task.id);
  };

  return (
    <Card className={`p-4 transition-all duration-300 hover:shadow-anime ${
      task.completed ? 'opacity-70 bg-muted' : 'hover:scale-[1.02]'
    } ${isAnimating ? 'animate-level-up' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <IconComponent className={`w-5 h-5 text-${task.priority === 'critical' ? 'destructive' : 'foreground'}`} />
          <div>
            <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
        </div>
        <Badge variant={task.completed ? "secondary" : "default"} className={config.color}>
          {task.priority.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{task.progress}%</span>
        </div>
        
        <Progress 
          value={task.progress} 
          className="h-2 bg-muted/50"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-experience" />
            <span className="text-sm font-medium text-experience">+{config.xp} XP</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={task.completed ? "secondary" : "default"}
              size="sm"
              onClick={handleComplete}
              className={task.completed ? '' : 'bg-gradient-hero hover:shadow-glow-primary'}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {task.completed ? 'Completed' : 'Complete'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};