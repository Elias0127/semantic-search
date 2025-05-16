import React from 'react';
import { MessageProps } from '../utils/types';

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp);
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
    >
      <div 
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white rounded-tr-none' 
            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
        }`}
      >
        <div className="break-words">{message.content}</div>
        <div 
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Message;