import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { vehicleDescription } from './resources/vehicle';
import { geofenceDescription } from './resources/geofence';
import { tripDescription } from './resources/trip';
import { trackingDescription } from './resources/tracking';

export class Fencemaker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fencemaker',
		name: 'fencemaker',
		icon: { light: 'file:fencemaker.svg', dark: 'file:fencemaker.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Read vehicle/geofence/trip data from fencemaker, and create trips and geofences',
		defaults: {
			name: 'Fencemaker',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'fencemakerApi', required: true }],
		requestDefaults: {
			baseURL: 'https://fencemaker.app/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Vehicle', value: 'vehicle' },
					{ name: 'Geofence', value: 'geofence' },
					{ name: 'Trip', value: 'trip' },
					{ name: 'Tracking', value: 'tracking' },
				],
				default: 'trip',
			},
			...vehicleDescription,
			...geofenceDescription,
			...tripDescription,
			...trackingDescription,
		],
	};
}
