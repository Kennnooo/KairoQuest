import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  className?: string;
}

export const AIAssistant = ({ className }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: "🌟 **Hunter System AI Assistant** 🌟\n\nGreetings, Hunter! I'm here to help you on your journey to S-Rank. Ask me about:\n\n✨ How to use this webapp effectively\n⚔️ Quest suggestions to level up\n🎯 Life advice to become your best self\n🏆 Strategies to maximize your progress\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing
    setIsLoading(true);
    
    try {
      // Create a context-aware response based on the user's question
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('how') && (lowerMessage.includes('use') || lowerMessage.includes('work'))) {
        return `🎮 **Hunter System Guide**

**Creating Dungeons (Tasks):**
• Click "CREATE DUNGEON" to add new quests
• Choose difficulty rank (E to S-Rank)
• Set estimated time and XP rewards
• Add subtasks for complex dungeons

**Progress Tracking:**
• Manual progress: Use +25%/-25% buttons
• Subtask progress: Automatically calculated
• Time tracking: Log hours spent on quests

**Leveling Up:**
• Complete dungeons to gain XP
• Higher difficulty = more XP rewards
• Maintain daily streaks for bonus rewards
• Reach new hunter ranks as you level up!`;
      }
      
      if (lowerMessage.includes('quest') || lowerMessage.includes('dungeon') || lowerMessage.includes('task')) {
        const questSuggestions = [
          "📚 **Learning Dungeons:**\n• Complete online course (B-Rank)\n• Read 1 book this month (A-Rank)\n• Learn new programming language (S-Rank)",
          "💪 **Fitness Dungeons:**\n• 30-day workout challenge (A-Rank)\n• Run 5km daily for a week (B-Rank)\n• Master a new yoga pose (C-Rank)",
          "🎨 **Creative Dungeons:**\n• Write a short story (B-Rank)\n• Learn to play a song (A-Rank)\n• Complete art project (C-Rank)",
          "🏠 **Life Skills Dungeons:**\n• Organize entire room (C-Rank)\n• Learn to cook new recipe (D-Rank)\n• Fix something broken (B-Rank)"
        ];
        
        const randomSuggestion = questSuggestions[Math.floor(Math.random() * questSuggestions.length)];
        return `⚔️ **Quest Suggestions for Your Hunter Journey**\n\n${randomSuggestion}\n\n💡 **Pro Tip:** Start with lower rank dungeons to build momentum, then challenge yourself with S-Rank quests!`;
      }
      
      if (lowerMessage.includes('life') || lowerMessage.includes('better') || lowerMessage.includes('improve') || lowerMessage.includes('advice')) {
        const lifeAdvice = [
          "🌱 **Growth Mindset:** Every failure is XP gained. Each setback teaches valuable lessons that make you stronger for the next challenge.",
          "⚡ **Consistency Over Intensity:** Small daily actions compound into extraordinary results. Better to do 15 minutes daily than 3 hours once a week.",
          "🎯 **Focus on Systems:** Don't just set goals, build systems. Good systems create lasting habits that automatically drive you toward success.",
          "🤝 **Build Your Guild:** Surround yourself with people who challenge and support you. Even solo hunters need allies.",
          "🧘 **Rest is Part of Training:** Recovery isn't laziness—it's preparation. Your mind and body need downtime to perform at S-Rank level."
        ];
        
        const randomAdvice = lifeAdvice[Math.floor(Math.random() * lifeAdvice.length)];
        return `✨ **Wisdom from the Hunter's Path**\n\n${randomAdvice}\n\n🏆 Remember: Becoming S-Rank in life isn't about perfection—it's about persistent growth and embracing the journey!`;
      }
      
      // Default response for other questions
      return `🤖 **System Processing...**\n\nI understand you're asking about: "${userMessage}"\n\nAs your Hunter System AI, I can help you with:\n\n🎮 **Webapp Usage** - How to navigate and use features\n⚔️ **Quest Planning** - Suggestions for meaningful challenges\n🌟 **Personal Growth** - Life advice and motivation\n📊 **Progress Optimization** - Tips to level up faster\n\nCould you be more specific about what area you'd like guidance on?`;
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await generateAIResponse(input);
    
    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, systemMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-primary/20 shadow-hunter", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Bot className="w-5 h-5" />
          <span className="bg-gradient-system bg-clip-text text-transparent">
            System AI Assistant
          </span>
          <Sparkles className="w-4 h-4 text-primary-glow animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-80 w-full rounded-md border border-primary/20 p-4 bg-muted/30">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 p-3 rounded-lg",
                  message.type === 'user' 
                    ? "bg-primary/10 ml-4" 
                    : "bg-accent/10 mr-4"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0",
                  message.type === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                )}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {message.type === 'user' ? 'Hunter' : 'System AI'}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 p-3 rounded-lg bg-accent/10 mr-4">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">System AI</div>
                  <div className="text-sm">
                    <span className="animate-pulse">Processing your request...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about quests, life advice, or how to use the app..."
            className="flex-1 bg-input/50 border-primary/30 focus:border-primary/60"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-system hover:shadow-glow-system transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("How do I use this webapp?")}
            className="text-xs border-primary/30 hover:border-primary/60"
          >
            📱 How to use
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Suggest some good quests for me")}
            className="text-xs border-primary/30 hover:border-primary/60"
          >
            ⚔️ Quest ideas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Give me life advice")}
            className="text-xs border-primary/30 hover:border-primary/60"
          >
            ✨ Life advice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};