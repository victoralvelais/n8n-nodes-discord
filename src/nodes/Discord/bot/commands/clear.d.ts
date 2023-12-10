import { Interaction, SlashCommandBuilder } from "discord.js"
declare const _default: {
  params: {
    autoRemove: boolean
  }
  registerCommand: () => Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  executeCommand: (param: number, interaction: Interaction) => Promise<string>
}
export default _default
