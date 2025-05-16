import React, { useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '../context/ChatContext';
import { MessageCircle } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { messages, addMessage, isTyping, setIsTyping, clearMessages } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addMessage({
      content,
      sender: 'user',
      timestamp: new Date(),
    });
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      addMessage({
        content: getAIResponse(content),
        sender: 'ai',
        timestamp: new Date(),
      });
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const getAIResponse = (userMessage: string): string => {
    // Simple response logic - in a real app, this would call an AI API
    const responses = [
      "I understand what you're saying about \"" + userMessage + "\". Can you tell me more?",
      "That's an interesting point about \"" + userMessage + "\". Let me think about that...",
      "I'm processing your message about \"" + userMessage + "\". Here's what I think...",
      "Thanks for sharing your thoughts on \"" + userMessage + "\". I'd like to explore that further.",
      "I appreciate your perspective on \"" + userMessage + "\". Here's my response...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">AI Chat</h1>
        </div>
        <button 
          onClick={clearMessages}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1 border border-gray-300 rounded-md hover:border-gray-400"
        >
          Clear Chat
        </button>
      </header>

      {/* Chat container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden flex flex-col bg-gray-50 relative"
      >
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md mx-auto">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Welcome to AI Chat</h3>
                <p className="text-gray-500">
                  Start a conversation by typing a message below. I'm here to assist you with any questions you might have.
                </p>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} isTyping={isTyping} />
          )}
        </div>
        
        {/* Input area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <MessageInput 
            onSendMessage={handleSendMessage} 
            disabled={isTyping} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;