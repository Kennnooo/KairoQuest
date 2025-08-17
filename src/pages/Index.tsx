import { useState, useEffect } from "react";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskForm } from "@/components/AddTaskForm";
import { PlayerStats } from "@/components/PlayerStats";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getUserData, setUserData } from "@/lib/storage";
import { Swords, Target, Trophy, Zap } from "lucide-react";

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
  timeSpent: number; // in minutes
  estimatedTime: number; // in minutes
  createdAt: Date;
}

const Index = () => {
  const { toast } = useToast();
  
  // Load user-specific data from storage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = getUserData('tasks');
    return savedTasks || [
      {
        id: "1",
        title: "Master Advanced React Patterns",
        description: "Complete comprehensive training in React development",
        priority: "b",
        category: "Knowledge Dungeon",
        completed: false,
        xp: 100,
        progress: 60,
        subtasks: [
          { id: "1-1", title: "Study Hooks Architecture", completed: true },
          { id: "1-2", title: "Implement Context Patterns", completed: true },
          { id: "1-3", title: "Master Performance Optimization", completed: false },
          { id: "1-4", title: "Build Advanced Demo Project", completed: false }
        ],
        timeSpent: 120,
        estimatedTime: 180,
        createdAt: new Date()
      },
      {
        id: "2", 
        title: "Daily Combat Training",
        description: "Physical conditioning and strength enhancement",
        priority: "c",
        category: "Training Ground",
        completed: false,
        xp: 50,
        progress: 0,
        subtasks: [],
        timeSpent: 0,
        estimatedTime: 45,
        createdAt: new Date()
      }
    ];
  });

  const [playerLevel, setPlayerLevel] = useState(() => {
    const savedLevel = getUserData('playerLevel');
    return savedLevel || 1;
  });

  const [playerXP, setPlayerXP] = useState(() => {
    const savedXP = getUserData('playerXP');
    return savedXP || 0;
  });

  const [streak, setStreak] = useState(() => {
    const savedStreak = getUserData('streak');
    return savedStreak || 0;
  });

  const [aiMotivation, setAiMotivation] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Save data whenever state changes
  useEffect(() => {
    setUserData('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    setUserData('playerLevel', playerLevel);
  }, [playerLevel]);

  useEffect(() => {
    setUserData('playerXP', playerXP);
  }, [playerXP]);

  useEffect(() => {
    setUserData('streak', streak);
  }, [streak]);

  const xpToNextLevel = 200;
  const completedTasks = tasks.filter(task => task.completed).length;

  const addTask = (newTaskData: Omit<Task, "id" | "completed" | "xp" | "progress" | "subtasks" | "timeSpent" | "estimatedTime" | "createdAt">) => {
    const xpValue = {
      e: 10,
      d: 25, 
      c: 50,
      b: 100,
      a: 200,
      s: 500
    }[newTaskData.priority];

    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      completed: false,
      xp: xpValue,
      progress: 0,
      subtasks: [],
      timeSpent: 0,
      estimatedTime: 60, // default 1 hour
      createdAt: new Date()
    };

    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "System Notification",
      description: `New dungeon "${newTask.title}" has been registered to your hunter profile.`,
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        const newXP = playerXP + task.xp;
        const newLevel = Math.floor(newXP / 200) + 1;
        
        setPlayerXP(newXP);
        if (newLevel > playerLevel) {
          setPlayerLevel(newLevel);
          toast({
            title: "🎆 RANK UP!",
            description: `Congratulations! You've achieved Level ${newLevel}!`,
          });
        } else {
          toast({
            title: "Dungeon Cleared!",
            description: `+${task.xp} EXP gained! Continue your ascent, Hunter.`,
          });
        }
        
        return { ...task, completed: true, progress: 100 };
      } else if (task.id === taskId && task.completed) {
        setPlayerXP(prev => Math.max(0, prev - task.xp));
        return { ...task, completed: false, progress: task.subtasks.length > 0 
          ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100 
          : Math.max(task.progress, 50) };
      }
      return task;
    }));
  };

  const updateTaskProgress = (taskId: string, newProgress: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, progress: newProgress } : task
    ));
  };

  const addSubtask = (taskId: string, subtaskTitle: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newSubtask: Subtask = {
          id: `${taskId}-${Date.now()}`,
          title: subtaskTitle,
          completed: false
        };
        return { ...task, subtasks: [...task.subtasks, newSubtask] };
      }
      return task;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId 
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );
        const completedCount = updatedSubtasks.filter(st => st.completed).length;
        const newProgress = (completedCount / updatedSubtasks.length) * 100;
        
        return { ...task, subtasks: updatedSubtasks, progress: newProgress };
      }
      return task;
    }));
  };

  const addTimeToTask = (taskId: string, minutes: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, timeSpent: task.timeSpent + minutes }
        : task
    ));
    
    toast({
      title: "Time Logged!",
      description: `Added ${minutes} minutes to dungeon progress.`,
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Dungeon Removed",
      description: "Dungeon has been removed from your hunter registry.",
    });
  };

  const getAIMotivation = async (taskTitle?: string) => {
    setIsAiLoading(true);
    try {
      // Mock AI response for now - in a real app, you'd call an AI API
        const motivations = [
          `System Analysis: ${taskTitle ? `Completing "${taskTitle}"` : 'Every dungeon you clear'} increases your hunter ranking significantly. Your dedication mirrors the top S-Rank hunters.`,
          `Power Assessment: Like all great hunters, growth comes through facing increasingly difficult challenges. You're on the path to awakening your true potential.`,
          `System Advisory: Consistent effort in clearing dungeons has been proven to unlock hidden abilities. Your persistence is being monitored and evaluated positively.`,
          `Hunter Database: Records show that those who never give up on their missions eventually surpass all expectations. Continue your ascent, Hunter.`,
          `System Core Message: Every task completed strengthens your resolve and increases your capabilities. You're becoming stronger with each cleared objective.`
        ];
      
      setTimeout(() => {
        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
        setAiMotivation(randomMotivation);
        setIsAiLoading(false);
        toast({
          title: "System Analysis Complete!",
          description: "AI guidance protocol has been updated.",
        });
      }, 1500);
    } catch (error) {
      setIsAiLoading(false);
      toast({
        title: "System Error",
        description: "Unable to access AI guidance. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasksList = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap className="w-10 h-10 text-primary animate-shadow-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-system bg-clip-text text-transparent">
              HUNTER SYSTEM
            </h1>
            <Zap className="w-10 h-10 text-primary animate-shadow-pulse scale-x-[-1]" />
          </div>
          <p className="text-muted-foreground text-lg">
            Welcome, Hunter. Your journey to S-Rank begins now.
          </p>
        </div>

        {/* Player Stats */}
        <PlayerStats 
          level={playerLevel}
          xp={playerXP}
          xpToNext={xpToNextLevel}
          totalTasks={tasks.length}
          completedTasks={completedTasks}
          streak={streak}
        />

        {/* AI Assistant Section */}
        <div className="w-full">
          <AIAssistant />
        </div>

        {/* Progress Update and Create Dungeon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create New Dungeon */}
          <div>
            <AddTaskForm 
              onAddTask={addTask}
              onGetAIMotivation={getAIMotivation}
            />
          </div>

          {/* Level Up Guidance */}
          <div>
            <MotivationalQuote 
              aiMotivation={aiMotivation}
              onGetNewQuote={() => getAIMotivation()}
              isLoading={isAiLoading}
            />
          </div>
        </div>

        
        {/* Tasks Section */}
        <div className="w-full">
          <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted border border-primary/20">
                <TabsTrigger value="active" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Target className="w-4 h-4" />
                  Active Dungeons ({activeTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Trophy className="w-4 h-4" />
                  Cleared ({completedTasksList.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {activeTasks.length > 0 ? (
                  activeTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onDelete={deleteTask}
                      onUpdateProgress={updateTaskProgress}
                      onAddSubtask={addSubtask}
                      onToggleSubtask={toggleSubtask}
                      onAddTime={addTimeToTask}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No active dungeons!</p>
                    <p>Register your first dungeon to begin hunting.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedTasksList.length > 0 ? (
                  completedTasksList.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onDelete={deleteTask}
                      onUpdateProgress={updateTaskProgress}
                      onAddSubtask={addSubtask}
                      onToggleSubtask={toggleSubtask}
                      onAddTime={addTimeToTask}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No cleared dungeons yet!</p>
                    <p>Complete your first dungeon to see it here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;