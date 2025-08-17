import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, Flame, Star, Trophy, Plus, Timer, Zap, Shield } from "lucide-react";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "e" | "d" | "c" | "b" | "a" | "s";
  category: string;
  completed: boolean;
  xp: number;
  progress: number;
  subtasks: Subtask[];
  timeSpent: number;
  estimatedTime: number;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddTime: (taskId: string, minutes: number) => void;
}

const rankConfig = {
  e: { color: "bg-rank-e", icon: Clock, xp: 10, label: "E-Rank" },
  d: { color: "bg-rank-d", icon: Star, xp: 25, label: "D-Rank" },
  c: { color: "bg-rank-c", icon: Shield, xp: 50, label: "C-Rank" },
  b: { color: "bg-rank-b", icon: Zap, xp: 100, label: "B-Rank" },
  a: { color: "bg-rank-a", icon: Flame, xp: 200, label: "A-Rank" },
  s: { color: "bg-rank-s", icon: Trophy, xp: 500, label: "S-Rank" }
};

export const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onUpdateProgress, 
  onAddSubtask, 
  onToggleSubtask,
  onAddTime 
}: TaskCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(false);
  
  const config = rankConfig[task.priority];
  const IconComponent = config.icon;
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const subtaskProgress = task.subtasks.length > 0 
    ? (completedSubtasks / task.subtasks.length) * 100 
    : task.progress;

  const handleComplete = () => {
    if (!task.completed) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    }
    onToggleComplete(task.id);
  };

  const handleProgressChange = (newProgress: number) => {
    onUpdateProgress(task.id, newProgress);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask("");
    }
  };

  const handleAddTime = (minutes: number) => {
    onAddTime(task.id, minutes);
  };

  return (
    <Card className={`p-6 transition-all duration-300 bg-card border-2 hover:border-primary/50 ${
      task.completed ? 'opacity-60 bg-muted/50' : 'hover:shadow-hunter hover:scale-[1.01]'
    } ${isAnimating ? 'animate-rank-up' : ''} relative overflow-hidden`}>
      
      {/* Rank glow effect */}
      <div className="absolute inset-0 bg-gradient-system opacity-5 pointer-events-none" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.color} relative`}>
            <IconComponent className="w-5 h-5 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-lg animate-shadow-pulse" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
        </div>
        <Badge variant="outline" className={`${config.color} text-white border-none font-bold px-3 py-1`}>
          {config.label}
        </Badge>
      </div>

      <div className="space-y-4 relative z-10">
        {/* System Progress */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">DUNGEON PROGRESS</span>
            <span className="font-bold text-primary">{Math.round(subtaskProgress)}%</span>
          </div>
          
          <Progress 
            value={subtaskProgress} 
            className="h-3 bg-background border border-primary/30"
          />

          {!task.completed && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressChange(Math.min(100, subtaskProgress + 25))}
                className="text-xs px-3 border-primary/30 hover:bg-primary/10"
              >
                +25%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressChange(Math.max(0, subtaskProgress - 25))}
                className="text-xs px-3 border-primary/30 hover:bg-primary/10"
              >
                -25%
              </Button>
            </div>
          )}
        </div>

        {/* System Time Tracker */}
        <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-secondary" />
            <div>
              <div className="text-sm font-medium text-secondary">TIME LOGGED</div>
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-secondary">{task.timeSpent}m</span> / {task.estimatedTime}m
              </div>
            </div>
          </div>
          
          {!task.completed && (
            <div className="flex gap-1">
              {[15, 30, 60].map(minutes => (
                <Button
                  key={minutes}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTime(minutes)}
                  className="text-xs px-2 border-secondary/30 hover:bg-secondary/10"
                >
                  +{minutes}m
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* System Objectives (Subtasks) */}
        {task.subtasks.length > 0 && (
          <div className="space-y-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="text-sm font-medium text-accent hover:bg-accent/20 p-0 h-auto"
            >
              SYSTEM OBJECTIVES ({completedSubtasks}/{task.subtasks.length})
            </Button>
            
            {showSubtasks && (
              <div className="space-y-2 pl-4 border-l-2 border-accent/30">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleSubtask(task.id, subtask.id)}
                      className={`p-0 h-auto text-sm justify-start ${
                        subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 mr-2 ${
                        subtask.completed ? 'text-success' : 'text-muted-foreground'
                      }`} />
                      {subtask.title}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add System Objective */}
        {!task.completed && (
          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <Input
              placeholder="Add new system objective..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="text-sm bg-background border-primary/30 focus:border-primary"
            />
            <Button type="submit" size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Plus className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* System Rewards & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-primary/20">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-experience animate-shadow-pulse" />
            <span className="text-sm font-bold text-experience">+{config.xp} EXP</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={task.completed ? "secondary" : "default"}
              size="sm"
              onClick={handleComplete}
              className={task.completed 
                ? 'bg-muted text-muted-foreground' 
                : 'bg-gradient-system hover:shadow-glow-system animate-system-glow'
              }
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {task.completed ? 'CLEARED' : 'CLEAR DUNGEON'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};