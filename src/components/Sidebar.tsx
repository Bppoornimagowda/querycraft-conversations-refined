
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { 
  Bookmark, 
  BookmarkCheck, 
  MessageSquare, 
  Plus, 
  MoreVertical,
  Settings,
  HelpCircle,
  PieChart,
  Copy,
  Edit, 
  Trash2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export const Sidebar = () => {
  const { 
    chats, 
    createNewChat, 
    setCurrentChat, 
    bookmarkChat,
    bookmarkMessage, 
    deleteChat,
    renameChat,
    currentChatId,
    getBookmarkedMessages
  } = useChat();
  
  const [activeTab, setActiveTab] = useState<"history" | "bookmarked">("history");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<{id: string, title: string} | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const bookmarkedMessages = getBookmarkedMessages();

  const openRenameDialog = (id: string, currentTitle: string) => {
    setChatToRename({ id, title: currentTitle });
    setNewTitle(currentTitle);
    setIsRenameDialogOpen(true);
  };

  const handleRename = () => {
    if (chatToRename && newTitle.trim()) {
      renameChat(chatToRename.id, newTitle);
      setIsRenameDialogOpen(false);
    }
  };

  // Handle removing a bookmark from a message
  const handleToggleMessageBookmark = (messageId: string) => {
    bookmarkMessage(messageId);
  };

  return (
    <div className="w-64 lg:w-72 h-full bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* User Profile */}
      <div className="p-4 flex items-center">
        <Avatar className="h-8 w-8 rounded-full">
          <div className="h-full w-full bg-gradient-to-r from-indigo-400 to-blue-500"></div>
        </Avatar>
        <div className="ml-3">
          <p className="text-sm font-medium text-sidebar-foreground">John Doe</p>
          <p className="text-xs text-muted-foreground">Free Account</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto text-sidebar-foreground">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {/* New Chat Button */}
      <div className="px-4 mb-4">
        <Button 
          className="w-full bg-chatgpt-blue hover:bg-chatgpt-blue-hover text-white flex items-center justify-center"
          onClick={createNewChat}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      {/* Chat History / Bookmarked Tabs */}
      <div className="px-4 flex border-b border-sidebar-border">
        <button 
          onClick={() => setActiveTab("history")}
          className={`py-2 px-3 text-sm ${activeTab === "history" 
            ? "text-sidebar-foreground font-medium" 
            : "text-muted-foreground hover:text-sidebar-foreground"}`}
        >
          Chat History
        </button>
        <button 
          onClick={() => setActiveTab("bookmarked")}
          className={`py-2 px-3 text-sm ${activeTab === "bookmarked" 
            ? "text-sidebar-foreground font-medium" 
            : "text-muted-foreground hover:text-sidebar-foreground"}`}
        >
          Bookmarked
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "history" ? (
          // Chat History Tab
          <>
            {chats
              .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
              .map(chat => (
                <div 
                  key={chat.id} 
                  className={`px-3 py-3 hover:bg-sidebar-accent cursor-pointer flex justify-between items-start group
                    ${currentChatId === chat.id ? "bg-sidebar-accent" : ""}`}
                  onClick={() => setCurrentChat(chat.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {chat.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''} • {
                        formatDistanceToNow(new Date(chat.lastActive), { addSuffix: true })
                      }
                    </p>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        bookmarkChat(chat.id);
                      }}
                    >
                      {chat.bookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          openRenameDialog(chat.id, chat.title);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {chats.length === 0 && (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No chat history</p>
                  <p className="mt-1 text-xs">Start a new conversation!</p>
                </div>
              )}
          </>
        ) : (
          // Bookmarked Tab
          <>
            {bookmarkedMessages.map(message => (
              <div 
                key={message.id} 
                className="px-3 py-3 hover:bg-sidebar-accent cursor-pointer flex justify-between items-start group"
                onClick={() => setCurrentChat(message.chatId)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {message.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    From: {message.chatTitle} • {
                      formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
                    }
                  </p>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-amber-500 hover:text-amber-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMessageBookmark(message.id);
                    }}
                  >
                    <BookmarkCheck className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {bookmarkedMessages.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No bookmarked messages</p>
                <p className="mt-1 text-xs">Bookmark important questions to find them here</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Dashboard Button */}
      <div className="mt-auto border-t border-sidebar-border p-4">
        <Button 
          variant="outline" 
          className="w-full bg-background hover:bg-secondary text-foreground"
          onClick={() => window.location.href = "/dashboard"}
        >
          Dashboard
        </Button>
      </div>
      
      {/* Footer Navigation */}
      <div className="border-t border-sidebar-border py-4 px-6 flex justify-around">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-sidebar-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-sidebar-foreground">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-sidebar-foreground">
          <Copy className="h-5 w-5" />
        </Button>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter a new title"
            className="mt-2"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
