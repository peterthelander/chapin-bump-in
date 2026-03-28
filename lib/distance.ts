import { Coordinates } from "@/lib/types";

const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const haversineDistanceMeters = (
  start: Coordinates,
  end: Coordinates,
): number => {
  const latDiff = toRadians(end.lat - start.lat);
  const lonDiff = toRadians(end.lng - start.lng);

  const startLatRadians = toRadians(start.lat);
  const endLatRadians = toRadians(end.lat);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(startLatRadians) *
      Math.cos(endLatRadians) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
};
