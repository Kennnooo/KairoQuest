import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, Flame, Star, Trophy, Plus, Minus, Timer } from "lucide-react";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  completed: boolean;
  xp: number;
  progress: number;
  subtasks: Subtask[];
  timeSpent: number; // in minutes
  estimatedTime: number; // in minutes
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

const priorityConfig = {
  low: { color: "bg-secondary", icon: Clock, xp: 10 },
  medium: { color: "bg-accent", icon: Star, xp: 25 },
  high: { color: "bg-warning", icon: Flame, xp: 50 },
  critical: { color: "bg-destructive", icon: Trophy, xp: 100 }
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
  const [timeToAdd, setTimeToAdd] = useState(15);
  
  const config = priorityConfig[task.priority];
  const IconComponent = config.icon;
  
  // Calculate progress based on subtasks if they exist
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const subtaskProgress = task.subtasks.length > 0 
    ? (completedSubtasks / task.subtasks.length) * 100 
    : task.progress;

  const handleComplete = () => {
    if (!task.completed) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
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

      <div className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(subtaskProgress)}%</span>
          </div>
          
          <Progress 
            value={subtaskProgress} 
            className="h-2 bg-muted/50"
          />

          {!task.completed && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressChange(Math.min(100, subtaskProgress + 25))}
                className="text-xs px-2"
              >
                +25%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressChange(Math.max(0, subtaskProgress - 25))}
                className="text-xs px-2"
              >
                -25%
              </Button>
            </div>
          )}
        </div>

        {/* Time Tracking */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-accent" />
            <div className="text-sm">
              <span className="font-medium">{task.timeSpent}m</span>
              <span className="text-muted-foreground"> / {task.estimatedTime}m</span>
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
                  className="text-xs px-2"
                >
                  +{minutes}m
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks Section */}
        {task.subtasks.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="text-sm p-0 h-auto"
            >
              Subtasks ({completedSubtasks}/{task.subtasks.length})
            </Button>
            
            {showSubtasks && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleSubtask(task.id, subtask.id)}
                      className={`p-0 h-auto text-sm ${
                        subtask.completed ? 'line-through text-muted-foreground' : ''
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

        {/* Add Subtask */}
        {!task.completed && (
          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <Input
              placeholder="Add subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="text-sm"
            />
            <Button type="submit" size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* XP and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-muted">
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