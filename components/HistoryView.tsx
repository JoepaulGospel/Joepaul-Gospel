import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface HistoryViewProps {
  history: string[];
  onSelect: (prompt: string) => void;
  onClose: () => void;
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onClose, onClear }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Prompt History
          </h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
                <button 
                    onClick={onClear}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors"
                    title="Clear History"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}
            <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500">
              <SparklesIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>No history yet.</p>
              <p className="text-sm mt-2">Generate some wallpapers to see them here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => onSelect(item)}
                    className="w-full text-left p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-indigo-500/50 transition-all group"
                  >
                    <p className="text-slate-200 font-medium line-clamp-2 group-hover:text-white">{item}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <SparklesIcon className="w-3 h-3" />
                        <span>Regenerate</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HistoryView;