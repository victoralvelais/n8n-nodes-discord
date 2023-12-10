import { Interaction, SlashCommandBuilder } from "discord.js"
declare const _default: {
  params: {
    autoRemove: boolean
  }
  registerCommand: () => Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  executeCommand: (param: string, interaction: Interaction) => Promise<string | void>
}
export default _default
