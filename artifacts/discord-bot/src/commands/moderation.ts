import { Message } from "discord.js";
import { chat } from "../openai.js";
import { sendLong } from "./chat.js";

export async function handleModeration(message: Message, command: string, args: string) {
  if (!args) {
    await message.reply(`Uso: \`!${command} <texto>\``);
    return;
  }

  await message.channel.sendTyping();

  if (command === "ia-revisar") {
    const response = await chat(
      `Eres un moderador experto de servidores de Discord. Evalúa el siguiente mensaje y determina si viola reglas típicas de comunidad (toxicidad, spam, acoso, lenguaje ofensivo, contenido inapropiado, etc.).
      
Responde en este formato:
**Veredicto:** ✅ Seguro / ⚠️ Sospechoso / ❌ Violación
**Nivel de riesgo:** Bajo / Medio / Alto
**Razones:** (lista las razones si aplica)
**Acción recomendada:** (qué debería hacer el moderador)`,
      `Mensaje a revisar: "${args}"`
    );
    await sendLong(message, `**Análisis de moderación:**\n${response}`);

  } else if (command === "ia-reescribe-safe") {
    const response = await chat(
      "Eres un especialista en comunicación. Reescribe el siguiente mensaje para que sea respetuoso, constructivo y apropiado para una comunidad, manteniendo la intención original pero eliminando cualquier lenguaje ofensivo, agresivo o inapropiado. Responde solo con la versión reescrita.",
      `Reescribe este mensaje de forma respetuosa: "${args}"`
    );
    await sendLong(message, `**Versión segura:**\n${response}`);

  } else if (command === "ia-sugerir-regla") {
    const response = await chat(
      `Eres un experto en gestión de comunidades de Discord. Dado un caso o situación problemática, sugiere:
1. Una regla clara y específica para prevenirlo
2. La sanción recomendada (advertencia, mute temporal, kick, ban, etc.)
3. Cómo comunicar esta regla a la comunidad
Responde en español de forma clara y profesional.`,
      `Caso o situación: ${args}`
    );
    await sendLong(message, `**Sugerencia de moderación para: ${args}**\n\n${response}`);
  }
}
