import type { INodeProperties } from 'n8n-workflow';
import { geofenceGetDescription } from './get';
import { geofenceGetAllDescription } from './getAll';
import { geofenceCreateDescription, buildGeofenceCreateBody } from './create';

const showOnlyForGeofences = {
	resource: ['geofence'],
};

export const geofenceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForGeofences },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a geofence',
				description: 'Get a single geofence (territory) by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/territories/{{ $parameter.geofenceId }}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many geofences',
				description: 'Get many geofences (territories)',
				routing: {
					request: {
						method: 'GET',
						url: '/territories',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'territories' },
							},
						],
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a geofence',
				description: 'Create a geofence (territory). Safe to re-run with the same Source System + External ID.',
				routing: {
					request: {
						method: 'POST',
						url: '/territories',
					},
					send: {
						preSend: [buildGeofenceCreateBody],
					},
				},
			},
		],
		default: 'getAll',
	},
	...geofenceGetDescription,
	...geofenceGetAllDescription,
	...geofenceCreateDescription,
];
