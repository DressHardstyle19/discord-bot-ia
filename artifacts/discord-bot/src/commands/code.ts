import { Message } from "discord.js";
import { chat } from "../openai.js";
import { sendLong } from "./chat.js";

export async function handleCode(message: Message, command: string, args: string) {
  if (!args) {
    await message.reply(`Uso: \`!${command} <argumento>\``);
    return;
  }

  await message.channel.sendTyping();

  if (command === "ia-code") {
    const [lenguaje, ...rest] = args.split("|");
    const tarea = rest.join("|").trim();
    if (!lenguaje || !tarea) {
      await message.reply("Uso: `!ia-code <lenguaje> | <tarea>`\nEjemplo: `!ia-code python | función que lee un JSON`");
      return;
    }
    const response = await chat(
      `Eres un programador experto en ${lenguaje.trim()}. Escribes código limpio, bien comentado y funcional. Responde siempre con código dentro de bloques de código markdown (\`\`\`${lenguaje.trim()}) y luego una breve explicación de qué hace y cómo usarlo.`,
      `Escribe código en ${lenguaje.trim()} para: ${tarea}`
    );
    await sendLong(message, `**Código ${lenguaje.trim()} — ${tarea}**\n\n${response}`);

  } else if (command === "ia-debug") {
    const parts = args.split("|");
    const lenguaje = parts[0]?.trim();
    const error = parts[1]?.trim();
    const codigo = parts.slice(2).join("|").trim();

    if (!lenguaje || !error) {
      await message.reply("Uso: `!ia-debug <lenguaje> | <error> | <código>`\nEjemplo: `!ia-debug js | TypeError undefined | const x = obj.valor`");
      return;
    }

    const response = await chat(
      `Eres un experto en depuración y resolución de errores de código. Analizas errores de forma sistemática y clara. Siempre incluyes: causa del error, solución y código corregido.`,
      `Lenguaje: ${lenguaje}
Error: ${error}
${codigo ? `Código:\n${codigo}` : ""}

Analiza el error, explica la causa y proporciona el código corregido con explicación.`
    );
    await sendLong(message, `**Debug ${lenguaje} — ${error}**\n\n${response}`);

  } else if (command === "ia-refactor") {
    const [lenguaje, ...rest] = args.split("|");
    const codigo = rest.join("|").trim();
    if (!lenguaje || !codigo) {
      await message.reply("Uso: `!ia-refactor <lenguaje> | <código>`\nEjemplo: `!ia-refactor python | def fn(x): return x*x`");
      return;
    }
    const response = await chat(
      `Eres un experto en refactorización y buenas prácticas de programación en ${lenguaje.trim()}. Mejoras el código en términos de legibilidad, rendimiento, mantenibilidad y siguiendo convenciones del lenguaje.`,
      `Refactoriza este código en ${lenguaje.trim()} y explica las mejoras realizadas:

\`\`\`
${codigo}
\`\`\``
    );
    await sendLong(message, `**Refactor ${lenguaje.trim()}:**\n\n${response}`);
  }
}
