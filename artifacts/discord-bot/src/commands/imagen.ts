import { Message } from "discord.js";
import { openai } from "../openai.js";

export async function handleImagen(message: Message, args: string) {
  if (!args) {
    await message.reply(
      "Debes describir la imagen que quieres generar.\nEjemplo: `!ia-imagen un dragón volando sobre una ciudad futurista al atardecer`"
    );
    return;
  }

  const typing = await message.channel.sendTyping();
  const loadingMsg = await message.reply("🎨 Generando tu imagen, un momento...");

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: args,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      await loadingMsg.edit("No se pudo generar la imagen. Intenta con otra descripción.");
      return;
    }

    await loadingMsg.delete();
    await message.reply({
      content: `🖼️ **Imagen generada para:** *${args.length > 100 ? args.slice(0, 100) + "..." : args}*\n\n*Generado con DALL·E 3 | Creado por LzSunshine*`,
      files: [{ attachment: imageUrl, name: "imagen-ia.png" }],
    });
  } catch (err: any) {
    await loadingMsg.edit(
      `❌ Error al generar la imagen: ${err?.message ?? "Error desconocido"}.\nIntenta con una descripción diferente.`
    );
  }
}
