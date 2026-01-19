import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Position, PlayerAttributes } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client once if possible, or inside functions if env vars change (rare in client side)
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateAttributes = async (
  position: Position,
  rating: number
): Promise<PlayerAttributes> => {
  if (!apiKey) throw new Error("API Key is missing");

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      PAC: { type: Type.INTEGER },
      SHO: { type: Type.INTEGER },
      PAS: { type: Type.INTEGER },
      DRI: { type: Type.INTEGER },
      DEF: { type: Type.INTEGER },
      PHY: { type: Type.INTEGER },
    },
    required: ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate realistic FIFA Ultimate Team style attributes (0-99) for a player with Position: ${position} and Overall Rating: ${rating}. Ensure the stats reflect the typical strengths of this position (e.g., CB has high DEF/PHY, ST has high SHO/PAC).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as PlayerAttributes;
  } catch (error) {
    console.error("Error generating attributes:", error);
    // Fallback if API fails
    return { PAC: 80, SHO: 80, PAS: 80, DRI: 80, DEF: 80, PHY: 80 };
  }
};

export const fetchClubLogoUrl = async (clubName: string): Promise<string | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find a direct URL to a high-quality, transparent PNG logo for the football club "${clubName}".
        
        Return ONLY the URL string. Do not include markdown formatting or extra text.
        If you find a Wikipedia URL for the file, prefer the 'upload.wikimedia.org' source link.`,
        config: {
            tools: [{googleSearch: {}}],
        }
    });

    // Clean up response to get just the URL
    let url = response.text?.trim();
    if (url) {
        // Remove markdown link syntax if present
        const match = url.match(/\((https?:\/\/[^)]+)\)/);
        if (match) url = match[1];
        // Remove simple quotes
        url = url.replace(/['"]/g, '');
        return url;
    }
    return null;
  } catch (e) {
    console.error("Error fetching club logo:", e);
    return null;
  }
};

export const generatePlayerImage = async (
  base64FaceImage: string,
  kitName: string,
  number: number,
  clubName: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  // Strip prefix if present
  const cleanBase64 = base64FaceImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: `Generate a hyper-realistic, cinematic digital art portrait of a professional soccer player seen from behind/side-profile, looking back over their shoulder at the camera.
            
            KEY REQUIREMENTS:
            1. FACE: You MUST use the face from the provided image. Blend it realistically.
            2. CLUB KIT: The player MUST be wearing the official home jersey of "${clubName}". The jersey colors and design must match ${clubName}'s real-world kit.
            3. DETAILS: On the back of the jersey, the name "${kitName}" and number "${number}" should be visible.
            4. BACKGROUND: The background MUST be a solid dark color (Hex Code #1a160e) to blend seamlessly with a dark card template. Do not generate a bright stadium. Use soft, golden rim lighting on the player to separate them from the dark background.
            5. STYLE: High-end sports card art. 8k resolution.`,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
        ],
      },
    });

    // Check for image in response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};