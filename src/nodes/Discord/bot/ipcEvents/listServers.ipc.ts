import { Client, Guild } from 'discord.js'
import Ipc from 'node-ipc'

import { addLog } from '../helpers'
import state from '../state'

export default async function (ipc: typeof Ipc, client: Client) {
  ipc.server.on('list:servers', (data: undefined, socket: any) => {
    try {
      if (state.ready) {
        const guilds = client.guilds.cache

        const serversList = guilds.map((guild: Guild) => {
          return {
            name: guild.name,
            value: guild.id,
          }
        })

        ipc.server.emit(socket, 'list:servers', serversList)
        addLog(`list:servers`, client)
      }
    } catch (e) {
      addLog(`${e}`, client)
    }
  })
}
