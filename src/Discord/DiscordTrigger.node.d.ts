import { ITriggerFunctions } from 'n8n-core';
import { INodeType, INodeTypeDescription, IWebhookFunctions, IWebhookResponseData, INodePropertyOptions, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
export declare class DiscordTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getChannels(): Promise<INodePropertyOptions[]>;
            getRoles(): Promise<INodePropertyOptions[]>;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
    trigger(this: ITriggerFunctions): Promise<undefined>;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
