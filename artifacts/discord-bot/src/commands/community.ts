import { Message } from "discord.js";
import { chat } from "../openai.js";
import { sendLong } from "./chat.js";

export async function handleCommunity(message: Message, command: string, args: string) {
  if (!args) {
    await message.reply(`Uso: \`!${command} <argumento>\``);
    return;
  }

  await message.channel.sendTyping();

  if (command === "ia-bienvenida") {
    const [usuario, estilo] = args.split("|").map(s => s.trim());
    if (!usuario) {
      await message.reply("Uso: `!ia-bienvenida <usuario> | <estilo>`\nEjemplo: `!ia-bienvenida @Pepe | gracioso`");
      return;
    }
    const estiloFinal = estilo || "amigable";
    const response = await chat(
      `Eres un community manager experto. Escribes mensajes de bienvenida para servidores de Discord que son memorables, cálidos y originales. Estilo: ${estiloFinal}.`,
      `Crea un mensaje de bienvenida ${estiloFinal} para el usuario: ${usuario}. Hazlo especial, que se sienta bienvenido a la comunidad. Incluye emojis apropiados.`
    );
    await sendLong(message, response);

  } else if (command === "ia-evento") {
    const [tipo, fecha] = args.split("|").map(s => s.trim());
    if (!tipo) {
      await message.reply("Uso: `!ia-evento <tipo> | <fecha>`\nEjemplo: `!ia-evento torneo de ajedrez | sábado 8pm`");
      return;
    }
    const fechaFinal = fecha || "próximamente";
    const response = await chat(
      "Eres un community manager experto en crear anuncios de eventos para Discord. Tus anuncios son emocionantes, informativos y generan expectativa. Usas emojis de forma estratégica.",
      `Crea un anuncio oficial de evento para Discord:
Tipo de evento: ${tipo}
Fecha/Hora: ${fechaFinal}

El anuncio debe incluir: título llamativo, descripción del evento, detalles importantes (fecha, hora, cómo participar), y un call-to-action para que la gente se apunte.`
    );
    await sendLong(message, `**Anuncio de Evento:**\n\n${response}`);

  } else if (command === "ia-faq") {
    const tema = args;
    const response = await chat(
      "Eres un experto en gestión de comunidades. Creas secciones de FAQ (Preguntas Frecuentes) claras, útiles y bien estructuradas para canales de Discord.",
      `Genera una sección de FAQ completa para el tema: "${tema}" en un servidor de Discord.

Crea entre 6 y 8 preguntas frecuentes con sus respuestas. Usa el formato:
**❓ Pregunta**
💬 Respuesta

Las preguntas deben ser las más comunes y útiles para la comunidad.`
    );
    await sendLong(message, `**FAQ: ${tema}**\n\n${response}`);
  }
}
