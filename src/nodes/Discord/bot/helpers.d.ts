import { INodePropertyOptions } from "n8n-workflow"
import { Client, Message, User } from "discord.js"
export interface ICredentials {
  clientId: string
  token: string
  apiKey: string
  baseUrl: string
}
export declare const connection: (credentials: ICredentials) => Promise<string>
export declare const getChannels: (that: any) => Promise<INodePropertyOptions[]>
export interface IRole {
  name: string
  id: string
}
export declare const getRoles: (that: any) => Promise<INodePropertyOptions[]>
export declare const triggerWorkflow: (
  webhookId: string,
  message: Message | null,
  placeholderId: string,
  baseUrl: string,
  user?: User,
  channelId?: string,
  presence?: string,
  addedRoles?: string[],
  removedRoles?: string[],
  interactionMessageId?: string,
  interactionValues?: string[],
  userRoles?: string[],
) => Promise<boolean>
export declare const addLog: (message: string, client: Client) => void
export declare const ipcRequest: (type: string, parameters: any) => Promise<any>
export declare const pollingPromptData: (
  message: any,
  content: string,
  seconds: number,
  client: any,
) => Promise<boolean>
export interface IExecutionData {
  executionId: string
  placeholderId: string
  channelId: string
  apiKey: string
  baseUrl: string
  userId?: string
}
export declare const execution: (
  executionId: string,
  placeholderId: string,
  channelId: string,
  apiKey: string,
  baseUrl: string,
  userId?: string,
) => Promise<boolean>
export declare const placeholderLoading: (
  placeholder: Message,
  placeholderMatchingId: string,
  txt: string,
) => Promise<void>
export declare function withTimeout<T>(promise: Promise<T>, ms: number): Promise<unknown>
