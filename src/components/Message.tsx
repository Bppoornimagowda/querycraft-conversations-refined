
import React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/context/ChatContext";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const renderContent = () => {
    return (
      <div className="markdown-content">
        <ReactMarkdown
          components={{
            code: ({ node, className, children, ...props }) => {
              // Check if this is an inline code block
              const isInline = !className;
              const match = /language-(\w+)/.exec(className || "");
              const codeContent = String(children).replace(/\n$/, "");
              
              if (!isInline && match) {
                return (
                  <div className="relative">
                    <div className="flex justify-between items-center bg-muted/70 p-2 text-xs rounded-t-md">
                      <span className="font-mono text-muted-foreground">
                        {match[1]}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => copyToClipboard(codeContent)}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="mt-0 rounded-t-none">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              }
              
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    );
  };

  // Render message images if they exist
  const renderImages = () => {
    if (!message.images || message.images.length === 0) return null;
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-3">
        {message.images.map((imageUrl, index) => (
          <img 
            key={index}
            src={imageUrl} 
            alt={`Generated image ${index + 1}`} 
            className="rounded-md max-w-full"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className={`flex gap-4 max-w-3xl mx-auto`}>
        <div className="mt-0.5 flex-shrink-0">
          {message.isUser ? (
            <Avatar className="h-8 w-8">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-400 to-blue-500"></div>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
            </Avatar>
          )}
        </div>
        
        <div className="flex-1">
          <div className="mb-1 text-xs font-medium">
            {message.isUser ? "You" : "QueryCraft"}
          </div>
          
          <div className={`rounded-lg p-4 ${
            message.isUser
              ? "bg-chatgpt-user-bubble dark:bg-chatgpt-user-bubble-dark border border-blue-100 dark:border-blue-800/30"
              : "bg-chatgpt-ai-bubble dark:bg-chatgpt-ai-bubble-dark border border-gray-100 dark:border-gray-800/30"
          }`}>
            <div className={`${
              message.isUser
                ? "text-blue-800 dark:text-blue-200"
                : "text-gray-800 dark:text-gray-200"
            }`}>
              {renderContent()}
              {renderImages()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

