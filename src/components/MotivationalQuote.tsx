import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, RefreshCw, Sparkles } from "lucide-react";

interface MotivationalQuoteProps {
  aiMotivation?: string;
  onGetNewQuote: () => void;
  isLoading?: boolean;
}

const defaultQuotes = [
  {
    text: "I'm gonna be the King of the Pirates!",
    author: "Monkey D. Luffy",
    anime: "One Piece"
  },
  {
    text: "Power comes in response to a need, not a desire.",
    author: "Goku",
    anime: "Dragon Ball Z"
  },
  {
    text: "Dreams don't have an expiration date!",
    author: "Brook",
    anime: "One Piece"
  },
  {
    text: "I would rather be a failure at something I love than a success at something I hate.",
    author: "Vegeta",
    anime: "Dragon Ball Z"
  },
  {
    text: "If you don't take risks, you can't create a future!",
    author: "Monkey D. Luffy",
    anime: "One Piece"
  }
];

export const MotivationalQuote = ({ aiMotivation, onGetNewQuote, isLoading }: MotivationalQuoteProps) => {
  const [currentQuote, setCurrentQuote] = useState(defaultQuotes[0]);

  useEffect(() => {
    const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const getNewQuote = () => {
    const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
    setCurrentQuote(randomQuote);
    onGetNewQuote();
  };

  return (
    <Card className="p-6 bg-gradient-hero text-primary-foreground shadow-glow-primary">
      <div className="flex items-start gap-4">
        <Quote className="w-8 h-8 text-primary-foreground/80 flex-shrink-0 mt-1" />
        
        <div className="flex-1">
          {aiMotivation ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">AI Motivation</span>
              </div>
              <p className="text-lg font-medium leading-relaxed">{aiMotivation}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-lg font-medium leading-relaxed">"{currentQuote.text}"</p>
              <div className="text-sm opacity-90">
                <span className="font-medium">— {currentQuote.author}</span>
                <span className="ml-2 opacity-75">({currentQuote.anime})</span>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={getNewQuote}
            disabled={isLoading}
            className="mt-4 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Getting Inspiration...' : 'New Inspiration'}
          </Button>
        </div>
      </div>
    </Card>
  );
};