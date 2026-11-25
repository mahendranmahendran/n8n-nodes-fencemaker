// fencemaker's POST /api/v1/territories only accepts a GeoJSON Polygon or
// MultiPolygon as `boundary` — there is no native Circle geometry (confirmed live,
// see docs/api-reference.md). The node's Circle field is therefore approximated as a
// many-sided polygon before the request is sent.
const EARTH_RADIUS_METERS = 6378137;

export function circleToPolygon(
	centerLat: number,
	centerLon: number,
	radiusMeters: number,
	sides = 32,
): number[][][] {
	const ring: number[][] = [];
	for (let i = 0; i <= sides; i++) {
		const angle = (i / sides) * 2 * Math.PI;
		const dLat = (radiusMeters * Math.cos(angle)) / EARTH_RADIUS_METERS;
		const dLon =
			(radiusMeters * Math.sin(angle)) /
			(EARTH_RADIUS_METERS * Math.cos((centerLat * Math.PI) / 180));
		const lat = centerLat + (dLat * 180) / Math.PI;
		const lon = centerLon + (dLon * 180) / Math.PI;
		ring.push([lon, lat]);
	}
	return [ring];
}

export function pointsToPolygon(points: Array<{ lat: number; lon: number }>): number[][][] {
	const ring = points.map((p) => [p.lon, p.lat]);
	const first = ring[0];
	const last = ring[ring.length - 1];
	if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
		ring.push(first as number[]);
	}
	return [ring];
}
