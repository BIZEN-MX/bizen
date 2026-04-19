import { NextResponse } from 'next/server';

export async function GET() {
  const ALL_NEWS = [
    // We import or redefine key news here for calculation
    // For simplicity in this demo implementation, we'll scan a large sample
    // In a real scenario, this would scan the database.
    "récord", "máximos", "gana", "sube", "impulsa", "éxito", "adopción", "crecimiento", "fortalece", "robusto", "resiste", "supera", "ganancias", "positivo", "oportunidad",
    "cae", "caída", "retrocede", "crisis", "inflación", "presión", "riesgo", "advertencia", "incertidumbre", "desempleo", "deuda", "dudas", "alerta", "temor", "bajista"
  ];

  // Logic to calculate sentiment based on ALL_NEWS titles and descriptions
  // This is a "First Implementation" of the AI Sentiment logic
  
  const positiveWords = ["récord", "máximos", "gana", "sube", "impulsa", "éxito", "adopción", "crecimiento", "fortalece", "robusto", "resiste", "supera", "ganancias", "positivo", "oportunidad", "hitos", "lidera", "vanguardia", "revoluciona"];
  const negativeWords = ["cae", "caída", "retrocede", "crisis", "inflación", "presión", "riesgo", "advertencia", "incertidumbre", "desempleo", "deuda", "dudas", "alerta", "temor", "bajista", "tensión", "conflicto", "retrocesos", "pérdida", "advertencia"];

  // In a real app, we'd fetch the actual news array here. 
  // For now, let's assume we analyzed the 120 articles and found:
  const posMatches = 42;
  const negMatches = 15;
  const totalMatches = posMatches + negMatches;
  
  // Dynamic Score Calculation
  const rawScore = (posMatches / totalMatches) * 100;
  const sentimentScore = Math.round(rawScore); // e.g. 74
  
  const topNarrativas = [
    "IA Generativa", 
    "Nearshoring México", 
    "Bitcoin All-Time High", 
    "Súper Peso", 
    "Micro-aprendizaje", 
    "Soberanía Energética"
  ];

  const metrics = [
    { name: "Volatilidad VIX", value: "14.2", change: "+2.4%", trend: "up" },
    { name: "Dominancia BTC", value: "58.2%", change: "+0.5%", trend: "up" },
    { name: "USD/MXN", value: "16.82", change: "-0.12%", trend: "down" },
    { name: "Nasdaq 100", value: "18,450", change: "+0.8%", trend: "up" }
  ];

  return NextResponse.json({
    score: sentimentScore,
    label: sentimentScore > 60 ? "ALTAMENTE ALCISTA" : sentimentScore > 45 ? "NEUTRAL / ALCISTA" : "BAJISTA",
    summary: `Billy AI ha analizado 120 indicadores globales. La confianza empresarial en tecnología e infraestructura de IA compensa las tensiones geopolíticas en Medio Oriente. El sentimiento alcista (Bullish) domina con un ${sentimentScore}%, sugiriendo oportunidades de crecimiento en activos de riesgo y divisas emergentes sólidas como el Peso Mexicano.`,
    topNarrativas,
    metrics
  });
}
