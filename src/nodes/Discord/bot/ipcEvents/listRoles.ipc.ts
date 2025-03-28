import { Client, Role } from 'discord.js'
import Ipc from 'node-ipc'

import { addLog } from '../helpers'
import state from '../state'

export default async function (ipc: typeof Ipc, client: Client) {
  ipc.server.on('list:roles', (data: { serverIds: string[] }, socket: any) => {
    try {
      if (state.ready) {
        const roles: { name: string; value: string }[] = []

        const getRolesFromGuild = (guild) => {
          const guildRoles = guild.roles.cache
          guildRoles.forEach((role: Role) => {
            roles.push({
              name: `${role.name} (${guild.name})`,
              value: role.id,
            })
          })
        }

        if (!data.serverIds?.length) {
          client.guilds.cache.forEach(getRolesFromGuild)
        } else {
          data.serverIds.forEach((serverId) => {
            const guild = client.guilds.cache.get(serverId)
            if (guild) {
              getRolesFromGuild(guild)
            }
          })
        }

        ipc.server.emit(socket, 'list:roles', roles)
        addLog(`list:roles`, client)
      }
    } catch (e) {
      addLog(`${e}`, client)
    }
  })
}
