'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User, CornerDownLeft, Loader2, Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WasteLog } from '@/lib/types';
import { chat, type ChatInput } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

const quickQuestions = [
  'What was the total waste generated?',
  'Which site had the highest recycling rate?',
  'What is the most common cause of waste?',
  'Summarize the waste logs for the Downtown Tower.',
];

export function AIChat({ logs }: { logs: WasteLog[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const sendMessage = async (question: string) => {
    if (!question.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: question }];
    setMessages(newMessages);
    setIsLoading(true);
    setInput('');

    try {
      const chatInput: ChatInput = {
        history: messages.map(m => ({ role: m.role, text: m.text })),
        question,
        wasteLogs: JSON.stringify(logs, (key, value) => 
          key === 'date' ? new Date(value).toISOString().split('T')[0] : value
        ),
      };

      const result = await chat(chatInput);
      
      setMessages([...newMessages, { role: 'assistant', text: result.answer }]);
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question);
  };
  
  const resetChat = () => {
    setMessages([]);
    setInput('');
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-xl bg-primary/90 hover:bg-primary"
        >
          <Sparkles className="h-8 w-8" />
          <span className="sr-only">Open AI Chat</span>
        </Button>
      </motion.div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col p-0" style={{width: 'min(90vw, 500px)'}}>
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span>AI Waste Analyst</span>
            </SheetTitle>
            <SheetDescription>
              Ask questions about the data currently shown on your dashboard.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
              <AnimatePresence initial={false}>
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-muted-foreground"
                  >
                    <p className="mb-4">No messages yet. Ask a question to get started!</p>
                    <div className="flex flex-col gap-2 text-sm">
                      {quickQuestions.map((q) => (
                        <Button
                          key={q}
                          variant="outline"
                          size="sm"
                          className="h-auto py-2"
                          onClick={() => handleQuickQuestion(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {messages.map((message, index) => (
                   <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : ''
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 border-2 border-primary">
                        <AvatarFallback><Bot size={18}/></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg p-3 text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="min-w-0 break-words">{message.text}</p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><User size={18}/></AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                     <Avatar className="h-8 w-8 border-2 border-primary">
                        <AvatarFallback><Bot size={18}/></AvatarFallback>
                      </Avatar>
                    <div className="bg-muted rounded-lg p-3 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background">
             <form onSubmit={handleFormSubmit} className="relative">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about your waste data..."
                className="pr-10"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7"
                disabled={isLoading || !input.trim()}
              >
                <CornerDownLeft className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <Button variant="link" size="sm" className="w-full mt-2 text-muted-foreground" onClick={resetChat}>
                Reset Chat
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
