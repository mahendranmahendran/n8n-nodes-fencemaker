import type { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
import { circleToPolygon, pointsToPolygon } from './geoUtils';

const showOnlyForGeofenceCreate = {
	operation: ['create'],
	resource: ['geofence'],
};

export const geofenceCreateDescription: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForGeofenceCreate },
		description: 'Name of the geofence/territory',
	},
	{
		displayName: 'Geometry Source',
		name: 'geometrySource',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForGeofenceCreate },
		options: [
			{ name: 'Polygon (Point List)', value: 'polygon' },
			{ name: 'Circle (Center + Radius)', value: 'circle' },
			{ name: 'Advanced (Raw GeoJSON)', value: 'advanced' },
		],
		default: 'polygon',
		description: 'How the geofence boundary is supplied. Circle is converted to a polygon before sending — fencemaker only accepts Polygon/MultiPolygon.',
	},
	{
		displayName: 'Polygon Points',
		name: 'polygonPoints',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: {
			show: { ...showOnlyForGeofenceCreate, geometrySource: ['polygon'] },
		},
		description: 'Ordered list of points forming the polygon boundary (at least 3)',
		options: [
			{
				displayName: 'Point',
				name: 'point',
				values: [
					{ displayName: 'Latitude', name: 'lat', type: 'number', default: 0 },
					{ displayName: 'Longitude', name: 'lon', type: 'number', default: 0 },
				],
			},
		],
	},
	{
		displayName: 'Center Latitude',
		name: 'centerLat',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { ...showOnlyForGeofenceCreate, geometrySource: ['circle'] },
		},
	},
	{
		displayName: 'Center Longitude',
		name: 'centerLon',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { ...showOnlyForGeofenceCreate, geometrySource: ['circle'] },
		},
	},
	{
		displayName: 'Radius (Meters)',
		name: 'radiusMeters',
		type: 'number',
		default: 100,
		displayOptions: {
			show: { ...showOnlyForGeofenceCreate, geometrySource: ['circle'] },
		},
	},
	{
		displayName: 'Advanced Geometry (Raw GeoJSON)',
		name: 'advancedGeometry',
		type: 'json',
		default: '{\n  "type": "Polygon",\n  "coordinates": []\n}',
		displayOptions: {
			show: { ...showOnlyForGeofenceCreate, geometrySource: ['advanced'] },
		},
		description:
			'Raw GeoJSON Polygon or MultiPolygon geometry — used for anything the structured fields don\'t cover, including a route-corridor',
	},
	{
		displayName: 'Source System',
		name: 'sourceSystem',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForGeofenceCreate },
		description: 'Identifies the calling system for idempotency (paired with External ID)',
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForGeofenceCreate },
		description:
			'ID of the originating record (e.g. a delivery-zone ID in your own system). Re-sending the same Source System + External ID returns the existing geofence instead of creating a duplicate.',
	},
];

export async function buildGeofenceCreateBody(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const name = this.getNodeParameter('name') as string;
	const geometrySource = this.getNodeParameter('geometrySource') as string;
	const sourceSystem = this.getNodeParameter('sourceSystem') as string;
	const externalId = this.getNodeParameter('externalId') as string;
	const idempotencyFields = {
		...(sourceSystem ? { source_system: sourceSystem } : {}),
		...(externalId ? { external_id: externalId } : {}),
	};

	let boundary: object;
	if (geometrySource === 'circle') {
		const centerLat = this.getNodeParameter('centerLat') as number;
		const centerLon = this.getNodeParameter('centerLon') as number;
		const radiusMeters = this.getNodeParameter('radiusMeters') as number;
		boundary = { type: 'Polygon', coordinates: circleToPolygon(centerLat, centerLon, radiusMeters) };
	} else if (geometrySource === 'advanced') {
		const raw = this.getNodeParameter('advancedGeometry') as string | object;
		boundary = typeof raw === 'string' ? JSON.parse(raw) : raw;
	} else {
		const pointsCollection = this.getNodeParameter('polygonPoints') as {
			point?: Array<{ lat: number; lon: number }>;
		};
		const points = pointsCollection.point ?? [];
		boundary = { type: 'Polygon', coordinates: pointsToPolygon(points) };
	}

	requestOptions.body = {
		...(requestOptions.body as object),
		name,
		boundary,
		...idempotencyFields,
	};
	return requestOptions;
}
