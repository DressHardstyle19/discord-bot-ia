import "dotenv/config";
import { Client, GatewayIntentBits, Message } from "discord.js";
import { handleChat } from "./commands/chat.js";
import { handleModeration } from "./commands/moderation.js";
import { handleCreativity } from "./commands/creativity.js";
import { handleStudy } from "./commands/study.js";
import { handleCode } from "./commands/code.js";
import { handleCommunity } from "./commands/community.js";
import { handlePresets } from "./commands/presets.js";
import { handleImagen } from "./commands/imagen.js";
import { handleInfo } from "./commands/info.js";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = process.env.PREFIX || "!";
const PREFIX_2 = process.env.PREFIX_2 || "?";

if (!DISCORD_TOKEN) {
  console.error("ERROR: DISCORD_TOKEN no está configurado en las variables de entorno.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Bot conectado como ${client.user?.tag}`);
  console.log(`Prefijos activos: "${PREFIX}" y "${PREFIX_2}"`);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  const content = message.content.trim();
  const usedPrefix =
    content.startsWith(PREFIX) ? PREFIX :
    content.startsWith(PREFIX_2) ? PREFIX_2 :
    null;

  if (!usedPrefix) return;

  const withoutPrefix = content.slice(usedPrefix.length).trim();
  const command = withoutPrefix.split(/\s+/)[0]?.toLowerCase();
  const args = withoutPrefix.slice(command.length).trim();

  try {
    if (["ia", "ia-rol", "ia-resume", "ia-explica"].includes(command)) {
      await handleChat(message, command, args);
    } else if (["ia-revisar", "ia-reescribe-safe", "ia-sugerir-regla"].includes(command)) {
      await handleModeration(message, command, args);
    } else if (["ia-historia", "ia-poema", "ia-titulo", "ia-personaje"].includes(command)) {
      await handleCreativity(message, command, args);
    } else if (["ia-quiz", "ia-flashcards", "ia-plan"].includes(command)) {
      await handleStudy(message, command, args);
    } else if (["ia-code", "ia-debug", "ia-refactor"].includes(command)) {
      await handleCode(message, command, args);
    } else if (["ia-bienvenida", "ia-evento", "ia-faq"].includes(command)) {
      await handleCommunity(message, command, args);
    } else if (command === "ia-preset") {
      await handlePresets(message, args);
    } else if (command === "ia-imagen") {
      await handleImagen(message, args);
    } else if (command === "info") {
      await handleInfo(message, usedPrefix);
    } else if (command === "ia-ayuda" || command === "ia-help") {
      await sendHelp(message, usedPrefix);
    }
  } catch (err) {
    console.error(`Error en comando ${command}:`, err);
    await message.reply("Ocurrió un error al procesar tu comando. Intenta de nuevo.");
  }
});

async function sendHelp(message: Message, prefix: string) {
  const help = `**╔══════════════════════════════╗**
**║   🤖 NyXoria Bot — Comandos  ║**
**╚══════════════════════════════╝**
*Creado por **LzSunshine***  •  Prefijos: \`${prefix}\` o \`?\`

**💬 Chat / Asistente**
\`${prefix}ia <mensaje>\` — Asistente general
\`${prefix}ia-rol <rol> | <mensaje>\` — Responde con un rol
\`${prefix}ia-resume <texto>\` — Resume texto
\`${prefix}ia-explica <concepto>\` — Explicación simple + ejemplo

**🛡️ Moderación**
\`${prefix}ia-revisar <mensaje>\` — Evalúa si rompe reglas
\`${prefix}ia-reescribe-safe <texto>\` — Reescribe de forma respetuosa
\`${prefix}ia-sugerir-regla <caso>\` — Sugiere regla o acción de mod

**✍️ Escritura / Creatividad**
\`${prefix}ia-historia <tema> | <estilo>\` — Historia corta
\`${prefix}ia-poema <tema> | <tipo>\` — Poema/rap/haiku
\`${prefix}ia-titulo <tema>\` — Genera títulos/copies
\`${prefix}ia-personaje <género>\` — Ficha de personaje

**📚 Study / Productividad**
\`${prefix}ia-quiz <tema> | <nivel>\` — Preguntas tipo test
\`${prefix}ia-flashcards <tema> | <n>\` — Tarjetas de estudio
\`${prefix}ia-plan <objetivo> | <tiempo>\` — Plan de estudio

**💻 Programación**
\`${prefix}ia-code <lenguaje> | <tarea>\` — Genera código
\`${prefix}ia-debug <lenguaje> | <error> | <código>\` — Analiza errores
\`${prefix}ia-refactor <lenguaje> | <código>\` — Mejora código

**🎨 Imágenes con IA**
\`${prefix}ia-imagen <descripción>\` — Genera imagen con DALL·E 3

**🌐 Comunidad / Utilidad**
\`${prefix}ia-bienvenida <usuario> | <estilo>\` — Mensaje de bienvenida
\`${prefix}ia-evento <tipo> | <fecha>\` — Anuncio de evento
\`${prefix}ia-faq <tema>\` — Genera FAQ

**🔧 Presets**
\`${prefix}ia-preset crear <nombre> | <instrucciones>\`
\`${prefix}ia-preset usar <nombre> | <mensaje>\`
\`${prefix}ia-preset listar\`
\`${prefix}ia-preset eliminar <nombre>\`

**ℹ️ Info**
\`${prefix}info\` — Información del bot y creador`;

  await message.reply(help);
}

client.login(DISCORD_TOKEN);
