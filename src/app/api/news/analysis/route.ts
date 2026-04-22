import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Cache variables to prevent redundant AI calls
let lastAnalysis: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET() {
  try {
    const now = Date.now();
    if (lastAnalysis && (now - lastFetchTime < CACHE_DURATION)) {
      console.log("[NewsAnalysis] Returning cached analysis");
      return NextResponse.json(lastAnalysis);
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    // 1. Fetch news from our own API (internal call style)
    // We'll use a relative URL if possible, or just the same logic
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
    
    // In many environments, fetching from self via HTTP can be tricky. 
    // Since we are in the same codebase, we could import the news, but they are hardcoded in the route.
    // Let's try to fetch them.
    const newsRes = await fetch(`${protocol}://${host}/api/news`, { cache: 'no-store' });
    const newsData = await newsRes.json();
    
    if (!newsData || !Array.isArray(newsData)) {
      throw new Error("Failed to fetch news data");
    }

    // 2. Prepare context for Gemini
    const newsContext = newsData.slice(0, 25).map((n: any) => `- ${n.title}: ${n.desc}`).join('\n');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Eres Billy, la inteligencia artificial experta en mercados de BIZEN.
      Tu tarea es analizar los siguientes titulares de noticias financieras recientes y generar un reporte de sentimiento.
      
      NOTICIAS:
      ${newsContext}

      RESPONDE ÚNICAMENTE EN FORMATO JSON con la siguiente estructura:
      {
        "score": (número del 0 al 100 donde 0 es bajista total y 100 es alcista total),
        "label": (string corto: "BAJISTA", "NEUTRAL", "ALCISTA", "MUY ALCISTA"),
        "summary": (un párrafo de 3 líneas analizando la situación actual de forma profesional pero accesible),
        "topNarrativas": [lista de 4-5 temas que dominan la conversación],
        "topAnalyses": [
          {
            "id": "string",
            "topic": "Tema de análisis",
            "impact": "High/Medium/Low",
            "sentiment": "Bullish/Bearish/Neutral",
            "description": "Explicación breve",
            "correlation": "Cómo afecta a BIZEN"
          }
        ],
        "metrics": [
          {"name": "Métrica 1", "value": "Valor", "change": "+X%", "trend": "up/down"},
          {"name": "Métrica 2", "value": "Valor", "change": "+X%", "trend": "up/down"}
        ]
      }
      
      REGLAS:
      - Sé realista. Si hay guerra o inflación, el sentimiento debe bajar.
      - Si hay récords en tech o crypto, el sentimiento debe subir.
      - Las métricas deben ser coherentes con el texto (puedes inventar valores realistas de mercado como VIX, BTC, MXN o S&P500 basados en las noticias).
      - NO USES EMOJIS.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON if Gemini adds markdown blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(jsonStr);

    // Save to cache
    lastAnalysis = analysis;
    lastFetchTime = now;

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("❌ [NewsAnalysis:Error]:", error.message);
    
    // Safety Fallback (Old logic)
    return NextResponse.json({
      score: 65,
      label: "NEUTRAL / ALCISTA",
      summary: "Billy AI detectó una conexión limitada, pero basándose en indicadores históricos, el mercado muestra resiliencia en tecnología mientras monitorea la inflación global.",
      topNarrativas: ["IA Generativa", "Nearshoring", "Crypto Adoption", "Súper Peso"],
      metrics: [
        { name: "Volatilidad VIX", value: "14.2", change: "+2.4%", trend: "up" },
        { name: "Nasdaq 100", value: "18,450", change: "+0.8%", trend: "up" }
      ]
    });
  }
}
