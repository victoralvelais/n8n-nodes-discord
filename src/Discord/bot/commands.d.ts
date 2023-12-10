import { Client, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
export declare const registerCommands: (token: string, clientId: string, triggerCommands?: RESTPostAPIApplicationCommandsJSONBody[]) => Promise<any>;
export default function (token: string, clientId: string, client: Client): Promise<void>;
