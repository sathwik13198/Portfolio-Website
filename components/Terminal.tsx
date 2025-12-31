import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';

interface Line {
  type: 'input' | 'output' | 'error' | 'info';
  text: string;
}

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([
    { type: 'info', text: "Welcome to Sathwik's portfolio terminal." },
    { type: 'info', text: "Type 'help' for a list of available commands." },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isInChatMode, setIsInChatMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const endOfLinesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endOfLinesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const handleCommand = useCallback(async (command: string) => {
    const newLines: Line[] = [...lines, { type: 'input', text: command }];
    
    if (command) {
        setHistory(prev => [command, ...prev].slice(0, 50));
        setHistoryIndex(-1);
    }
    
    if (isInChatMode) {
      if (command.toLowerCase() === 'exit') {
        setIsInChatMode(false);
        setChatHistory([]);
        newLines.push({ type: 'info', text: 'Exited chat mode.' });
        setLines(newLines);
      } else {
        setLines(newLines);
        setIsLoading(true);
        const userMessage: ChatMessage = { role: 'user', parts: [{ text: command }] };
        const newChatHistory = [...chatHistory, userMessage];
        const response = await getChatbotResponse(command, newChatHistory);
        setChatHistory([...newChatHistory, { role: 'model', parts: [{ text: response }] }]);
        setLines(prev => [...prev, { type: 'output', text: response }]);
        setIsLoading(false);
      }
      return;
    }

    const [cmd] = command.toLowerCase().split(' ');
    switch (cmd) {
      case 'help':
        newLines.push({ type: 'info', text: "Available commands:\n'chat' or 'talk' - Start a conversation with my AI assistant.\n'clear' - Clear the terminal screen.\n'whoami' - Display user information.\n'date' - Show the current date.\n'help' - Show this help message." });
        break;
      case 'chat':
      case 'talk':
        setIsInChatMode(true);
        setChatHistory([]);
        newLines.push({ type: 'info', text: 'Chat mode enabled. Ask me anything about my resume! Type \'exit\' to end the conversation.' });
        break;
      case 'clear':
        setLines([]);
        return;
      case 'whoami':
        newLines.push({ type: 'output', text: 'guest' });
        break;
      case 'date':
        newLines.push({ type: 'output', text: new Date().toString() });
        break;
      case '':
        break;
      default:
        newLines.push({ type: 'error', text: `command not found: ${command}` });
    }
    setLines(newLines);
  }, [lines, isInChatMode, chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    handleCommand(input);
    setInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
        } else {
            setHistoryIndex(-1);
            setInput('');
        }
    }
  };


  return (
    <div className="bg-black/80 dark:bg-black/90 backdrop-blur-sm text-white font-mono text-sm h-full flex flex-col p-2" onClick={() => inputRef.current?.focus()}>
      <div className="flex-grow overflow-y-auto pr-2">
        {lines.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line.type === 'input' && <span className="text-cyan-400">guest@portfolio:~$ </span>}
            <span className={
                line.type === 'error' ? 'text-red-400' :
                line.type === 'info' ? 'text-yellow-400' :
                'text-gray-200'
            }>{line.text}</span>
          </div>
        ))}
        {isLoading && <div className="text-gray-400 animate-pulse">Assistant is typing...</div>}
        <div ref={endOfLinesRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <span className="text-cyan-400 mr-2">guest@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none text-white focus:outline-none w-full"
          autoFocus
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default Terminal;
