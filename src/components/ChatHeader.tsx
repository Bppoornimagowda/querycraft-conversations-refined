
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Sun, 
  Edit, 
  Download 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const ChatHeader = () => {
  const { getCurrentChat, renameChat, toggleDarkMode, darkMode } = useChat();
  const currentChat = getCurrentChat();
  const { toast } = useToast();
  
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(currentChat?.title || "New Chat");

  const handleRename = () => {
    if (!currentChat || !newTitle.trim()) return;
    renameChat(currentChat.id, newTitle);
    setIsRenameDialogOpen(false);
  };

  const handleExport = (format: 'text' | 'markdown' | 'html' | 'pdf') => {
    if (!currentChat) return;

    let content = '';
    const filename = `${currentChat.title.replace(/\s+/g, '_')}_export`;

    // Generate content based on format
    switch (format) {
      case 'text':
        content = currentChat.messages.map(msg => 
          `${msg.isUser ? 'You' : 'QueryCraft'}: ${msg.content}`
        ).join('\n\n');
        downloadFile(`${filename}.txt`, content, 'text/plain');
        break;
        
      case 'markdown':
        content = currentChat.messages.map(msg => 
          `## ${msg.isUser ? 'You' : 'QueryCraft'}\n\n${msg.content}`
        ).join('\n\n');
        downloadFile(`${filename}.md`, content, 'text/markdown');
        break;
        
      case 'html':
        content = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${currentChat.title} - Chat Export</title>
            <style>
              body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              .message { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
              .user { background-color: #f0f4ff; border: 1px solid #dbeafe; }
              .assistant { background-color: #f9fafb; border: 1px solid #f3f4f6; }
              .sender { font-weight: bold; margin-bottom: 5px; }
            </style>
          </head>
          <body>
            <h1>${currentChat.title}</h1>
            ${currentChat.messages.map(msg => `
              <div class="message ${msg.isUser ? 'user' : 'assistant'}">
                <div class="sender">${msg.isUser ? 'You' : 'QueryCraft'}</div>
                <div>${msg.content.replace(/\n/g, '<br>')}</div>
              </div>
            `).join('')}
          </body>
          </html>
        `;
        downloadFile(`${filename}.html`, content, 'text/html');
        break;
        
      case 'pdf':
        toast({
          title: "Export as PDF",
          description: "PDF export functionality will be implemented soon.",
        });
        break;
    }
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: `Chat exported as ${filename}`,
    });
  };

  return (
    <div className="border-b border-border p-4 flex items-center justify-between bg-background">
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-foreground">
          {currentChat?.title || "New Chat"}
        </h2>
        {currentChat && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-1 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setNewTitle(currentChat.title);
              setIsRenameDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-1 text-muted-foreground hover:text-foreground"
              disabled={!currentChat || currentChat.messages.length === 0}
            >
              <Download className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('text')}>
              Export as Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('markdown')}>
              Export as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('html')}>
              Export as HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
