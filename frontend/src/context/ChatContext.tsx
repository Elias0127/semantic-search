import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Product } from '../utils/types';

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id'>) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
  lastResults: Product[];
  setLastResults: (products: Product[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isTyping, setIsTyping] = useState(false);
  const [lastResults, setLastResults] = useState<Product[]>([]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
    setLastResults([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        isTyping,
        setIsTyping,
        clearMessages,
        lastResults,
        setLastResults,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
