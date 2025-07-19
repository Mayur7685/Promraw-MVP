import type { AIPromptResponse, AIScoreResponse } from "@/types"

// AI Service Integration Placeholders
// Replace these with actual API implementations when keys are available

// Placeholder AI functions (to be replaced with real API calls)
export const generateAIPrompt = async (): Promise<string> => {
  const prompts = [
    "Alien riding a giraffe in a neon city",
    "Robot chef cooking rainbow pasta in space",
    "Dragon playing chess with a wizard under moonlight",
    "Underwater disco with dancing jellyfish",
    "Time-traveling cat exploring ancient pyramids",
    "Floating island with crystal trees and waterfalls",
    "Cyberpunk butterfly garden in the rain",
    "Space pirate's treasure map on Mars",
    "Magical library with flying books",
    "Steampunk elephant with mechanical wings",
  ]

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return prompts[Math.floor(Math.random() * prompts.length)]
}

export const scoreDrawingWithAI = async (imageData: string, prompt: string): Promise<AIScoreResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate realistic-looking scores
  const creativity = Math.floor(Math.random() * 4) + 6 // 6-10
  const promptAdherence = Math.floor(Math.random() * 4) + 5 // 5-9
  const artisticQuality = Math.floor(Math.random() * 4) + 4 // 4-8
  const overall = Math.round(((creativity + promptAdherence + artisticQuality) * 10) / 3)

  return {
    creativity,
    promptAdherence,
    artisticQuality,
    overall,
    feedback: "Great creative interpretation!",
  }
}

// OpenAI Integration Placeholder
export const generatePromptWithOpenAI = async (): Promise<AIPromptResponse> => {
  // TODO: Replace with actual OpenAI API call
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [
  //     {
  //       role: "system",
  //       content: "Generate a creative, fun drawing prompt for an art app. Keep it concise and imaginative."
  //     }
  //   ],
  //   max_tokens: 50
  // })

  const mockPrompts = [
    "Alien riding a giraffe in a neon city",
    "Robot chef cooking rainbow pasta in space",
    "Dragon playing chess with a wizard under moonlight",
  ]

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    prompt: mockPrompts[Math.floor(Math.random() * mockPrompts.length)],
    id: `prompt_${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
}

export const scoreDrawingWithOpenAI = async (imageData: string, prompt: string): Promise<AIScoreResponse> => {
  // TODO: Replace with actual OpenAI Vision API call
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4-vision-preview",
  //   messages: [
  //     {
  //       role: "user",
  //       content: [
  //         {
  //           type: "text",
  //           text: `Score this drawing based on the prompt: "${prompt}". Rate creativity (1-10), prompt adherence (1-10), and artistic quality (1-10).`
  //         },
  //         {
  //           type: "image_url",
  //           image_url: { url: imageData }
  //         }
  //       ]
  //     }
  //   ]
  // })

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const creativity = Math.floor(Math.random() * 4) + 6
  const promptAdherence = Math.floor(Math.random() * 4) + 5
  const artisticQuality = Math.floor(Math.random() * 4) + 4

  return {
    creativity,
    promptAdherence,
    artisticQuality,
    overall: Math.round(((creativity + promptAdherence + artisticQuality) * 10) / 3),
    feedback: "Great creative interpretation!",
  }
}

// Gemini Integration Placeholder
export const generatePromptWithGemini = async (): Promise<AIPromptResponse> => {
  // TODO: Replace with actual Gemini API call
  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" })
  // const result = await model.generateContent("Generate a creative drawing prompt...")

  const mockPrompts = [
    "Steampunk elephant with mechanical wings",
    "Magical library with flying books",
    "Cyberpunk butterfly garden in the rain",
    "Space pirate's treasure map on Mars",
    "Crystal cave with glowing mushrooms",
  ]

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    prompt: mockPrompts[Math.floor(Math.random() * mockPrompts.length)],
    id: `gemini_prompt_${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
}

export const scoreDrawingWithGemini = async (imageData: string, prompt: string): Promise<AIScoreResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // fallback to mock if no key
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const creativity = Math.floor(Math.random() * 4) + 6;
    const promptAdherence = Math.floor(Math.random() * 4) + 5;
    const artisticQuality = Math.floor(Math.random() * 4) + 4;
    return {
      creativity,
      promptAdherence,
      artisticQuality,
      overall: Math.round(((creativity + promptAdherence + artisticQuality) * 10) / 3),
      feedback: "Impressive artistic vision! (fallback, no Gemini key)",
    };
  }
  try {
    // Prepare image data (strip data URL prefix if present)
    const base64Image = imageData.replace(/^data:image\/(png|jpeg);base64,/, "");
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Evaluate this drawing based on the prompt: "${prompt}". 
Score it in these three categories:\n1. Creativity (1-10): How original and imaginative is the drawing?\n2. Prompt Adherence (1-10): How well does it match the given prompt?\n3. Artistic Quality (1-10): How well-executed is the drawing technically?\nAlso provide metadata for this artwork:\n- A creative, cheeky name for the artwork based on the prompt and what you see (max 20 characters)\n- A description that includes all the scores with a short, playful roast about the artwork (max 150 characters)\nProvide the scores and metadata in JSON format like this:\n{\n  "creativity": 8.5,\n  "promptAdherence": 7.9,\n  "artisticQuality": 8.2,\n  "overall": 8.2,\n  "feedback": "Brief 1-2 sentence feedback",\n  "name": "Cheeky Artwork Name",\n  "description": "Creativity: 8.5, Adherence: 7.9, Quality: 8.2 - Your art looks like a toddler's fever dream, but hey, at least it's colorful!"\n}\nIMPORTANT: Return ONLY the JSON object. Do not include any markdown formatting, code blocks, or explanatory text.`
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 0.8,
            maxOutputTokens: 2048,
          }
        })
      });
    if (!geminiResponse.ok) throw new Error(`Gemini API error: ${geminiResponse.status}`);
    const data = await geminiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');
    const scores = JSON.parse(jsonMatch[0]);
    return {
      creativity: scores.creativity,
      promptAdherence: scores.promptAdherence,
      artisticQuality: scores.artisticQuality,
      overall: scores.overall || Math.round(((scores.creativity + scores.promptAdherence + scores.artisticQuality) * 10) / 3),
      feedback: scores.feedback || scores.description || 'AI scoring complete.'
    };
  } catch (err: any) {
    // fallback to mock on error
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const creativity = Math.floor(Math.random() * 4) + 6;
    const promptAdherence = Math.floor(Math.random() * 4) + 5;
    const artisticQuality = Math.floor(Math.random() * 4) + 4;
    return {
      creativity,
      promptAdherence,
      artisticQuality,
      overall: Math.round(((creativity + promptAdherence + artisticQuality) * 10) / 3),
      feedback: `Impressive artistic vision! (Gemini error: ${err?.message || err})`,
    };
  }
}
