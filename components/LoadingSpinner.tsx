
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center p-8">
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-indigo-500 border-l-indigo-500 border-b-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-300 font-semibold tracking-wide">Generating your vibe...</p>
      <p className="mt-2 text-sm text-slate-400">This might take a moment.</p>
    </div>
  );
};

export default LoadingSpinner;
