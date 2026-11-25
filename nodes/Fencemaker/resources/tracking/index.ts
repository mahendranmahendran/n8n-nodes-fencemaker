import type {
	IDataObject,
	IExecuteSingleFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { trackingGetLatestLocationDescription } from './getLatestLocation';

const showOnlyForTracking = {
	resource: ['tracking'],
};

async function extractLatestLocation(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	return items.map((item) => {
		const device = item.json as IDataObject;
		const json: IDataObject = {
			device_id: device.id,
			label: device.label,
			last_lat: device.last_lat,
			last_lon: device.last_lon,
			last_seen_at: device.last_seen_at,
		};
		return { ...item, json };
	});
}

export const trackingDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTracking },
		options: [
			{
				name: 'Get Latest Location',
				value: 'getLatestLocation',
				action: 'Get the latest known location for a vehicle',
				description:
					'Reads last_lat/last_lon/last_seen_at off the device record (fencemaker has no separate tracking endpoint)',
				routing: {
					request: {
						method: 'GET',
						url: '=/devices/{{ $parameter.vehicleId }}',
					},
					output: {
						postReceive: [extractLatestLocation],
					},
				},
			},
		],
		default: 'getLatestLocation',
	},
	...trackingGetLatestLocationDescription,
];
