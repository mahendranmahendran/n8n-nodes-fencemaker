import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTripAssignVehicle = {
	operation: ['assignVehicle'],
	resource: ['trip'],
};

export const tripAssignVehicleDescription: INodeProperties[] = [
	{
		displayName: 'Trip ID',
		name: 'tripId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForTripAssignVehicle },
		default: '',
		description: 'The trip to assign a vehicle to',
	},
	{
		displayName: 'Vehicle ID',
		name: 'vehicleId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForTripAssignVehicle },
		default: '',
		description: 'The fencemaker device ID of the vehicle to assign',
		routing: { send: { type: 'body', property: 'vehicle_id' } },
	},
];
