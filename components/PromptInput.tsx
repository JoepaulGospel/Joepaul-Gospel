import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onGenerate();
        }
    };
    
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 z-30">
      <div className="container mx-auto max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g., "rainy cyberpunk lo-fi"'
            className="w-full bg-slate-800 border border-slate-600 rounded-full py-3 pl-4 pr-28 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={onGenerate}
            disabled={isLoading || !prompt.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-full transition-all"
          >
            <SparklesIcon className="w-5 h-5" />
            {/* CHANGED TO ELON MODE FOR DIAGNOSTIC TEST */}
            <span className="hidden sm:inline">{isLoading ? 'Creating...' : 'ELON MODE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
