import { ChannelType, Client, GuildBasedChannel } from 'discord.js'
import Ipc from 'node-ipc'

import { addLog } from '../helpers'
import state from '../state'

export default async function (ipc: typeof Ipc, client: Client) {
  ipc.server.on('list:channels', (data: { serverIds: string | string[] }, socket: any) => {
    const { serverIds } = data
    try {
      if (state.ready) {
        const channels: { name: string; value: string }[] = []

        const getChannelsFromGuild = (guild) => {
          const guildChannels =
            guild.channels.cache.filter(
              (c) => c.type === ChannelType.GuildText || c.type === ChannelType.GuildAnnouncement,
            ) ?? ([] as GuildBasedChannel[])

          guildChannels.forEach((channel: GuildBasedChannel) => {
            channels.push({
              name: `${channel.name} (${guild.name})`,
              value: channel.id,
            })
          })
        }

        if (!serverIds?.length) {
          client.guilds.cache.forEach(getChannelsFromGuild)
        } else {
          const serverIdArray = Array.isArray(serverIds) ? serverIds : [serverIds]
          serverIdArray.forEach((serverId) => {
            const guild = client.guilds.cache.get(serverId)
            if (guild) {
              getChannelsFromGuild(guild)
            }
          })
        }

        ipc.server.emit(socket, 'list:channels', channels)
        addLog(`list:channels`, client)
      }
    } catch (e) {
      addLog(`${e}`, client)
    }
  })
}
