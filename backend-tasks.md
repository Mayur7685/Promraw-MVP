## Overview

Promraw is a decentralized and AI-powered creative platform where users submit daily sketches based on AI-generated prompts. The platform scores submissions using AI and offers users the ability to mint their best artworks as coin using Zora’s protocol. more features like gallery & leaderbord 

**simple backend implementation guide + TODO list** for your project to help a backend dev build the functionality efficiently.

----------

## Tools & resources
- cursor (AI code editor)
- zora sdk [docs](https://docs.zora.co/)
- Pinata (IPFS storage)
- Gemini API

## Initial Frontend ready
<p align="center">
  <img src="https://github.com/user-attachments/assets/a9f5daf5-ee92-42b5-b8bb-976f089e7fd4" width="928" alt="prom1" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/b410545f-2131-4391-af22-7c7253a91b55" width="599" alt="prom2" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/4f84a956-3389-41f2-a412-ce7323c73880" width="809" alt="prom3" />
</p>




## 🧠 Concept Recap for Backend Dev

This app is an **AI-Human-Web3 sandwich**:

1.  Users connect wallet and see a **daily AI prompt** (generated via Gemini API).
    
2.  Users **draw on canvas** and submit the drawing.
    
3.  Drawing is **scored using Gemini** (criteria: creativity, prompt match, artistic quality).
    
4.  If satisfied, users can **“Coin it” using Zora SDK**, minting their art with metadata to Zora.
    
5.  Artwork is stored on **IPFS via Pinata**.
    

----------

## 🛠️ Backend Responsibilities

### ✅ Core Tasks

1.  **Generate Daily Prompt via Gemini API**
    
2.  **Score User Submission (Image) via Gemini API**
    
3.  **Store Metadata & Images on IPFS (Pinata)**
    
4.  **Integrate Coin Creation with Zora SDK**
    
5.  **API Routes for Frontend Integration**
    

----------

## 📋 Backend TODO List

### 1. Prompt Generator

-   **Task:** Generate a new AI prompt daily using Gemini.
    
-   **Tool:** Gemini API
        
        

### 2. Image Scoring

-   **Task:** Use Gemini Vision API to score images based on:
    
    -   Adherence to prompt
        
    -   Creativity
        
    -   Artistic quality
        
-   **Action:**
    
    -   Receive user image (base64 or blob)
        
    -   Send prompt + image to Gemini for scoring
        
    -   Return score object to frontend (`/api/score`)
        

### 3. IPFS Upload (Pinata)

-   **Task:** Upload drawing image to IPFS.
    
-   **Tool:** Pinata SDK or REST API
    
-   **Action:**
    
    -   After scoring, upload image + metadata to Pinata
        
    -   Get and return IPFS hash (`/api/ipfs/upload`)
        

### 4. Zora Coin Integration

-   **Task:** Coin creation using Zora SDK 
    
-   **Note:** This happens client-side but backend can:
    
    -   Prebuild metadata
        
    -   Verify uploads
        
    -   Help with IPFS URLs and content hash if needed
        

### 5. Auth / Wallet Session (Optional)

-   **Task:** If needed, ensure only connected wallets can submit or mint
    
-   **Option:** SIWE (Sign-In With Ethereum) or wallet address check via headers
    

## 🔑 Environment Variables

```env
GEMINI_API_KEY=
PINATA_API_KEY=
PINATA_SECRET_KEY=

```


## Inspiration code for AI features 

``` javascript
// Types for our AI service
export interface ZennyPrompt {
  id: string;
  prompt: string;
  category?: string;
  timestamp: Date;
}

export interface GeneratePromptsOptions {
  count?: number;
  category?: 'surreal' | 'nature' | 'urban' | 'fantasy' | 'abstract' | 'random';
  style?: 'minimal' | 'detailed' | 'poetic';
}

// Predefined zenny prompt examples for fallback
const FALLBACK_PROMPTS = [
  "raccoon on tractor",
  "city on octopus", 
  "capitalistic honey bee",
  "melancholy lighthouse",
  "dancing mountains",
  "philosophical coffee cup",
  "rebellious cloud",
  "sleepy volcano",
  "anxious butterfly",
  "wise garbage can",
  "meditative toaster",
  "existential banana",
  "cosmic paperclip",
  "zen parking meter",
  "dreaming calculator"
];

// Generate creative zenny prompts using Gemini API
export async function generateZennyPrompts(options: GeneratePromptsOptions = {}) {
  const { count = 5, category = 'random', style = 'minimal' } = options;
  
  try {
    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable is not set, using fallback prompts");
      return {
        prompts: generateFallbackPrompts(count, category),
        error: "Gemini API key not configured. Using default prompts instead.",
      };
    }

    console.log("Using Gemini API key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5));

    // Build system prompt based on options
    const systemPrompt = buildSystemPrompt(category, style, count);

    // Make direct API call to Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = data.candidates[0].content.parts[0].text;

    // Parse the generated prompts
    const prompts = parseGeneratedPrompts(text, count, category);

    return { prompts };
  } catch (error) {
    console.error("Error generating zenny prompts:", error);
    return {
      prompts: generateFallbackPrompts(count, category),
      error: "Failed to generate new prompts. Using default prompts instead.",
    };
  }
}

// Generate a single random zenny prompt
export async function generateRandomZennyPrompt() {
  try {
    const result = await generateZennyPrompts({ count: 1 });
    return {
      prompt: result.prompts[0],
      error: result.error,
    };
  } catch (error) {
    console.error("Error generating random prompt:", error);
    return {
      prompt: getRandomFallbackPrompt(),
      error: "Failed to generate a new prompt. Using a default prompt instead.",
    };
  }
}

// Evaluate drawing using Gemini API
export async function evaluateDrawing(imageBase64: string, prompt: string) {
  try {
    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log("GEMINI_API_KEY environment variable is not set, using fallback scores");
      return generateFallbackScores(prompt);
    }

    // Convert base64 to the format Gemini expects
    const imageData = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Make direct API call to Gemini Vision
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Evaluate this drawing based on the prompt: "${prompt}". 

Score it in these three categories:
1. Creativity (1-10): How original and imaginative is the drawing?
2. Prompt Adherence (1-10): How well does it match the given prompt?
3. Artistic Quality (1-10): How well-executed is the drawing technically?

Also provide metadata for this artwork:
- A creative, cheeky name for the artwork based on the prompt and what you see (max 20 characters)
- A description that includes all the scores with a short, playful roast about the artwork (max 150 characters)

Provide the scores and metadata in JSON format like this:
{
  "creativity": 8.5,
  "promptAdherence": 7.9,
  "artisticQuality": 8.2,
  "overall": 8.2,
  "feedback": "Brief 1-2 sentence feedback",
  "name": "Cheeky Artwork Name",
  "description": "Creativity: 8.5, Adherence: 7.9, Quality: 8.2 - Your art looks like a toddler's fever dream, but hey, at least it's colorful!"
}

Make the description include all three scores and be playfully sarcastic or cheeky about the artwork while still being encouraging.

IMPORTANT: Return ONLY the JSON object. Do not include any markdown formatting, code blocks, or explanatory text.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData
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

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = data.candidates[0].content.parts[0].text;

    // Extract JSON from the response if it's wrapped in a code block
    const jsonContent = extractJsonFromText(text);

    // Parse the JSON response
    try {
      const scores = JSON.parse(jsonContent);

      // Calculate overall score if not provided
      if (!scores.overall && scores.creativity && scores.promptAdherence && scores.artisticQuality) {
        scores.overall = Number(((scores.creativity + scores.promptAdherence + scores.artisticQuality) / 3).toFixed(1));
      }

      return {
        scores,
        success: true,
      };
    } catch (parseError) {
      console.log("Error parsing JSON:", parseError, "Raw content:", jsonContent);
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (error) {
    console.log("Error evaluating drawing:", error);
    return generateFallbackScores(prompt);
  }
}

// Build system prompt based on category and style
function buildSystemPrompt(category: string, style: string, count: number): string {
  const categoryPrompts = {
    surreal: "Generate surreal, dreamlike combinations of unexpected elements that spark imagination.",
    nature: "Generate prompts combining natural elements in unexpected, zen-like ways.", 
    urban: "Generate prompts mixing urban/city elements with unexpected objects in a peaceful manner.",
    fantasy: "Generate prompts with magical or fantastical elements that feel calm and contemplative.",
    abstract: "Generate abstract conceptual combinations that evoke a sense of wonder.",
    random: "Generate completely random, creative combinations that feel zen-like and peaceful."
  };

  const stylePrompts = {
    minimal: "Keep prompts very short and minimal, usually 2-4 words each.",
    detailed: "Make prompts more descriptive with thoughtful adjectives.",
    poetic: "Make prompts more poetic, evocative, and emotionally resonant."
  };

  return `You are a creative AI that generates "zenny" prompts - short, zen-like, surreal combinations of words that spark imagination and creativity. These prompts are used for art generation and should be visually inspiring.

${categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.random}
${stylePrompts[style as keyof typeof stylePrompts]}

Examples of perfect zenny prompts:
- "raccoon on tractor"
- "city on octopus"
- "capitalistic honey bee"
- "melancholy lighthouse"
- "dancing mountains"
- "philosophical coffee cup"
- "rebellious cloud"
- "sleepy volcano"

Each prompt should be:
- Concise and memorable
- Visually evocative
- Slightly unexpected or surreal
- Peaceful or contemplative in tone
- Easy to visualize as art

Generate exactly ${count} unique zenny prompts. Each prompt should be on a new line. Be creative, unexpected, and slightly absurd while maintaining a zen-like quality.

Format: Just list the prompts, one per line, no numbers, bullets, or explanations.`;
}

// Parse generated prompts from AI response
function parseGeneratedPrompts(text: string, count: number, category: string): ZennyPrompt[] {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.match(/^\d+[\.)]/)) // Remove numbered items
    .filter(line => !line.includes('•') && !line.includes('-')) // Remove bullet points
    .filter(line => line.length < 100) // Filter out overly long responses
    .slice(0, count); // Limit to requested count

  return lines.map((prompt, index) => ({
    id: `zenny_${Date.now()}_${index}`,
    prompt: prompt.replace(/^["']|["']$/g, ''), // Remove quotes if present
    category,
    timestamp: new Date()
  }));
}

// Generate fallback prompts when API fails
function generateFallbackPrompts(count: number, category: string): ZennyPrompt[] {
  const shuffled = [...FALLBACK_PROMPTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((prompt, index) => ({
    id: `fallback_${Date.now()}_${index}`,
    prompt,
    category,
    timestamp: new Date()
  }));
}

// Get a single random fallback prompt
function getRandomFallbackPrompt(): ZennyPrompt {
  const randomPrompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
  return {
    id: `fallback_${Date.now()}`,
    prompt: randomPrompt,
    category: 'random',
    timestamp: new Date()
  };
}

// Helper function to extract JSON from text that might be wrapped in markdown code blocks
function extractJsonFromText(text: string): string {
  // Check if the text contains a JSON code block
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }

  // If no code block is found, try to find JSON object directly
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0].trim();
  }

  // If all else fails, return the original text
  return text.trim();
}

// Helper function to generate fallback scores when API key is missing or there's an error
function generateFallbackScores(prompt: string) {
  const creativity = Number.parseFloat((Math.random() * 3 + 7).toFixed(1));
  const promptAdherence = Number.parseFloat((Math.random() * 3 + 7).toFixed(1));
  const artisticQuality = Number.parseFloat((Math.random() * 3 + 7).toFixed(1));
  const overall = Number.parseFloat(((creativity + promptAdherence + artisticQuality) / 3).toFixed(1));

  // Generate a cheeky fallback name based on the prompt
  const promptWords = prompt.split(' ');
  const cheekNames = ["Wonky", "Sketchy", "Abstract", "Wild", "Curious", "Funky"];
  const randomCheeky = cheekNames[Math.floor(Math.random() * cheekNames.length)];
  const name = `${randomCheeky} ${promptWords[0] || 'Art'}`.substring(0, 20);

  // Generate cheeky roast descriptions
  const roasts = [
    "but honestly, I've seen better doodles on napkins!",
    "though it looks like you drew with your eyes closed!",
    "but did you use your non-dominant hand or something?",
    "still not sure what I'm looking at though!",
    "giving me strong 'first day of art class' vibes!",
    "looks like abstract art had a fight with reality!"
  ];
  const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

  return {
    scores: {
      creativity,
      promptAdherence,
      artisticQuality,
      overall,
      feedback: "Your artwork shows creativity and imagination! Keep exploring different techniques.",
      name,
      description: `Creativity: ${creativity}, Adherence: ${promptAdherence}, Quality: ${artisticQuality} - ${randomRoast}`
    },
    success: true,
    error: "Gemini API key not configured. Using fallback scores.",
  };
}

// Utility functions for easy use in components
export const getZennyPrompts = (options?: GeneratePromptsOptions) => 
  generateZennyPrompts(options);

export const getRandomZennyPrompt = () => 
  generateRandomZennyPrompt();

// React hook for easy integration (if using React)
export const useZennyPrompts = () => {
  const [prompts, setPrompts] = useState<ZennyPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePrompts = async (options?: GeneratePromptsOptions) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateZennyPrompts(options);
      setPrompts(result.prompts);
      if (result.error) {
        setError(result.error);
      }
      return result.prompts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate prompts';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getRandomPrompt = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateRandomZennyPrompt();
      if (result.error) {
        setError(result.error);
      }
      return result.prompt;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate prompt';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    prompts,
    loading,
    error,
    generatePrompts,
    getRandomPrompt
  };
};

// For environments that need to import useState
declare const useState: any;

```
