
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageGridProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      {images.map((image) => (
        <div
          key={image.id}
          className="aspect-[9/16] bg-slate-800 rounded-lg overflow-hidden cursor-pointer group relative"
          onClick={() => onImageClick(image)}
        >
          <img
            src={`data:image/jpeg;base64,${image.base64}`}
            alt="Generated wallpaper"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
