import type { INodeProperties } from 'n8n-workflow';
import { tripGetDescription } from './get';
import { tripGetAllDescription } from './getAll';
import { tripCreateDescription, buildTripCreateBody } from './create';
import { tripAssignVehicleDescription } from './assignVehicle';

const showOnlyForTrips = {
	resource: ['trip'],
};

export const tripDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTrips },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a trip',
				description: 'Get a single trip by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/trips/{{ $parameter.tripId }}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many trips',
				description: 'Get many trips',
				routing: {
					request: {
						method: 'GET',
						url: '/trips',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'trips' },
							},
						],
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a trip',
				description:
					'Create a trip with an ordered list of stops. Safe to re-run with the same Source System + External ID. Vehicle can be omitted and assigned later.',
				routing: {
					request: {
						method: 'POST',
						url: '/trips',
					},
					send: {
						preSend: [buildTripCreateBody],
					},
				},
			},
			{
				name: 'Assign Vehicle',
				value: 'assignVehicle',
				action: 'Assign a vehicle to a trip',
				description: 'Attach a vehicle to a trip that was created without one',
				routing: {
					request: {
						method: 'POST',
						url: '=/trips/{{ $parameter.tripId }}/assign-vehicle',
					},
				},
			},
		],
		default: 'getAll',
	},
	...tripGetDescription,
	...tripGetAllDescription,
	...tripCreateDescription,
	...tripAssignVehicleDescription,
];
