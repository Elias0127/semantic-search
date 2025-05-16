import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { MessageCircle, Sparkles } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '../context/ChatContext';
import ProductGrid from './ProductGrid';

const ChatInterface = () => {
  const {
    messages,
    addMessage,
    isTyping,
    setIsTyping,
    clearMessages,
    setLastResults,
    lastResults,
  } = useChat();

  /* ——— send query ——— */
  const send = async (content: string) => {
    if (!content.trim()) return;
  
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  
    addMessage({ sender: 'user', content, timestamp: new Date() });
    setIsTyping(true);
  

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: content }),
      });
      const data = await res.json();

      addMessage({
        sender: 'ai',
        content: data.answer ?? "Sorry, I couldn't find anything.",
        timestamp: new Date(),
      });

      setLastResults((data.results || []).length ? data.results : []);
    } catch {
      addMessage({
        sender: 'ai',
        content: 'Something went wrong. Please try again later.',
        timestamp: new Date(),
      });
      setLastResults([]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ——— UI ——— */
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl h-[90vh] shadow-2xl rounded-3xl flex flex-col backdrop-blur-lg">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-600" />
            <span className="font-semibold">Shop-AI Assistant</span>
          </CardTitle>

          <Button variant="ghost" size="sm" onClick={clearMessages}>
            Clear
          </Button>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
              <MessageCircle className="h-12 w-12 text-brand-500 mb-4" />
              <h2 className="text-lg font-medium text-gray-700">
                Welcome! Ask me about our products.
              </h2>
              <p className="text-gray-500 mt-1">“Got anything cool for summer?”</p>
            </div>
          ) : (
            <>
              <MessageList messages={messages} isTyping={isTyping} />

              {/* Inline product grid below latest AI response */}
              {(isTyping || lastResults.length > 0) && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Matching Products</h3>
                  <ProductGrid />
                </div>
              )}
            </>
          )}
        </ScrollArea>

        {/* Input */}
        <CardContent className="border-t">
          <MessageInput onSendMessage={send} disabled={isTyping} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
