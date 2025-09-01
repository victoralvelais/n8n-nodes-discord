import { Client, TextChannel } from 'discord.js'

import { addLog, generateUniqueId, placeholderLoading, triggerWorkflow } from '../helpers'
import state from '../state'

export default async function (client: Client) {
  client.on('guildMemberUpdate', (oldMember, member) => {
    try {
      if (!member || member.user.system) return
      const previousUserRoles = oldMember.roles.cache.map((role) => role.id)
      const currentUserRoles = member.roles.cache.map((role) => role.id)
      const addedRoles = currentUserRoles.filter((role) => !previousUserRoles.includes(role))
      const removedRoles = previousUserRoles.filter((role) => !currentUserRoles.includes(role))

      const previousNick = oldMember?.nickname || ''
      const currentNick = member?.nickname || ''
      const nickChanged = previousNick !== currentNick

      if (addedRoles.length || removedRoles.length) {
        Object.keys(state.channels).forEach((key) => {
          const channel = state.channels[key]
          channel.forEach(async (trigger) => {
            if (trigger.roleIds?.length) {
              const hasRole = trigger.roleIds.some((role) => previousUserRoles?.includes(role))
              if (!hasRole) return
            }
            if (
              (addedRoles.length && trigger.type === 'userRoleAdded') ||
              (removedRoles.length && trigger.type === 'userRoleRemoved')
            ) {
              if (trigger.type === 'userRoleAdded' && trigger.roleUpdateIds.length) {
                const hasRole = trigger.roleUpdateIds.some((role) => addedRoles?.includes(role))
                if (!hasRole) return
              }
              if (trigger.type === 'userRoleRemoved' && trigger.roleUpdateIds.length) {
                const hasRole = trigger.roleUpdateIds.some((role) => removedRoles?.includes(role))
                if (!hasRole) return
              }

              addLog(`triggerWorkflow ${trigger.webhookId}`, client)
              const placeholderMatchingId = trigger.placeholder ? generateUniqueId() : ''
              const isEnabled = await triggerWorkflow({
                webhookId: trigger.webhookId,
                message: null,
                placeholderId: placeholderMatchingId,
                baseUrl: state.baseUrl,
                user: member.user,
                channelId: key,
                addedRoles,
                removedRoles,
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
      }

      if (nickChanged) {
        Object.keys(state.channels).forEach((key) => {
          const channel = state.channels[key]
          channel.forEach(async (trigger) => {
            if (trigger.type === 'userNickUpdated') {
              addLog(`triggerWorkflow ${trigger.webhookId}`, client)
              const placeholderMatchingId = trigger.placeholder ? generateUniqueId() : ''
              const isEnabled = await triggerWorkflow({
                webhookId: trigger.webhookId,
                message: null,
                placeholderId: placeholderMatchingId,
                baseUrl: state.baseUrl,
                user: member.user,
                channelId: key,
                nick: currentNick,
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
      }
    } catch (e) {
      addLog(`${e}`, client)
    }
  })
}
