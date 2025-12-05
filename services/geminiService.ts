
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

export const remixWallpapers = async (prompt: string, referenceImageBase64: string): Promise<GeneratedImage[]> => {
  try {
    // Generate 2 variations for remix to provide options while maintaining speed
    const promises = [1, 2].map(async (i) => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: referenceImageBase64 } },
                    { text: `${prompt}. Create a variation of this wallpaper. 9:16 aspect ratio, phone wallpaper, high quality, stunning detail.` }
                ]
            },
            config: {
                // responseMimeType and responseSchema are not supported for nano banana
            }
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart || !imagePart.inlineData) {
             // Fallback if no image part found in one attempt
             return null;
        }

        return {
            id: `remix-${Date.now()}-${i}`,
            base64: imagePart.inlineData.data
        } as GeneratedImage;
    });

    const results = await Promise.all(promises);
    const validImages = results.filter((img): img is GeneratedImage => img !== null);

    if (validImages.length === 0) {
        throw new Error("Failed to remix image. The model might have refused the request.");
    }

    return validImages;

  } catch (error) {
    console.error("Error remixing wallpaper:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to remix image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during remixing.");
  }
};
