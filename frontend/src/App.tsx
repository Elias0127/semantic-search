import React from 'react';
import ChatInterface from './components/ChatInterface';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </div>
  );
}

export default App;