
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CloseIcon } from './icons/CloseIcon';
import { GeneratedImage } from '../types';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  remixImage?: GeneratedImage | null;
  onClearRemix?: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isLoading,
  remixImage,
  onClearRemix
}) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onGenerate();
        }
    };
    
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 z-30">
      <div className="container mx-auto max-w-2xl">
        {remixImage && (
            <div className="mb-3 flex items-center gap-3 bg-slate-800/80 border border-indigo-500/30 p-2 rounded-lg w-fit animate-slide-up">
                <div className="h-12 w-8 rounded overflow-hidden bg-slate-700">
                    <img 
                        src={`data:image/jpeg;base64,${remixImage.base64}`} 
                        alt="Remix source" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">Remixing Mode</span>
                    <span className="text-[10px] text-slate-400">Using image as reference</span>
                </div>
                <button 
                    onClick={onClearRemix}
                    className="ml-2 p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={remixImage ? "Describe how to change this image..." : 'e.g., "rainy cyberpunk lo-fi"'}
            className={`w-full bg-slate-800 border ${remixImage ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-slate-600'} rounded-full py-3 pl-4 pr-28 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
            disabled={isLoading}
          />
          <button
            onClick={onGenerate}
            disabled={isLoading || !prompt.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-full transition-all"
          >
            <SparklesIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{isLoading ? 'Generating...' : (remixImage ? 'Remix' : 'Generate')}</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PromptInput;
