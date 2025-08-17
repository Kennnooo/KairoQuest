import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, TrendingUp, Shield, Zap } from "lucide-react";

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

  // Determine hunter rank based on level
  const getHunterRank = (level: number) => {
    if (level >= 50) return { rank: "S-Rank", color: "bg-rank-s", icon: Trophy };
    if (level >= 40) return { rank: "A-Rank", color: "bg-rank-a", icon: Zap };
    if (level >= 30) return { rank: "B-Rank", color: "bg-rank-b", icon: Shield };
    if (level >= 20) return { rank: "C-Rank", color: "bg-rank-c", icon: Target };
    if (level >= 10) return { rank: "D-Rank", color: "bg-rank-d", icon: Star };
    return { rank: "E-Rank", color: "bg-rank-e", icon: TrendingUp };
  };

  const hunterRank = getHunterRank(level);
  const RankIcon = hunterRank.icon;

  return (
    <Card className="p-6 bg-gradient-shadow shadow-hunter border-2 border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-system opacity-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-primary">SYSTEM INTERFACE</h2>
          <p className="text-muted-foreground">Hunter Status Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${hunterRank.color} relative`}>
            <RankIcon className="w-6 h-6 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-lg animate-shadow-pulse" />
          </div>
          <div className="text-right">
            <Badge variant="outline" className={`${hunterRank.color} text-white border-none font-bold text-lg px-3 py-2`}>
              {hunterRank.rank}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">Level {level}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* EXP Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-experience animate-shadow-pulse" />
            <span className="font-bold text-secondary">EXPERIENCE</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="font-medium">{xp} EXP</span>
              <span>{xpToNext} EXP to rank up</span>
            </div>
            <Progress 
              value={xpProgress} 
              className="h-3 bg-background/50 border border-primary/30"
            />
          </div>
        </div>

        {/* Dungeon Clear Rate */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            <span className="font-bold text-secondary">CLEAR RATE</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="font-medium">{completedTasks} / {totalTasks} cleared</span>
              <span>{completionRate.toFixed(1)}%</span>
            </div>
            <Progress 
              value={completionRate} 
              className="h-3 bg-background/50 border border-primary/30"
            />
          </div>
        </div>

        {/* Daily Streak */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            <span className="font-bold text-secondary">DAILY STREAK</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-warning">{streak}</div>
            <div className="text-sm text-muted-foreground">
              consecutive<br />days active
            </div>
          </div>
        </div>
      </div>

      {/* System Notification */}
      <div className="mt-6 pt-6 border-t border-primary/20 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning animate-shadow-pulse" />
            <span className="font-bold text-secondary">SYSTEM ACHIEVEMENT</span>
          </div>
          <Badge variant="outline" className="border-accent/30 text-accent bg-accent/10">
            {level >= 10 ? "Awakened Hunter" : level >= 5 ? "Rising Hunter" : "Novice Hunter"}
          </Badge>
        </div>
      </div>
    </Card>
  );
};