export const generateImage = async (prompt: string): Promise<string> => {
  console.log("Generating image for prompt:", prompt);
  
  // Encode the prompt to make it URL-safe
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Construct the URL. We add a random seed to make sure it's different every time.
  const randomSeed = Math.floor(Math.random() * 10000);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${randomSeed}&width=1080&height=1920&nologo=true`;

  // Return the URL directly. The browser will load it.
  return imageUrl;
};
