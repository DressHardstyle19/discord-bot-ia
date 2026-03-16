import { Message, EmbedBuilder, version as djsVersion } from "discord.js";

export async function handleInfo(message: Message, prefix: string) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("🤖 NyXoria Bot — Info")
    .setDescription("Bot de Discord con inteligencia artificial integrada, creado para potenciar tu servidor con herramientas de IA.")
    .addFields(
      {
        name: "👨‍💻 Creador",
        value: "**LzSunshine**",
        inline: true,
      },
      {
        name: "⚙️ Tecnología",
        value: "OpenAI GPT-4o-mini + DALL·E 3",
        inline: true,
      },
      {
        name: "📌 Prefijos",
        value: `\`${prefix}\` o \`?\``,
        inline: true,
      },
      {
        name: "🗂️ Módulos disponibles",
        value: [
          "💬 **Chat & Asistente** — `!ia`, `!ia-rol`, `!ia-resume`, `!ia-explica`",
          "🛡️ **Moderación** — `!ia-revisar`, `!ia-reescribe-safe`, `!ia-sugerir-regla`",
          "✍️ **Creatividad** — `!ia-historia`, `!ia-poema`, `!ia-titulo`, `!ia-personaje`",
          "📚 **Estudio** — `!ia-quiz`, `!ia-flashcards`, `!ia-plan`",
          "💻 **Código** — `!ia-code`, `!ia-debug`, `!ia-refactor`",
          "🎨 **Imágenes IA** — `!ia-imagen <descripción>`",
          "🌐 **Comunidad** — `!ia-bienvenida`, `!ia-evento`, `!ia-faq`",
          "🔧 **Presets** — `!ia-preset crear/usar/listar/eliminar`",
        ].join("\n"),
      },
      {
        name: "📖 Comandos rápidos",
        value: `\`${prefix}ia-ayuda\` — Ver todos los comandos\n\`${prefix}info\` — Ver esta información`,
        inline: false,
      }
    )
    .setFooter({ text: `Desarrollado con ❤️ por LzSunshine • discord.js v${djsVersion}` })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}
