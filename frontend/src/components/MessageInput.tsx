import React, { useState, useRef, useEffect } from 'react';
import { ChatInputProps } from '../utils/types';
import { Send } from 'lucide-react';

const MessageInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus the input when the component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      // Reset the textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea based on content
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
    textarea.style.height = `${newHeight}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="w-full resize-none bg-gray-100 border border-gray-300 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition-all overflow-y-auto"
          style={{ minHeight: '50px', maxHeight: '200px' }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`absolute right-2 bottom-2 p-2 rounded-full ${
            !message.trim() || disabled
              ? 'text-gray-400 bg-gray-200'
              : 'text-white bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;