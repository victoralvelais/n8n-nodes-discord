import type { Client, GuildMember, Presence, TextChannel } from 'discord.js'

import { addLog, generateUniqueId, placeholderLoading, triggerWorkflow } from '../helpers'
import state from '../state'

export default async function (client: Client) {
  client.on('presenceUpdate', (oldPresence, newPresence: Presence) => {
    const member: GuildMember | null = newPresence.member
    try {
      if (!member || member.user.system) return
      const userRoles = member.roles.cache.map((role) => role.id)
      Object.keys(state.channels).forEach((key) => {
        const channel = state.channels[key]
        channel.forEach(async (trigger) => {
          if (trigger.roleIds?.length) {
            const hasRole = trigger.roleIds.some((role) => userRoles?.includes(role))
            if (!hasRole) return
          }
          if (
            trigger.type === 'userPresenceUpdate' &&
            (trigger.presence === newPresence.status || trigger.presence === 'any')
          ) {
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
              presence: newPresence.status,
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
