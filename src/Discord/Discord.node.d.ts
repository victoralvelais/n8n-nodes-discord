import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
export interface IDiscordNodeMessageParameters {
    executionId: string;
    triggerPlaceholder: boolean;
    triggerChannel: boolean;
    channelId: string;
    embed: boolean;
    title: string;
    description: string;
    url: string;
    color: string;
    timestamp: string;
    footerText: string;
    footerIconUrl: string;
    imageUrl: string;
    thumbnailUrl: string;
    authorName: string;
    authorIconUrl: string;
    authorUrl: string;
    fields: {
        field?: {
            name: string;
            value: string;
            inline: boolean;
        }[];
    };
    mentionRoles: string[];
    content: string;
    files: {
        file?: {
            url: string;
        }[];
    };
}
export interface IDiscordNodePromptParameters {
    executionId: string;
    triggerPlaceholder: boolean;
    triggerChannel: boolean;
    channelId: string;
    mentionRoles: string[];
    content: string;
    timeout: number;
    placeholder: string;
    apiKey: string;
    baseUrl: string;
    buttons: {
        button?: {
            value: string;
            label: string;
            style: number;
        }[];
    };
    select: {
        select?: {
            value: string;
            label: string;
            description: string;
        }[];
    };
    persistent: boolean;
    minSelect: number;
    maxSelect: number;
    updateMessageId: string;
}
export interface IDiscordNodeActionParameters {
    executionId: string;
    triggerPlaceholder: boolean;
    triggerChannel: boolean;
    channelId: string;
    apiKey: string;
    baseUrl: string;
    actionType: string;
    removeMessagesNumber: number;
    userId?: string;
    roleUpdateIds?: string[] | string;
}
export declare class Discord implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getChannels(): Promise<INodePropertyOptions[]>;
            getRoles(): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
