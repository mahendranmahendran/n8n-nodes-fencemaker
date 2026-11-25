import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTripGetAll = {
	operation: ['getAll'],
	resource: ['trip'],
};

export const tripGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: showOnlyForTripGetAll },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
		routing: { send: { type: 'query', property: 'per_page' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: { show: showOnlyForTripGetAll },
		typeOptions: { minValue: 1 },
		default: 1,
		description: 'Page of results to return (fencemaker paginates by page, not offset)',
		routing: { send: { type: 'query', property: 'page' } },
	},
];
