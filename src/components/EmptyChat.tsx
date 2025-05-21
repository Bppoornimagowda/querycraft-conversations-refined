
import { MessageInput } from "@/components/MessageInput";

interface EmptyChatProps {
  onSendMessage: (message: string) => void;
}

export const EmptyChat = ({ onSendMessage }: EmptyChatProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to QueryCraft</h1>
      <p className="text-muted-foreground mb-8">Start a conversation by typing a message below</p>
      
      <div className="w-full max-w-xl px-4">
        <MessageInput 
          onSendMessage={onSendMessage}
          centered={true}
          autoFocus={true}
        />
      </div>
    </div>
  );
};
