import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw, Zap } from "lucide-react";

interface MotivationalQuoteProps {
  aiMotivation?: string;
  onGetNewQuote: () => void;
  isLoading?: boolean;
}

const systemMessages = [
  {
    text: "Only those who risk going too far can possibly find out how far they can go.",
    type: "SYSTEM NOTIFICATION",
    source: "Hunter Database"
  },
  {
    text: "The strongest people aren't always the people who win, but the people who don't give up when they lose.",
    type: "DAILY MISSION BRIEF",
    source: "System Advisory"
  },
  {
    text: "Your current abilities are not your limits. Keep pushing forward, Hunter.",
    type: "LEVEL UP GUIDANCE",
    source: "System AI"
  },
  {
    text: "Every dungeon cleared brings you closer to S-Rank. Trust the process.",
    type: "PROGRESS UPDATE",
    source: "Hunter Association"
  },
  {
    text: "Remember: Even the weakest hunter can become the strongest through consistent effort.",
    type: "MOTIVATION PROTOCOL",
    source: "System Core"
  }
];

export const MotivationalQuote = ({ aiMotivation, onGetNewQuote, isLoading }: MotivationalQuoteProps) => {
  const [currentMessage, setCurrentMessage] = useState(systemMessages[0]);

  useEffect(() => {
    const randomMessage = systemMessages[Math.floor(Math.random() * systemMessages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  const getNewMessage = () => {
    const randomMessage = systemMessages[Math.floor(Math.random() * systemMessages.length)];
    setCurrentMessage(randomMessage);
    onGetNewQuote();
  };

  return (
    <Card className="p-6 bg-gradient-system shadow-glow-system border-2 border-primary/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-2 bg-primary/20 rounded-lg">
          <MessageSquare className="w-6 h-6 text-primary-foreground" />
        </div>
        
        <div className="flex-1">
          {aiMotivation ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground/90">SYSTEM AI ANALYSIS</span>
              </div>
              <p className="text-lg font-medium leading-relaxed text-primary-foreground">{aiMotivation}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary-foreground/70 tracking-wider">{currentMessage.type}</span>
              </div>
              <p className="text-lg font-medium leading-relaxed text-primary-foreground">
                "{currentMessage.text}"
              </p>
              <div className="text-sm text-primary-foreground/80">
                <span className="font-medium">— {currentMessage.source}</span>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={getNewMessage}
            disabled={isLoading}
            className="mt-4 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'ANALYZING...' : 'NEW SYSTEM MESSAGE'}
          </Button>
        </div>
      </div>
    </Card>
  );
};