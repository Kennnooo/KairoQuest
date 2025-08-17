import { useState, useEffect } from "react";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskForm } from "@/components/AddTaskForm";
import { PlayerStats } from "@/components/PlayerStats";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Swords, Target, Trophy, Zap } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  completed: boolean;
  xp: number;
  progress: number;
  createdAt: Date;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);
  const [streak, setStreak] = useState(3);
  const [aiMotivation, setAiMotivation] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  // Load sample tasks on first render
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Complete React Tutorial",
        description: "Master the fundamentals of React development",
        priority: "high",
        category: "Study",
        completed: false,
        xp: 50,
        progress: 75,
        createdAt: new Date()
      },
      {
        id: "2", 
        title: "Morning Workout",
        description: "30 minutes of strength training",
        priority: "medium",
        category: "Health",
        completed: true,
        xp: 25,
        progress: 100,
        createdAt: new Date()
      }
    ];
    setTasks(sampleTasks);
    setPlayerXP(125);
  }, []);

  const xpToNextLevel = 200;
  const completedTasks = tasks.filter(task => task.completed).length;

  const addTask = (newTaskData: Omit<Task, "id" | "completed" | "xp" | "progress" | "createdAt">) => {
    const xpValue = {
      low: 10,
      medium: 25, 
      high: 50,
      critical: 100
    }[newTaskData.priority];

    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      completed: false,
      xp: xpValue,
      progress: 0,
      createdAt: new Date()
    };

    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "New Quest Added!",
      description: `"${newTask.title}" has been added to your adventure log.`,
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
            title: "🎉 LEVEL UP!",
            description: `Congratulations! You've reached Level ${newLevel}!`,
          });
        } else {
          toast({
            title: "Quest Complete!",
            description: `+${task.xp} XP earned! Keep pushing forward!`,
          });
        }
        
        return { ...task, completed: true, progress: 100 };
      } else if (task.id === taskId && task.completed) {
        setPlayerXP(prev => Math.max(0, prev - task.xp));
        return { ...task, completed: false, progress: 75 };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Quest Removed",
      description: "Task has been removed from your adventure log.",
    });
  };

  const getAIMotivation = async (taskTitle?: string) => {
    setIsAiLoading(true);
    try {
      // Mock AI response for now - in a real app, you'd call an AI API
      const motivations = [
        `Remember, ${taskTitle ? `completing "${taskTitle}"` : 'every task you finish'} brings you one step closer to your dreams! Just like Luffy never gives up on becoming Pirate King, you can achieve anything with determination!`,
        `Channel your inner Goku! Each challenge is a chance to grow stronger. Push through the difficulty and emerge victorious!`,
        `Like Vegeta's relentless training, your consistency in tackling tasks will make you unstoppable. Prince of productivity, that's you!`,
        `Every great adventure starts with a single step. Your journey to productivity mastery is just like the Straw Hat's grand voyage - full of growth and discovery!`,
        `Power up your productivity! Remember, even the strongest warriors like Goku started small. Each completed task is training for your ultimate transformation!`
      ];
      
      setTimeout(() => {
        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
        setAiMotivation(randomMotivation);
        setIsAiLoading(false);
        toast({
          title: "AI Motivation Unlocked!",
          description: "Your personal motivation coach has spoken!",
        });
      }, 1500);
    } catch (error) {
      setIsAiLoading(false);
      toast({
        title: "Oops!",
        description: "Couldn't get AI motivation right now. Try again later!",
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
            <Swords className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Productivity Quest
            </h1>
            <Swords className="w-8 h-8 text-primary scale-x-[-1]" />
          </div>
          <p className="text-muted-foreground text-lg">
            Embark on your journey to become the ultimate productivity warrior!
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

        {/* Motivational Quote */}
        <MotivationalQuote 
          aiMotivation={aiMotivation}
          onGetNewQuote={() => getAIMotivation()}
          isLoading={isAiLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Task Form */}
          <div className="lg:col-span-1">
            <AddTaskForm 
              onAddTask={addTask}
              onGetAIMotivation={getAIMotivation}
            />
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Active Quests ({activeTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Completed ({completedTasksList.length})
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
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No active quests!</p>
                    <p>Create your first quest to begin your adventure.</p>
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
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No completed quests yet!</p>
                    <p>Complete your first quest to see it here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;