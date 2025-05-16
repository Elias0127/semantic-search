import React, {
  useEffect,
  useRef,
  useState,
  FormEvent,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const MessageInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Auto-focus on mount */
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  /* Helpers */
  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
    resetHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    resetHeight();
  };

  /* ——————————————————— UI ——————————————————— */
  return (
    <form onSubmit={handleSubmit} className="relative flex items-end">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Ask me anything…"
        disabled={disabled}
        className="
          w-full resize-none rounded-2xl bg-white/60 backdrop-blur-md shadow-inner
          border border-gray-200 py-3 pl-4 pr-12 text-sm
          placeholder-gray-500
          focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all
        "
        style={{ minHeight: '48px', maxHeight: '200px' }}
      />

      {/* Send FAB */}
      <button
        type="submit"
        aria-label="Send message"
        disabled={!text.trim() || disabled}
        className={`
          absolute bottom-1.5 right-2 flex h-9 w-9 items-center justify-center rounded-full
          transition-all
          ${!text.trim() || disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-95'}
        `}
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default MessageInput;
