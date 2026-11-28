import { createHmac, timingSafeEqual } from 'crypto';
import {
	NodeConnectionTypes,
	type IDataObject,
	type IHookFunctions,
	type IWebhookFunctions,
	type IWebhookResponseData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

const EVENT_OPTIONS = [
	{ name: 'Geofence Entry', value: 'entry' },
	{ name: 'Geofence Exit', value: 'exit' },
	{ name: 'Trip Started', value: 'trip.started' },
	{ name: 'Trip Completed', value: 'trip.completed' },
];

export class FencemakerTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fencemaker Trigger',
		name: 'fencemakerTrigger',
		icon: { light: 'file:../Fencemaker/fencemaker.svg', dark: 'file:../Fencemaker/fencemaker.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description:
			'Starts the workflow when fencemaker sends a geofence crossing or trip event via an Action Engine "Send to a URL" rule',
		defaults: {
			name: 'Fencemaker Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: EVENT_OPTIONS,
				default: ['entry', 'exit', 'trip.started', 'trip.completed'],
				description:
					'Which event types to react to. Events of any other type are ignored (workflow is not triggered).',
			},
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description:
					'Optional. Set this to the org\'s webhook secret (fencemaker Action Engine > Send to a URL > Webhook Secret) to verify the X-Fencemaker-Signature header. Leave empty to skip verification.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Fencemaker's Action Engine has no webhook registration API; the URL is
				// pasted manually into the rule's "Send to a URL" step, so there is
				// nothing to register or check here.
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const res = this.getResponseObject();
		const headers = this.getHeaderData() as Record<string, string>;
		const body = this.getBodyData() as IDataObject;

		const webhookSecret = this.getNodeParameter('webhookSecret') as string;
		if (webhookSecret) {
			const signatureHeader = headers['x-fencemaker-signature'];
			const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;
			const payloadString = rawBody ? rawBody.toString('utf8') : JSON.stringify(body);
			const expected =
				'sha256=' + createHmac('sha256', webhookSecret).update(payloadString).digest('hex');

			const signatureBuffer = Buffer.from(signatureHeader ?? '');
			const expectedBuffer = Buffer.from(expected);
			const valid =
				!!signatureHeader &&
				signatureBuffer.length === expectedBuffer.length &&
				timingSafeEqual(signatureBuffer, expectedBuffer);

			if (!valid) {
				res.status(401).json({ error: 'Invalid or missing X-Fencemaker-Signature header' });
				return { noWebhookResponse: true };
			}
		}

		const events = this.getNodeParameter('events') as string[];
		const eventType = typeof body.type === 'string' ? body.type : undefined;

		if (!eventType || !events.includes(eventType)) {
			// Acknowledge receipt (so fencemaker doesn't see a failed delivery) but
			// don't start the workflow for event types this node isn't listening for.
			return {
				webhookResponse: { ok: true, ignored: true },
			};
		}

		return {
			webhookResponse: { ok: true },
			workflowData: [this.helpers.returnJsonArray([body])],
		};
	}
}
