
import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWallpapers = async (prompt: string): Promise<GeneratedImage[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, 9:16 aspect ratio, phone wallpaper, high quality, stunning detail`,
      config: {
        numberOfImages: 4,
        outputMimeType: 'image/jpeg',
        aspectRatio: '9:16',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("No images were generated. The prompt may have been blocked.");
    }
    
    return response.generatedImages.map((img, index) => ({
        id: `img-${Date.now()}-${index}`,
        base64: img.image.imageBytes,
    }));
  } catch (error) {
    console.error("Error generating wallpapers:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate images: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
