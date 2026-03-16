import { Message } from "discord.js";
import { chat } from "../openai.js";
import { sendLong } from "./chat.js";

export async function handleStudy(message: Message, command: string, args: string) {
  if (!args) {
    await message.reply(`Uso: \`!${command} <argumento>\``);
    return;
  }

  await message.channel.sendTyping();

  if (command === "ia-quiz") {
    const [tema, nivel] = args.split("|").map(s => s.trim());
    if (!tema) {
      await message.reply("Uso: `!ia-quiz <tema> | <nivel>`\nEjemplo: `!ia-quiz historia | intermedio`");
      return;
    }
    const nivelFinal = nivel || "básico";
    const response = await chat(
      "Eres un profesor experto que crea preguntas de examen tipo test. Las preguntas deben ser claras, educativas y variadas en dificultad. Escribe en español.",
      `Crea 5 preguntas tipo test de nivel ${nivelFinal} sobre: "${tema}". Para cada pregunta incluye:
- La pregunta numerada
- 4 opciones (A, B, C, D)
- La respuesta correcta al final con una breve explicación

Formato claro y ordenado.`
    );
    await sendLong(message, `**Quiz: ${tema}** *(nivel: ${nivelFinal})*\n\n${response}`);

  } else if (command === "ia-flashcards") {
    const parts = args.split("|").map(s => s.trim());
    const tema = parts[0];
    const n = parseInt(parts[1] || "5");
    if (!tema) {
      await message.reply("Uso: `!ia-flashcards <tema> | <cantidad>`\nEjemplo: `!ia-flashcards biología | 10`");
      return;
    }
    const cantidad = isNaN(n) ? 5 : Math.min(n, 15);
    const response = await chat(
      "Eres un experto en técnicas de estudio. Creas flashcards (tarjetas de memoria) efectivas y concisas en español. Formato: Concepto → Definición/Explicación.",
      `Crea ${cantidad} flashcards de estudio sobre: "${tema}". Formato para cada tarjeta:
**[Número]** 🃏
**Pregunta/Concepto:** ...
**Respuesta:** ...
---`
    );
    await sendLong(message, `**Flashcards: ${tema}** *(${cantidad} tarjetas)*\n\n${response}`);

  } else if (command === "ia-plan") {
    const [objetivo, tiempo] = args.split("|").map(s => s.trim());
    if (!objetivo) {
      await message.reply("Uso: `!ia-plan <objetivo> | <tiempo>`\nEjemplo: `!ia-plan aprender python | 30 días`");
      return;
    }
    const tiempoFinal = tiempo || "30 días";
    const response = await chat(
      "Eres un coach experto en productividad, aprendizaje y planificación. Creas planes de estudio/acción estructurados, realistas y motivadores en español.",
      `Crea un plan de estudio/acción detallado para: "${objetivo}" en: "${tiempoFinal}".

Incluye:
- Objetivos semanales o por etapas
- Recursos recomendados (libros, webs, videos)
- Hábitos diarios sugeridos
- Hitos de progreso para medir avance
- Consejos de motivación

Sé específico y práctico.`
    );
    await sendLong(message, `**Plan: ${objetivo}** *(${tiempoFinal})*\n\n${response}`);
  }
}
