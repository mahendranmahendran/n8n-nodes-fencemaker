import type { INodeProperties } from 'n8n-workflow';

const showOnlyForVehicleGet = {
	operation: ['get'],
	resource: ['vehicle'],
};

export const vehicleGetDescription: INodeProperties[] = [
	{
		displayName: 'Vehicle ID',
		name: 'vehicleId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForVehicleGet },
		default: '',
		description: 'The fencemaker device ID of the vehicle to retrieve',
	},
];
