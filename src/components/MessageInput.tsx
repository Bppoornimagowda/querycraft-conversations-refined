
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  maxLength?: number;
  centered?: boolean;
  autoFocus?: boolean;
}

export const MessageInput = ({ 
  onSendMessage, 
  maxLength = 4000,
  centered = false,
  autoFocus = false
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  
  const handleSend = () => {
    if (message.trim().length === 0) return;
    
    if (message.length > maxLength) {
      toast({
        title: "Message too long",
        description: `Your message exceeds the maximum length of ${maxLength} characters.`,
        variant: "destructive",
      });
      return;
    }
    
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`relative ${centered ? "max-w-xl mx-auto" : "max-w-3xl mx-auto"}`}>
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          className="w-full border border-input rounded-lg py-3 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-ring resize-none bg-background text-foreground"
          rows={1}
          style={{
            minHeight: "50px",
            maxHeight: "200px",
            height: "auto"
          }}
          autoFocus={autoFocus}
        />
        <div className="absolute right-3 bottom-3 flex items-center">
          <span className="text-xs text-muted-foreground mr-2">
            {message.length}/{maxLength}
          </span>
          <Button
            onClick={handleSend}
            size="sm"
            className={`rounded-full p-1.5 ${
              message.trim() 
                ? "bg-chatgpt-blue hover:bg-chatgpt-blue-hover" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            disabled={message.trim().length === 0}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
