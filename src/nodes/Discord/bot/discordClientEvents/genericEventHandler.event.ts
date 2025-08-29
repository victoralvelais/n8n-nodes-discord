import { Client } from 'discord.js'

import { addLog, generateUniqueId, triggerWorkflow } from '../helpers'
import state from '../state'

// Define a type for event handlers to ensure consistency
type EventHandler = (client: Client, eventName: string) => void

// Create a generic event handler that can be used for all events
const createGenericEventHandler: EventHandler = (client, eventName) => {
  console.log('Registering event:', eventName)
  // TODO Implement contact tracing strategy to cache messages in order to receive events
  // TODO Filter out serverIds and channelIds
  // TODO Filter out roleIds
  client.on(eventName, async (...args) => {
    try {
      Object.keys(state.channels).forEach((key) => {
        addLog(`triggerWorkflow for DISCORD ${eventName}`, client)
        console.log(`KEY`, key)
        const channel = state.channels[key]
        console.log(`CHANNEL`, channel)
        channel.forEach(async (trigger) => {
          if (trigger.customEvent === eventName) {
            // trigger.type === 'customEvent'
            const event = args[0]
            console.log('EVENT', eventName, event)
            const channelId = event.message.channelId
            const originChannel = client.channels.cache.get(channelId)
            console.log('ORIGIN', originChannel)
            const fetchMessages = (await originChannel?.messages.fetch()) || []
            console.log('FETCH MESSAGES', fetchMessages)
            addLog(`triggerWorkflow ${trigger.webhookId} for ${eventName}`, client)
            const placeholderMatchingId = trigger.placeholder ? generateUniqueId() : ''

            // Pass the event data to the workflow
            await triggerWorkflow(
              trigger.webhookId,
              null,
              placeholderMatchingId,
              state.baseUrl,
              undefined,
              '',
              '',
              '',
              [],
              [],
              '',
              [],
              [],
              { eventName, eventData: args },
            ).catch((e) => addLog(`Error triggering workflow: ${e}`, client))
          }
        })
      })
    } catch (error) {
      addLog(`Error handling ${eventName}: ${error}`, client)
    }
  })
}
export default function registerAllEvents(client: Client) {
  // List of all Discord.js events
  const events = [
    'applicationCommandPermissionsUpdate',
    'autoModerationActionExecution',
    'autoModerationRuleCreate',
    'autoModerationRuleDelete',
    'autoModerationRuleUpdate',
    'channelCreate',
    'channelDelete',
    'channelPinsUpdate',
    'channelUpdate',
    'emojiCreate',
    'emojiDelete',
    'emojiUpdate',
    'entitlementCreate',
    'entitlementDelete',
    'entitlementUpdate',
    'guildAuditLogEntryCreate',
    'guildAvailable',
    'guildBanAdd',
    'guildBanRemove',
    'guildCreate',
    'guildDelete',
    'guildIntegrationsUpdate',
    'guildMemberAdd',
    'guildMemberAvailable',
    'guildMemberRemove',
    'guildMembersChunk',
    'guildMemberUpdate',
    'guildScheduledEventCreate',
    'guildScheduledEventDelete',
    'guildScheduledEventUpdate',
    'guildScheduledEventUserAdd',
    'guildScheduledEventUserRemove',
    'guildUnavailable',
    'guildUpdate',
    'interactionCreate',
    'inviteCreate',
    'inviteDelete',
    'messageCreate',
    'messageDelete',
    'messageDeleteBulk',
    'messagePollVoteAdd',
    'messagePollVoteRemove',
    'messageReactionAdd',
    'messageReactionRemove',
    'messageReactionRemoveAll',
    'messageReactionRemoveEmoji',
    'messageUpdate',
    'presenceUpdate',
    'roleCreate',
    'roleDelete',
    'roleUpdate',
    'stageInstanceCreate',
    'stageInstanceDelete',
    'stageInstanceUpdate',
    'stickerCreate',
    'stickerDelete',
    'stickerUpdate',
    'subscriptionCreate',
    'subscriptionDelete',
    'subscriptionUpdate',
    'threadCreate',
    'threadDelete',
    'threadListSync',
    'threadMembersUpdate',
    'threadMemberUpdate',
    'threadUpdate',
    'typingStart',
    'userUpdate',
    'voiceChannelEffectSend',
    'voiceStateUpdate',
    'webhooksUpdate',
    'webhookUpdate',
  ]

  // Register all events
  events.forEach((eventName) => {
    createGenericEventHandler(client, eventName)
  })

  // Return the list of registered events for reference
  return events
}
