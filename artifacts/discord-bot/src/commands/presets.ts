import { Message } from "discord.js";
import { chat } from "../openai.js";
import { sendLong } from "./chat.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), ".discord-bot-data");
const PRESETS_FILE = join(DATA_DIR, "presets.json");

interface Preset {
  nombre: string;
  instrucciones: string;
  creadoPor: string;
  fechaCreacion: string;
}

function loadPresets(): Record<string, Preset> {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(PRESETS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(PRESETS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function savePresets(presets: Record<string, Preset>) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(PRESETS_FILE, JSON.stringify(presets, null, 2), "utf-8");
}

export async function handlePresets(message: Message, args: string) {
  const parts = args.trim().split(/\s+/);
  const subcommand = parts[0]?.toLowerCase();
  const rest = parts.slice(1).join(" ");

  if (subcommand === "listar") {
    const presets = loadPresets();
    const keys = Object.keys(presets);
    if (keys.length === 0) {
      await message.reply("No hay presets guardados. Crea uno con `!ia-preset crear <nombre> | <instrucciones>`");
      return;
    }
    const lista = keys.map((k, i) => `**${i + 1}.** \`${k}\` — ${presets[k].instrucciones.slice(0, 60)}...`).join("\n");
    await message.reply(`**Presets disponibles (${keys.length}):**\n${lista}`);

  } else if (subcommand === "crear") {
    const pipeIndex = rest.indexOf("|");
    if (pipeIndex === -1) {
      await message.reply("Uso: `!ia-preset crear <nombre> | <instrucciones>`\nEjemplo: `!ia-preset crear pirata | Responde siempre como un pirata del Caribe`");
      return;
    }
    const nombre = rest.slice(0, pipeIndex).trim().toLowerCase().replace(/\s+/g, "-");
    const instrucciones = rest.slice(pipeIndex + 1).trim();

    if (!nombre || !instrucciones) {
      await message.reply("El nombre y las instrucciones no pueden estar vacíos.");
      return;
    }

    const presets = loadPresets();
    presets[nombre] = {
      nombre,
      instrucciones,
      creadoPor: message.author.username,
      fechaCreacion: new Date().toISOString(),
    };
    savePresets(presets);
    await message.reply(`✅ Preset **\`${nombre}\`** creado correctamente!\nÚsalo con: \`!ia-preset usar ${nombre} | <tu mensaje>\``);

  } else if (subcommand === "usar") {
    const pipeIndex = rest.indexOf("|");
    if (pipeIndex === -1) {
      await message.reply("Uso: `!ia-preset usar <nombre> | <mensaje>`\nEjemplo: `!ia-preset usar pirata | Dime cómo está el tiempo`");
      return;
    }
    const nombre = rest.slice(0, pipeIndex).trim().toLowerCase();
    const userMsg = rest.slice(pipeIndex + 1).trim();

    const presets = loadPresets();
    const preset = presets[nombre];
    if (!preset) {
      await message.reply(`❌ No existe el preset **\`${nombre}\`**. Usa \`!ia-preset listar\` para ver los disponibles.`);
      return;
    }

    await message.channel.sendTyping();
    const response = await chat(preset.instrucciones, userMsg);
    await sendLong(message, `**[Preset: ${nombre}]**\n\n${response}`);

  } else if (subcommand === "eliminar" || subcommand === "borrar") {
    const nombre = rest.trim().toLowerCase();
    if (!nombre) {
      await message.reply("Uso: `!ia-preset eliminar <nombre>`");
      return;
    }
    const presets = loadPresets();
    if (!presets[nombre]) {
      await message.reply(`❌ No existe el preset **\`${nombre}\`**.`);
      return;
    }
    delete presets[nombre];
    savePresets(presets);
    await message.reply(`✅ Preset **\`${nombre}\`** eliminado.`);

  } else {
    await message.reply(`**Comandos de presets:**
\`!ia-preset crear <nombre> | <instrucciones>\` — Crea un nuevo preset
\`!ia-preset usar <nombre> | <mensaje>\` — Usa un preset
\`!ia-preset listar\` — Lista todos los presets
\`!ia-preset eliminar <nombre>\` — Elimina un preset`);
  }
}
