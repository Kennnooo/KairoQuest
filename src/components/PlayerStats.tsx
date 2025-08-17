import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame, Target, TrendingUp } from "lucide-react";

interface PlayerStatsProps {
  level: number;
  xp: number;
  xpToNext: number;
  totalTasks: number;
  completedTasks: number;
  streak: number;
}

export const PlayerStats = ({ level, xp, xpToNext, totalTasks, completedTasks, streak }: PlayerStatsProps) => {
  const xpProgress = (xp / xpToNext) * 100;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-power shadow-anime">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary-foreground">Productivity Warrior</h2>
          <p className="text-secondary-foreground/80">Keep pushing forward!</p>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-secondary-foreground border-white/30 text-lg px-3 py-1">
          Level {level}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-experience" />
            <span className="font-semibold text-secondary-foreground">Experience</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-secondary-foreground/80">
              <span>{xp} XP</span>
              <span>{xpToNext} XP to next level</span>
            </div>
            <Progress 
              value={xpProgress} 
              className="h-3 bg-white/20"
            />
          </div>
        </div>

        {/* Completion Stats */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            <span className="font-semibold text-secondary-foreground">Quest Completion</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-secondary-foreground/80">
              <span>{completedTasks} / {totalTasks} completed</span>
              <span>{completionRate.toFixed(1)}%</span>
            </div>
            <Progress 
              value={completionRate} 
              className="h-3 bg-white/20"
            />
          </div>
        </div>

        {/* Daily Streak */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-warning" />
            <span className="font-semibold text-secondary-foreground">Daily Streak</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-secondary-foreground">{streak}</div>
            <div className="text-sm text-secondary-foreground/80">
              days<br />in a row
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Preview */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            <span className="font-semibold text-secondary-foreground">Recent Achievement</span>
          </div>
          <Badge variant="outline" className="border-white/30 text-secondary-foreground">
            {level >= 5 ? "Quest Master" : level >= 3 ? "Rising Warrior" : "New Adventurer"}
          </Badge>
        </div>
      </div>
    </Card>
  );
};