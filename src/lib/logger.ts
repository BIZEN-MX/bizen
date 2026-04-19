import { prisma } from "@/lib/prisma";

export async function logError(
  message: string,
  context: string,
  level: "CRITICAL" | "ERROR" | "WARNING" | "INFO" = "ERROR",
  userId?: string | null
) {
  // 1. Log to standard console for immediate local debugging or Cloud Logging
  const logPrefix = `[${level}] [${context}]`;
  if (level === "CRITICAL" || level === "ERROR") {
    console.error(`${logPrefix} ${message}`);
  } else if (level === "WARNING") {
    console.warn(`${logPrefix} ${message}`);
  } else {
    console.log(`${logPrefix} ${message}`);
  }

  // Sanitize for DB and Webhook limits
  const safeMessage = typeof message === "string" ? message.substring(0, 1500) : "Mensaje no es un string";
  const safeContext = typeof context === "string" ? context.substring(0, 255) : "Contexto inválido";

  // 2. Persist to Postgres asynchronously (fire and forget)
  prisma.systemError
    .create({
      data: {
        message: safeMessage,
        context: safeContext,
        level: level,
        userId: userId || null,
      },
    })
    .catch((dbErr) => {
      console.error("[CRITICAL] Failed to write SystemError to DB:", dbErr);
    });

  // 3. Trigger Discord Webhook Alert asynchronously (fire and forget)
  const webhookUrl = process.env.DISCORD_ERROR_WEBHOOK_URL;
  if (!webhookUrl) return;

  const getEmbedColor = () => {
    switch (level) {
      case "CRITICAL": return 15548997; // Bright Red
      case "ERROR": return 16730698;    // Soft Red
      case "WARNING": return 16753920;  // Orange
      case "INFO": return 3447003;      // Blue
      default: return 10070709;
    }
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Bizen Sentinel",
        avatar_url: "https://i.imgur.com/4M34hiw.png", // Red shield or alert icon (safe generic imgur link)
        embeds: [
          {
            title: `🚨 ${level} - Bizen Platform`,
            description: `**Contexto:** \`${safeContext}\`\n**User ID:** \`${userId || "Anónimo / Sistema"}\`\n\`\`\`json\n${message}\n\`\`\``,
            color: getEmbedColor(),
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (webhookErr) {
    console.error("[WARNING] Falló el envío del Webhook a Discord", webhookErr);
  }
}
