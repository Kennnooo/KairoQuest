import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Sparkles } from "lucide-react";

interface NewTask {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  category: string;
}

interface AddTaskFormProps {
  onAddTask: (task: NewTask) => void;
  onGetAIMotivation: (task: string) => void;
}

export const AddTaskForm = ({ onAddTask, onGetAIMotivation }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: "medium",
    category: "General"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.title.trim()) {
      onAddTask(task);
      setTask({ title: "", description: "", priority: "medium", category: "General" });
      setIsOpen(false);
    }
  };

  const handleAIMotivation = () => {
    if (task.title.trim()) {
      onGetAIMotivation(task.title);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        size="lg"
        className="bg-gradient-hero hover:shadow-glow-primary animate-power-up"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Quest
      </Button>
    );
  }

  return (
    <Card className="p-6 shadow-anime">
      <h3 className="text-lg font-semibold mb-4 text-primary">Create New Quest</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Quest name (e.g., 'Master React Hooks')"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="border-primary/20 focus:border-primary"
        />
        
        <Textarea
          placeholder="Quest description..."
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="border-primary/20 focus:border-primary min-h-[80px]"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Select value={task.priority} onValueChange={(value: any) => setTask({ ...task, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Rookie (Low)</SelectItem>
              <SelectItem value="medium">Warrior (Medium)</SelectItem>
              <SelectItem value="high">Elite (High)</SelectItem>
              <SelectItem value="critical">Legendary (Critical)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={task.category} onValueChange={(value) => setTask({ ...task, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Work">Work Adventure</SelectItem>
              <SelectItem value="Study">Training Arc</SelectItem>
              <SelectItem value="Health">Power Up</SelectItem>
              <SelectItem value="Personal">Character Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-gradient-hero">
            <Plus className="w-4 h-4 mr-2" />
            Create Quest
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAIMotivation}
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get AI Motivation
          </Button>
          
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};