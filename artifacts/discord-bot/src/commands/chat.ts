import { Message } from "discord.js";
import { chat } from "../openai.js";

export async function handleChat(message: Message, command: string, args: string) {
  if (!args) {
    await message.reply("Debes proporcionar un mensaje. Ejemplo: `!ia Explícame qué es una API`");
    return;
  }

  await message.channel.sendTyping();

  if (command === "ia") {
    const response = await chat(
      "Eres un asistente general útil, claro y amigable. Responde en español de forma concisa.",
      args
    );
    await sendLong(message, response);

  } else if (command === "ia-rol") {
    const [rol, ...rest] = args.split("|");
    const userMsg = rest.join("|").trim();
    if (!rol || !userMsg) {
      await message.reply("Uso: `!ia-rol <rol> | <mensaje>`\nEjemplo: `!ia-rol profesor | Explícame derivadas`");
      return;
    }
    const response = await chat(
      `Eres un experto actuando como: ${rol.trim()}. Responde en español de forma clara y útil.`,
      userMsg
    );
    await sendLong(message, `**Rol:** *${rol.trim()}*\n\n${response}`);

  } else if (command === "ia-resume") {
    const response = await chat(
      "Eres un asistente especializado en resumir textos. Crea un resumen claro, conciso y bien estructurado en español. Incluye los puntos clave.",
      args
    );
    await sendLong(message, `**Resumen:**\n${response}`);

  } else if (command === "ia-explica") {
    const response = await chat(
      "Eres un profesor que explica conceptos de forma simple y clara en español. Siempre incluye: 1) Una explicación sencilla, 2) Un ejemplo práctico, 3) Una analogía del mundo real si aplica.",
      `Explícame el concepto: ${args}`
    );
    await sendLong(message, `**Explicación de: ${args}**\n\n${response}`);
  }
}

export async function sendLong(message: Message, text: string) {
  const MAX = 1900;
  if (text.length <= MAX) {
    await message.reply(text);
    return;
  }
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += MAX) {
    parts.push(text.slice(i, i + MAX));
  }
  for (const part of parts) {
    await message.channel.send(part);
  }
}
