import OpenAI from "openai";

const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1";
const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

if (!apiKey) {
  console.error("ERROR: OPENAI_API_KEY no está configurado.");
  process.exit(1);
}

export const openai = new OpenAI({ apiKey, baseURL });

export async function chat(
  systemPrompt: string,
  userMessage: string,
  model = "gpt-4o-mini"
): Promise<string> {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 1500,
  });
  return response.choices[0]?.message?.content?.trim() ?? "No se obtuvo respuesta.";
}
