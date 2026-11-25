import type { INodeProperties } from 'n8n-workflow';
import { vehicleGetDescription } from './get';
import { vehicleGetAllDescription } from './getAll';

const showOnlyForVehicles = {
	resource: ['vehicle'],
};

export const vehicleDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForVehicles },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a vehicle',
				description: 'Get a single vehicle by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/devices/{{ $parameter.vehicleId }}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many vehicles',
				description: 'Get many vehicles',
				routing: {
					request: {
						method: 'GET',
						url: '/devices',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'devices' },
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	...vehicleGetDescription,
	...vehicleGetAllDescription,
];
