```typescript
import { GeneratedImage } from '../types';

// The "Elon Mode" Service
// Replaces Google Gemini with Pollinations.ai (Free, No Key)

export const generateWallpapers = async (prompt: string): Promise<GeneratedImage[]> => {
  console.log("Elon Mode: Generating wallpaper for:", prompt);

  // 1. Create the Pollinations URL
  // We add random seeds to ensure unique images every time
  const seed = Math.floor(Math.random() * 100000);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1920&seed=${seed}&nologo=true`;

  try {
    // 2. Fetch the image (Proxy download)
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch from Pollinations');
    
    // 3. Convert to Blob
    const blob = await response.blob();

    // 4. Convert Blob to Base64 (The format App.tsx expects)
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the "data:image/jpeg;base64," prefix if present
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // 5. Return in the exact object structure App.tsx wants
    return [{
      id: Date.now().toString(),
      base64: base64String,
      prompt: prompt,
      timestamp: Date.now()
    }];

  } catch (error) {
    console.error("Generation failed:", error);
    throw new Error("Could not generate vibe. Try again.");
  }
};
```
