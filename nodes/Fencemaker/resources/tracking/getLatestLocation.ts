import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetLatestLocation = {
	operation: ['getLatestLocation'],
	resource: ['tracking'],
};

export const trackingGetLatestLocationDescription: INodeProperties[] = [
	{
		displayName: 'Vehicle ID',
		name: 'vehicleId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForGetLatestLocation },
		default: '',
		description: 'The fencemaker device ID to get the latest known location for',
	},
];
