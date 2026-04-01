import { haversineDistanceMeters } from "@/lib/distance";
import { Coordinates } from "@/lib/types";

export type Player = {
  id: string;
  name: string;
  points: number;
  totalBumps: number;
  uniquePeople: number;
  achievements: string[];
  dailyPoints: number;
  location: Coordinates;
};

export type ActivityEvent = {
  id: string;
  message: string;
  timestamp: string;
};

export const BUMP_RADIUS_METERS = 150;
export const SCHOOL_QUIET_ZONE_RADIUS_METERS = 120;

export const schoolLocation: Coordinates = {
  lat: 40.7747,
  lng: -73.9578,
};

export const isInSchoolQuietZone = (location: Coordinates): boolean =>
  haversineDistanceMeters(location, schoolLocation) <=
  SCHOOL_QUIET_ZONE_RADIUS_METERS;

export const findNearestPlayer = (
  currentLocation: Coordinates,
  currentPlayerId: string,
  players: Player[],
): { player: Player; distance: number } | null => {
  const others = players.filter((player) => player.id !== currentPlayerId);

  if (others.length === 0) {
    return null;
  }

  const nearest = others
    .map((player) => ({
      player,
      distance: haversineDistanceMeters(currentLocation, player.location),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  return nearest;
};

export const arePlayersInBumpRange = (
  first: Coordinates,
  second: Coordinates,
): boolean => haversineDistanceMeters(first, second) <= BUMP_RADIUS_METERS;
