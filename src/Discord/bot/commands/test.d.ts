import { SlashCommandBuilder } from "discord.js"
declare const _default: {
  params: {
    autoRemove: boolean
  }
  registerCommand: () => Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  executeCommand: (param: boolean | undefined) => Promise<string>
}
export default _default
