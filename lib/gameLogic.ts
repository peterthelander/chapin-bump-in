import { haversineDistanceMeters } from "@/lib/distance";
import { Coordinates } from "@/lib/types";

export type Player = {
  id: string;
  name: string;
  points: number;
  totalBumps: number;
  uniquePeopleBumped: number;
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

export const mockPlayers: Player[] = [
  {
    id: "alex",
    name: "Alex",
    points: 180,
    totalBumps: 22,
    uniquePeopleBumped: 12,
    achievements: ["First Bump", "Social Butterfly", "Explorer"],
    dailyPoints: 140,
    location: { lat: 40.776, lng: -73.9582 },
  },
  {
    id: "sam",
    name: "Sam",
    points: 150,
    totalBumps: 19,
    uniquePeopleBumped: 9,
    achievements: ["First Bump", "Explorer"],
    dailyPoints: 120,
    location: { lat: 40.7765, lng: -73.959 },
  },
  {
    id: "jordan",
    name: "Jordan",
    points: 142,
    totalBumps: 17,
    uniquePeopleBumped: 10,
    achievements: ["First Bump", "Social Butterfly"],
    dailyPoints: 110,
    location: { lat: 40.7755, lng: -73.956 },
  },
  {
    id: "mia",
    name: "Mia",
    points: 130,
    totalBumps: 13,
    uniquePeopleBumped: 8,
    achievements: ["First Bump", "Legend"],
    dailyPoints: 95,
    location: { lat: 40.7771, lng: -73.9558 },
  },
];

export const seedActivityFeed: ActivityEvent[] = [
  { id: "a1", message: "Alex bumped Sam", timestamp: "2 mins ago" },
  { id: "a2", message: "Jordan reached 150 points", timestamp: "7 mins ago" },
  { id: "a3", message: "Mia unlocked Legend", timestamp: "12 mins ago" },
];

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
