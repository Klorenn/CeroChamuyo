import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const clientCommentPrompt = `Clasifica la opinion del cliente en 3 palabras maximo.

Opciones:
- Cliente feliz
- Cliente disgusto
- Cliente neutral
- Cliente curioso
- Cliente exigente

reseña: "{review}"

Responde SOLO con una de las opciones de arriba, sin explicacion:`;

export async function analyzeWithAI(reviewText: string): Promise<string> {
  if (!API_KEY) {
    return generateSimpleComment(reviewText);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = clientCommentPrompt.replace("{review}", reviewText);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const comment = response.text().trim();
    
    if (comment && comment.length <= 30) {
      return comment;
    }
    
    return generateSimpleComment(reviewText);
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    return generateSimpleComment(reviewText);
  }
}

function generateSimpleComment(reviewText: string): string {
  const lowerText = reviewText.toLowerCase();
  
  if (lowerText.includes("excelente") || lowerText.includes("increible") || lowerText.includes("espectacular") || lowerText.includes("impresionante") || lowerText.includes("fantastico") || lowerText.includes("extraordinario") || lowerText.includes("maravilloso") || lowerText.includes("perfecto")) {
    return "Cliente feliz";
  }
  if (lowerText.includes("malo") || lowerText.includes("terrible") || lowerText.includes("desilusionante") || lowerText.includes("pesimo") || lowerText.includes("horrible") || lowerText.includes("espantoso") || lowerText.includes("nunca mas")) {
    return "Cliente disgusto";
  }
  if (lowerText.includes("bueno") || lowerText.includes("buenisimo") || lowerText.includes("muy bueno") || lowerText.includes("recomendable") || lowerText.includes("rico") || lowerText.includes("delicioso") || lowerText.includes("disfrute")) {
    return "Cliente feliz";
  }
  if (lowerText.includes("regular") || lowerText.includes("normal") || lowerText.includes("aceptable") || lowerText.includes("pasable") || lowerText.includes("ni fu ni fa")) {
    return "Cliente neutral";
  }
  if (lowerText.includes("curioso") || lowerText.includes("interesante") || lowerText.includes("novedoso") || lowerText.includes("primera vez")) {
    return "Cliente curioso";
  }
  if (lowerText.includes("caro") || lowerText.includes("precio") || lowerText.includes("exigido") || lowerText.includes("calidad")) {
    return "Cliente exigente";
  }
  
  return "Cliente neutral";
}
