import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTripGet = {
	operation: ['get'],
	resource: ['trip'],
};

export const tripGetDescription: INodeProperties[] = [
	{
		displayName: 'Trip ID',
		name: 'tripId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForTripGet },
		default: '',
		description: 'The fencemaker trip ID to retrieve',
	},
];
