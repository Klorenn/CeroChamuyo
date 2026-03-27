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
    const prompt = clientCommentPrompt.replace("{review}", reviewText);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            maxOutputTokens: 50,
            temperature: 0.1,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", errorData);
      return generateSimpleComment(reviewText);
    }

    const data = await response.json();
    const comment = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (comment && comment.length <= 30) {
      return comment;
    }
    
    return generateSimpleComment(reviewText);
  } catch (error) {
    console.error("Error calling Gemini:", error);
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
