import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGeofenceGet = {
	operation: ['get'],
	resource: ['geofence'],
};

export const geofenceGetDescription: INodeProperties[] = [
	{
		displayName: 'Geofence ID',
		name: 'geofenceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForGeofenceGet },
		default: '',
		description: 'The fencemaker territory ID of the geofence to retrieve',
	},
];
