
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const { chats, setCurrentChat } = useChat();
  
  // Get all bookmarked chats
  const bookmarkedChats = chats.filter((chat) => chat.bookmarked);
  
  // Extract all images from AI responses across all chats
  const allImages = chats
    .flatMap((chat) =>
      chat.messages
        .filter((msg) => !msg.isUser && msg.images && msg.images.length > 0)
        .flatMap((msg) => msg.images?.map((image) => ({ 
          image, 
          chatId: chat.id,
          chatTitle: chat.title,
          timestamp: msg.timestamp
        })) || [])
    );
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Bookmarked Conversations</h2>
          {bookmarkedChats.length === 0 ? (
            <p className="text-muted-foreground">No bookmarked conversations yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedChats.map((chat) => (
                <Card key={chat.id} className="hover:border-primary cursor-pointer transition-all" 
                  onClick={() => {
                    setCurrentChat(chat.id);
                    window.location.href = "/";
                  }}>
                  <CardHeader className="pb-2">
                    <CardTitle>{chat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(chat.lastActive), "PPP 'at' p")}
                    </p>
                    {chat.messages.length > 0 && (
                      <div className="mt-3 text-sm text-foreground">
                        <span className="font-medium">First message: </span>
                        {chat.messages[0].content.length > 100
                          ? `${chat.messages[0].content.substring(0, 100)}...`
                          : chat.messages[0].content
                        }
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Saved Images</h2>
          {allImages.length === 0 ? (
            <p className="text-muted-foreground">No saved images yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allImages.map((item, index) => (
                <div key={index} className="group relative border rounded-lg overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={`Image from ${item.chatTitle}`} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm font-medium truncate">{item.chatTitle}</p>
                    <p className="text-xs opacity-80 mt-1">
                      {format(new Date(item.timestamp), "PP")}
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => {
                        setCurrentChat(item.chatId);
                        window.location.href = "/";
                      }}
                    >
                      View Chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
