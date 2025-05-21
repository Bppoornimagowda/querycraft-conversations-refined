
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { useChat } from "@/context/ChatContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

const Index = () => {
  const { chats, createNewChat } = useChat();
  const isMobile = useIsMobile();

  // Create a new chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats.length, createNewChat]);

  // For desktop, render the sidebar alongside the chat area
  if (!isMobile) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatArea />
        </main>
      </div>
    );
  }

  // For mobile, render a collapsible sidebar
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="bg-background border-b border-border p-2 flex items-center lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-medium mx-auto">QueryCraft</h1>
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatArea />
      </main>
    </div>
  );
};

export default Index;
