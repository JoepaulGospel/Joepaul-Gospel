
import React from 'react';
import { GeneratedImage } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { RemixIcon } from './icons/RemixIcon';

interface FullScreenViewProps {
  image: GeneratedImage;
  onClose: () => void;
  onDownload: () => void;
  onRemix: () => void;
}

const FullScreenView: React.FC<FullScreenViewProps> = ({ image, onClose, onDownload, onRemix }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative w-full h-full max-w-md max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={`data:image/jpeg;base64,${image.base64}`}
          alt="Selected wallpaper"
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-indigo-900/50"
        />

        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-10 h-10 bg-slate-800/80 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-full border border-slate-700">
           <button
            onClick={onDownload}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-full transition-all"
          >
            <DownloadIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={onRemix}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-full transition-all"
          >
            <RemixIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Remix</span>
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FullScreenView;
