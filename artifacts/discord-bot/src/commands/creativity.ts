import { Message } from "discord.js";
import { chat } from "../openai.js";
import { sendLong } from "./chat.js";

export async function handleCreativity(message: Message, command: string, args: string) {
  if (!args) {
    await message.reply(`Uso: \`!${command} <argumento>\``);
    return;
  }

  await message.channel.sendTyping();

  if (command === "ia-historia") {
    const [tema, estilo] = args.split("|").map(s => s.trim());
    if (!tema) {
      await message.reply("Uso: `!ia-historia <tema> | <estilo>`\nEjemplo: `!ia-historia cyberpunk | noir`");
      return;
    }
    const estiloFinal = estilo || "narrativo clásico";
    const response = await chat(
      `Eres un escritor creativo experto. Escribe historias cortas, inmersivas y bien construidas en español.`,
      `Escribe una historia corta sobre: "${tema}" con estilo: "${estiloFinal}". La historia debe tener inicio, nudo y desenlace. Máximo 400 palabras.`
    );
    await sendLong(message, `**Historia: ${tema}** *(estilo: ${estiloFinal})*\n\n${response}`);

  } else if (command === "ia-poema") {
    const [tema, tipo] = args.split("|").map(s => s.trim());
    if (!tema) {
      await message.reply("Uso: `!ia-poema <tema> | <tipo>`\nEjemplo: `!ia-poema desamor | rap`");
      return;
    }
    const tipoFinal = tipo || "poema libre";
    const response = await chat(
      `Eres un poeta y escritor creativo. Puedes escribir poemas clásicos, rap, haikus, sonetos, poesía libre, canciones, etc. Escribe en español.`,
      `Escribe un ${tipoFinal} sobre el tema: "${tema}". Que sea emotivo, creativo y memorable.`
    );
    await sendLong(message, `**${tipoFinal.charAt(0).toUpperCase() + tipoFinal.slice(1)}: ${tema}**\n\n${response}`);

  } else if (command === "ia-titulo") {
    const response = await chat(
      "Eres un experto en copywriting y marketing de contenidos. Generas títulos creativos, atractivos y optimizados para engagement en español.",
      `Genera 8 títulos creativos y atractivos para: "${args}". Varía entre títulos llamativos, misteriosos, emocionales y con preguntas. Numera cada uno.`
    );
    await sendLong(message, `**Títulos para: ${args}**\n\n${response}`);

  } else if (command === "ia-personaje") {
    const genero = args || "fantasía";
    const response = await chat(
      "Eres un diseñador de personajes para juegos de rol, videojuegos y narrativa. Creas personajes detallados, interesantes y con trasfondo profundo en español.",
      `Crea una ficha de personaje completa para el género: "${genero}". Incluye: Nombre, Raza/Especie, Clase/Profesión, Trasfondo/Lore, Habilidades especiales (3-5), Personalidad, Debilidades, Motivación principal y un dato curioso.`
    );
    await sendLong(message, `**Personaje de ${genero}:**\n\n${response}`);
  }
}
