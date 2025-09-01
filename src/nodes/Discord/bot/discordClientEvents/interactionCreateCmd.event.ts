import type { CacheType, Client, GuildMemberRoleManager, Interaction, TextChannel } from 'discord.js'

import { addLog, generateUniqueId, placeholderLoading, triggerWorkflow } from '../helpers'
import state from '../state'

export default async function (client: Client) {
  client.on('interactionCreate', (interaction: Interaction<CacheType>) => {
    try {
      if (!interaction.isChatInputCommand()) return
      if (!interaction.guildId) {
        interaction.reply({ content: 'Commands work only inside channels' })
        return
      }

      const userRoles = (interaction.member?.roles as GuildMemberRoleManager).cache.map((role) => role.id)

      const input = interaction.options.getString('input')

      if (state.channels[interaction.channelId] || state.channels.all) {
        ;[...(state.channels[interaction.channelId] ?? []), ...(state.channels.all ?? [])].forEach(async (trigger) => {
          if (trigger.type === 'command') {
            if (trigger.roleIds?.length) {
              const hasRole = trigger.roleIds.some((role) => userRoles?.includes(role))
              if (!hasRole) {
                interaction.reply({ content: 'You do not have permission', ephemeral: true }).catch((e) => e)

                return
              }
            }
            if (trigger.name === interaction.commandName) {
              addLog(`triggerWorkflow ${trigger.webhookId}`, client)
              const placeholderMatchingId = trigger.placeholder ? generateUniqueId() : ''

              interaction.reply({ content: `/${interaction.commandName} sent`, ephemeral: true }).catch((e) => e)

              const isEnabled = await triggerWorkflow({
                webhookId: trigger.webhookId,
                serverId: interaction.guildId,
                placeholderId: placeholderMatchingId,
                baseUrl: state.baseUrl,
                user: interaction.user,
                channelId: interaction.channelId,
                // TODO: Update to support multiple inputs
                interactionValues: input ? [input] : undefined,
                userRoles,
              }).catch((e) => e)
              if (isEnabled && trigger.placeholder) {
                const channel = client.channels.cache.get(interaction.channelId)
                const placeholder = await (channel as TextChannel)
                  .send(trigger.placeholder)
                  .catch((e: any) => addLog(`${e}`, client))
                if (placeholder) placeholderLoading(placeholder, placeholderMatchingId, trigger.placeholder)
              }
            }
          }
        })
      }
    } catch (e) {
      addLog(`${e}`, client)
    }
  })
}
