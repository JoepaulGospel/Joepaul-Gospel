
import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { GeneratedImage } from './types';
import { generateWallpapers, remixWallpapers } from './services/geminiService';
import PromptInput from './components/PromptInput';
import ImageGrid from './components/ImageGrid';
import FullScreenView from './components/FullScreenView';
import LoadingSpinner from './components/LoadingSpinner';
import WelcomeScreen from './components/WelcomeScreen';
import HistoryView from './components/HistoryView';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';

const HISTORY_KEY = 'vibewall_history';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [remixImage, setRemixImage] = useState<GeneratedImage | null>(null);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleGenerate = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt.trim()) {
      setError("Please enter a vibe for your wallpaper.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setImages([]);
    setPrompt(currentPrompt); // Ensure prompt state reflects the executed prompt

    // Update history
    setHistory(prev => {
        // Remove duplicates of current prompt and limit to 20 items
        const newHistory = [currentPrompt, ...prev.filter(p => p !== currentPrompt)].slice(0, 20);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
    });

    try {
      let generatedImages: GeneratedImage[];
      if (remixImage) {
        generatedImages = await remixWallpapers(currentPrompt, remixImage.base64);
        setRemixImage(null); // Clear remix mode after successful generation
      } else {
        generatedImages = await generateWallpapers(currentPrompt);
      }
      setImages(generatedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [remixImage]);

  const handleRemix = useCallback(() => {
    if (selectedImage) {
        setRemixImage(selectedImage);
        setSelectedImage(null);
        // We keep the current prompt so the user can edit it
    }
  }, [selectedImage]);

  const handleClearRemix = () => {
    setRemixImage(null);
  };

  const handleSelectImage = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  
  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${image.base64}`;
    link.download = `vibewall-${prompt.replace(/\s+/g, '_')}-${image.id}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) return;

    try {
      const zip = new JSZip();
      const folderName = `vibewall-${prompt.replace(/\s+/g, '_')}`;
      const folder = zip.folder(folderName);

      if (folder) {
        images.forEach((img, index) => {
          folder.file(`${folderName}-${index + 1}.jpg`, img.base64, { base64: true });
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${folderName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    } catch (err) {
      console.error("Error creating zip:", err);
      // Fallback or simple error handling could go here
    }
  };

  const handleHistorySelect = (selectedPrompt: string) => {
    setShowHistory(false);
    handleGenerate(selectedPrompt);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-gray-200 font-sans flex flex-col">
      <header className="p-4 border-b border-slate-700/50 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-20">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6 text-indigo-400" />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                    <h1 className="text-xl font-bold tracking-tight text-white">VibeWall</h1>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">From Kodeblock</span>
                </div>
            </div>
            <button 
                onClick={() => setShowHistory(true)}
                className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                aria-label="History"
            >
                <HistoryIcon className="w-6 h-6" />
            </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 pb-28 md:pb-32 flex flex-col items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {error && <div className="text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}
        {!isLoading && !error && images.length > 0 && (
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 text-xs font-medium text-indigo-300 hover:text-indigo-200 transition-colors bg-indigo-900/20 hover:bg-indigo-900/40 px-3 py-1.5 rounded-full"
              >
                <DownloadIcon className="w-4 h-4" />
                Download All
              </button>
            </div>
            <ImageGrid images={images} onImageClick={handleSelectImage} />
          </div>
        )}
        {!isLoading && !error && images.length === 0 && <WelcomeScreen />}
      </main>

      <PromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={() => handleGenerate(prompt)}
        isLoading={isLoading}
        remixImage={remixImage}
        onClearRemix={handleClearRemix}
      />

      {selectedImage && (
        <FullScreenView
          image={selectedImage}
          onClose={handleCloseModal}
          onDownload={() => handleDownload(selectedImage)}
          onRemix={handleRemix}
        />
      )}

      {showHistory && (
        <HistoryView 
            history={history}
            onSelect={handleHistorySelect}
            onClose={() => setShowHistory(false)}
            onClear={handleClearHistory}
        />
      )}
    </div>
  );
};

export default App;
