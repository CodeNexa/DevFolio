import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Loader2, CornerDownLeft } from "lucide-react";
import brain from "brain";
import { ChatResponse } from "types"; // Assuming ChatResponse is defined in types.ts from brain generation

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(`session_${Date.now()}`); // Simple session ID

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    // TODO: Implement proper scroll to bottom for message list
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);
    scrollToBottom();

    try {
      // const response = await brain.handle_chat_message({ question: userMessage.text, session_id: sessionId });
      // const data: ChatResponse = await response.json();
      
      // TEMP: Mock response due to OpenAI quota issue on MYA-5
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const data: ChatResponse = {
        answer: `This is a mock response to your question: "${userMessage.text}". The real chatbot API is temporarily unavailable due to OpenAI quota issues.`,
        session_id: sessionId,
      };
      // END TEMP

      if (data.answer) {
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          text: data.answer,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setError("The bot didn't provide a response. Please try again.");
      }
    } catch (err: any) {
      console.error("Chatbot API error:", err);
      let errorMessage = "Failed to connect to the chatbot. Please check your connection or try again later.";
      if (err.message && err.message.includes("quota")) {
        errorMessage = "Chatbot is temporarily unavailable due to high demand (quota exceeded). Please try again later.";
      }
      setError(errorMessage);
      // Optionally add the error as a bot message
      const errorBotMessage: ChatMessage = {
        id: `bot_error_${Date.now()}`,
        text: errorMessage,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    }
    setIsLoading(false);
    scrollToBottom();
  };

  useEffect(() => {
    // Example welcome message
    setMessages([
      {
        id: "welcome_1",
        text: "Hello! I am DevFolio AI. Ask me anything about Mwenda_Dipark Solutions' skills, projects, or experience.",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);
  
  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
        if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <Card className="w-80 md:w-96 h-[500px] md:h-[600px] shadow-2xl border-2 border-primary/50 bg-background flex flex-col transition-all duration-300 ease-in-out transform-gpu animate-slide-in-up">
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b-2 border-primary/30 bg-primary/10">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-primary mr-2" />
              <CardTitle className="text-lg font-mono text-primary">DevFolio AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-primary hover:text-accent">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-hidden">
            <ScrollArea className="h-full p-3" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] p-2.5 rounded-lg shadow-sm border text-sm leading-relaxed
                      ${msg.sender === "user"
                        ? "ml-auto bg-primary/80 text-primary-foreground border-primary/90 rounded-br-none"
                        : "mr-auto bg-muted text-muted-foreground border-border rounded-bl-none"}
                      ${msg.text.includes("unavailable") || msg.text.includes("Failed to connect") ? "bg-destructive/20 border-destructive/50 text-destructive-foreground" : ""}
                    `}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-xs mt-1.5 self-end opacity-70">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center justify-start mr-auto">
                    <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                    <p className="text-sm text-muted-foreground italic">DevFolio AI is thinking...</p>
                  </div>
                )}
                {error && !messages.some(m => m.text === error) && (
                     <div className="flex flex-col max-w-[85%] p-2.5 rounded-lg shadow-sm border text-sm leading-relaxed bg-destructive/20 border-destructive/50 text-destructive-foreground rounded-bl-none">
                        <p className="whitespace-pre-wrap">{error}</p>
                     </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t-2 border-primary/30 bg-primary/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Ask about skills, projects..."
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
                className="flex-1 h-10 bg-background/70 border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/80 placeholder:text-muted-foreground/70 font-mono text-sm"
              />
              <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ""} className="bg-primary hover:bg-accent text-primary-foreground w-10 h-10">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CornerDownLeft className="h-5 w-5" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      <Button
        onClick={toggleChat}
        size="lg"
        className={`rounded-full shadow-xl p-4 h-16 w-16 transition-all duration-300 ease-in-out transform hover:scale-110 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background 
          ${isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"}
          bg-primary hover:bg-accent text-primary-foreground border-2 border-background/50
        `}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
      </Button>
    </div>
  );
};
