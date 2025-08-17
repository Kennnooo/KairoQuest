import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Zap, X } from "lucide-react";

interface NewTask {
  title: string;
  description: string;
  priority: "e" | "d" | "c" | "b" | "a" | "s";
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
    priority: "d",
    category: "General"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.title.trim()) {
      onAddTask(task);
      setTask({ title: "", description: "", priority: "d", category: "General" });
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
        className="bg-gradient-system hover:shadow-glow-system animate-system-glow w-full text-white font-bold"
      >
        <Plus className="w-5 h-5 mr-2" />
        CREATE NEW DUNGEON
      </Button>
    );
  }

  return (
    <Card className="p-6 shadow-hunter bg-card border-2 border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-system opacity-5 pointer-events-none" />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </Button>
      
      <h3 className="text-xl font-bold mb-6 text-primary relative z-10">SYSTEM: CREATE DUNGEON</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <Input
          placeholder="Dungeon name (e.g., 'Master Advanced Algorithms')"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="border-primary/30 focus:border-primary bg-background"
        />
        
        <Textarea
          placeholder="Dungeon description and objectives..."
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="border-primary/30 focus:border-primary bg-background min-h-[100px]"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Select value={task.priority} onValueChange={(value: any) => setTask({ ...task, priority: value })}>
            <SelectTrigger className="border-primary/30 bg-background">
              <SelectValue placeholder="Rank Classification" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/30">
              <SelectItem value="e">E-Rank (Beginner)</SelectItem>
              <SelectItem value="d">D-Rank (Novice)</SelectItem>
              <SelectItem value="c">C-Rank (Intermediate)</SelectItem>
              <SelectItem value="b">B-Rank (Advanced)</SelectItem>
              <SelectItem value="a">A-Rank (Expert)</SelectItem>
              <SelectItem value="s">S-Rank (Legendary)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={task.category} onValueChange={(value) => setTask({ ...task, category: value })}>
            <SelectTrigger className="border-primary/30 bg-background">
              <SelectValue placeholder="Gate Type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/30">
              <SelectItem value="General">General Gate</SelectItem>
              <SelectItem value="Work">Corporate Raid</SelectItem>
              <SelectItem value="Study">Knowledge Dungeon</SelectItem>
              <SelectItem value="Health">Training Ground</SelectItem>
              <SelectItem value="Personal">Shadow Realm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-3">
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-system hover:shadow-glow-system text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            REGISTER DUNGEON
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAIMotivation}
            className="border-accent/50 text-accent hover:bg-accent/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            SYSTEM ADVICE
          </Button>
          
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setIsOpen(false)}
            className="bg-muted hover:bg-muted/80"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};