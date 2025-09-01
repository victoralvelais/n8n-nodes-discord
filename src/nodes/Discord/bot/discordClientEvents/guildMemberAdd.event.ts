import type { Client, GuildMember, TextChannel } from 'discord.js'

import { addLog, generateUniqueId, placeholderLoading, triggerWorkflow } from '../helpers'
import state from '../state'

export default async function (client: Client) {
  client.on('guildMemberAdd', (member: GuildMember) => {
    try {
      if (member.user.system) return
      Object.keys(state.channels).forEach((key) => {
        const channel = state.channels[key]
        channel.forEach(async (trigger) => {
          if (trigger.type === 'userJoins') {
            addLog(`triggerWorkflow ${trigger.webhookId}`, client)
            const placeholderMatchingId = trigger.placeholder ? generateUniqueId() : ''
            const isEnabled = await triggerWorkflow({
              webhookId: trigger.webhookId,
              serverId: member.guild.id,
              message: null,
              placeholderId: placeholderMatchingId,
              baseUrl: state.baseUrl,
              user: member.user,
              channelId: key,
            }).catch((e) => e)
            if (isEnabled && trigger.placeholder) {
              const channel = client.channels.cache.get(key)
              const placeholder = await (channel as TextChannel)
                .send(trigger.placeholder)
                .catch((e: any) => addLog(`${e}`, client))
              if (placeholder) placeholderLoading(placeholder, placeholderMatchingId, trigger.placeholder)
            }
          }
        })
      })
    } catch (e) {
      addLog(`${e}`, client)
    }
  })
}
