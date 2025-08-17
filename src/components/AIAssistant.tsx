import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: "🌟 **Hunter System AI Assistant** 🌟\n\nGreetings, Hunter! I'm powered by advanced AI and ready to help you with:\n\n✨ Any questions about this webapp\n⚔️ Quest and life advice\n🤖 General knowledge and assistance\n🏆 Strategies for personal growth\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: userMessage,
          isSystemContext: true
        }
      });

      if (error) {
        throw error;
      }

      return data.response;
    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        title: "System Error",
        description: "Unable to reach AI core. Please try again.",
        variant: "destructive"
      });
      return "🔧 **System Maintenance**: The AI core is temporarily offline. Please try again in a moment, Hunter.";
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
        <ScrollArea className="h-96 w-full rounded-md border border-primary/20 p-4 bg-muted/30">
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
        
        <div className="flex gap-2 flex-wrap mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("How do I use this webapp?")}
            className="text-xs border-primary/30 hover:border-primary/60 hover:bg-primary/10"
          >
            📱 How to use
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Suggest some good quests for me")}
            className="text-xs border-primary/30 hover:border-primary/60 hover:bg-primary/10"
          >
            ⚔️ Quest ideas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Give me life advice")}
            className="text-xs border-primary/30 hover:border-primary/60 hover:bg-primary/10"
          >
            ✨ Life advice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};