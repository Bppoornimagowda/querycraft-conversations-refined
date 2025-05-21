
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ChatMessage = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  images?: string[];
};

export type Chat = {
  id: string;
  title: string;
  messages: ChatMessage[];
  bookmarked: boolean;
  lastActive: Date;
  createdAt: Date;
};

type ChatContextType = {
  chats: Chat[];
  currentChatId: string | null;
  darkMode: boolean;
  createNewChat: () => void;
  setCurrentChat: (id: string) => void;
  addMessage: (content: string, isUser: boolean, images?: string[]) => void;
  bookmarkChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
  toggleDarkMode: () => void;
  getCurrentChat: () => Chat | undefined;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize with localStorage or default values
  useEffect(() => {
    const savedChats = localStorage.getItem("chats");
    const savedCurrentChatId = localStorage.getItem("currentChatId");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      // Convert string dates back to Date objects
      const processedChats = parsedChats.map((chat: any) => ({
        ...chat,
        lastActive: new Date(chat.lastActive),
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      setChats(processedChats);
    }

    if (savedCurrentChatId) {
      setCurrentChatId(savedCurrentChatId);
    }

    if (savedDarkMode) {
      const isDark = savedDarkMode === "true";
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem("currentChatId", currentChatId);
    }
  }, [currentChatId]);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      bookmarked: false,
      lastActive: new Date(),
      createdAt: new Date(),
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
  };

  const setCurrentChat = (id: string) => {
    setCurrentChatId(id);
  };

  const addMessage = (content: string, isUser: boolean, images: string[] = []) => {
    if (!currentChatId) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      content,
      isUser,
      timestamp: new Date(),
      images,
    };

    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === currentChatId) {
          // If it's the first message, use it to create a title
          const updatedTitle =
            chat.messages.length === 0 && isUser
              ? content.substring(0, 20) + (content.length > 20 ? "..." : "")
              : chat.title;

          return {
            ...chat,
            title: updatedTitle,
            messages: [...chat.messages, newMessage],
            lastActive: new Date(),
          };
        }
        return chat;
      });
    });
  };

  const bookmarkChat = (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, bookmarked: !chat.bookmarked } : chat
      )
    );
  };

  const deleteChat = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
    
    // If the deleted chat was the current one, reset currentChatId
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const getCurrentChat = () => {
    return chats.find((chat) => chat.id === currentChatId);
  };

  const value = {
    chats,
    currentChatId,
    darkMode,
    createNewChat,
    setCurrentChat,
    addMessage,
    bookmarkChat,
    deleteChat,
    renameChat,
    toggleDarkMode,
    getCurrentChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
