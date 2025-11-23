
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center p-4">
        <div className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6">
            <SparklesIcon className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to VibeWall</h2>
        <p className="max-w-md text-slate-400">
            Describe a vibe, a scene, or a feeling in the box below and get four unique phone wallpapers generated just for you.
        </p>
    </div>
  );
};

export default WelcomeScreen;
