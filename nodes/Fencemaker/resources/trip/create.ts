import type { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';

const showOnlyForTripCreate = {
	operation: ['create'],
	resource: ['trip'],
};

export const tripCreateDescription: INodeProperties[] = [
	{
		displayName: 'Stops',
		name: 'stops',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true, sortable: true },
		required: true,
		default: {},
		displayOptions: { show: showOnlyForTripCreate },
		description:
			'Ordered list of stops for the trip. Order here sets the sequence sent to fencemaker.',
		options: [
			{
				displayName: 'Stop',
				name: 'stop',
				values: [
					{ displayName: 'Latitude', name: 'lat', type: 'number', default: 0 },
					{ displayName: 'Longitude', name: 'lon', type: 'number', default: 0 },
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
						description: 'Optional human-readable label for the stop',
					},
				],
			},
		],
	},
	{
		displayName: 'Vehicle ID',
		name: 'vehicleId',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForTripCreate },
		description:
			'Optional. Leave empty to create the trip unassigned — use the Assign Vehicle operation once a vehicle is picked.',
	},
	{
		displayName: 'Source System',
		name: 'sourceSystem',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForTripCreate },
		description: 'Identifies the calling system for idempotency (paired with External ID)',
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForTripCreate },
		description:
			'ID of the originating record (e.g. an order ID). Re-sending the same Source System + External ID returns the existing trip instead of creating a duplicate.',
	},
];

export async function buildTripCreateBody(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const stopsCollection = this.getNodeParameter('stops') as {
		stop?: Array<{ lat: number; lon: number; address?: string }>;
	};
	const stops = (stopsCollection.stop ?? []).map((stop, index) => ({
		sequence: index + 1,
		lat: stop.lat,
		lon: stop.lon,
		...(stop.address ? { address: stop.address } : {}),
	}));

	const vehicleId = this.getNodeParameter('vehicleId') as string;
	const sourceSystem = this.getNodeParameter('sourceSystem') as string;
	const externalId = this.getNodeParameter('externalId') as string;

	requestOptions.body = {
		...(requestOptions.body as object),
		stops,
		...(vehicleId ? { vehicle_id: vehicleId } : {}),
		...(sourceSystem ? { source_system: sourceSystem } : {}),
		...(externalId ? { external_id: externalId } : {}),
	};
	return requestOptions;
}
