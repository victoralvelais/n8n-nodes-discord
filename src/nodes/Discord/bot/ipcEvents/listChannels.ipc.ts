import { ChannelType, Client, GuildBasedChannel } from 'discord.js'
import Ipc from 'node-ipc'

import { addLog } from '../helpers'
import state from '../state'

export default async function (ipc: typeof Ipc, client: Client) {
  ipc.server.on('list:channels', (data: { serverIds: string[] }, socket: any) => {
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

        if (!data.serverIds?.length) {
          client.guilds.cache.forEach(getChannelsFromGuild)
        } else {
          data.serverIds.forEach((serverId) => {
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
