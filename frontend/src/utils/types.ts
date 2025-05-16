export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export interface MessageProps {
  message: Message;
}

export interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  embedding?: number[];
  imageUrl: string;
}
