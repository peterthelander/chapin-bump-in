export type Coordinates = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const haversineDistanceMeters = (
  start: Coordinates,
  end: Coordinates,
): number => {
  const latDiff = toRadians(end.latitude - start.latitude);
  const lonDiff = toRadians(end.longitude - start.longitude);

  const startLatRadians = toRadians(start.latitude);
  const endLatRadians = toRadians(end.latitude);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(startLatRadians) *
      Math.cos(endLatRadians) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
};
