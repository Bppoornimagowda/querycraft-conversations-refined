
import { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatHeader } from "@/components/ChatHeader";
import { Message } from "@/components/Message";
import { EmptyChat } from "@/components/EmptyChat";
import { MessageInput } from "@/components/MessageInput";

export const ChatArea = () => {
  const { getCurrentChat, addMessage, currentChatId } = useChat();
  const currentChat = getCurrentChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);

  const handleSendMessage = (content: string) => {
    // Add user message
    addMessage(content, true);

    // Simulate AI response (with a brief delay)
    setTimeout(() => {
      let response = generateAIResponse(content);
      addMessage(response, false);
    }, 1000);
  };

  // Simple AI response generator for demonstration
  const generateAIResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Example responses based on user input
    if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
      return "Hello! How can I help you today?";
    }
    
    if (lowercaseMessage.includes("who are you") || lowercaseMessage.includes("what are you")) {
      return "I'm QueryCraft, an AI assistant designed to help answer your questions and have conversations.";
    }
    
    if (lowercaseMessage.includes("code") || lowercaseMessage.includes("programming")) {
      return "Here's an example of JavaScript code:\n\n```javascript\nconst greeting = (name) => {\n  return `Hello, ${name}!`;\n};\n\nconsole.log(greeting('User'));\n```\n\nYou can copy this code and use it in your project.";
    }
    
    if (lowercaseMessage.includes("markdown")) {
      return "Markdown is a lightweight markup language that you can use to add formatting to plaintext text documents.\n\nHere's an example:\n\n# Heading 1\n## Heading 2\n\n*italic text* or _italic text_\n\n**bold text** or __bold text__\n\n- List item 1\n- List item 2\n\n1. Ordered item 1\n2. Ordered item 2\n\n[Link text](https://example.com)";
    }

    // Default response for other inputs
    return `Thank you for your message. You said: "${userMessage}". How can I assist you further?`;
  };

  // If there's no current chat, show empty state
  if (!currentChatId || !currentChat) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <EmptyChat onSendMessage={handleSendMessage} />
      </div>
    );
  }

  // If there's a current chat with no messages, show empty chat
  if (currentChat.messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <ChatHeader />
        <EmptyChat onSendMessage={handleSendMessage} />
      </div>
    );
  }

  // Show active chat with messages
  return (
    <div className="flex-1 flex flex-col bg-background">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4">
        {currentChat.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-border p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
