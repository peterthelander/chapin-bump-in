"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { BumpAlert } from "@/components/BumpAlert";
import { CreateProfile } from "@/components/CreateProfile";
import { PlayerStats } from "@/components/PlayerStats";
import { Radar } from "@/components/Radar";
import { useUser } from "@/components/UserProvider";
import { Card } from "@/components/ui/Card";
import type { Coordinates } from "@/lib/types";
import {
  ActivityEvent,
  BUMP_RADIUS_METERS,
  Player,
  arePlayersInBumpRange,
  findNearestPlayer,
  isInSchoolQuietZone,
  mockPlayers,
  seedActivityFeed,
} from "@/lib/gameLogic";

const starterAchievements = ["First Bump"];

const toActivePlayer = (id: string, name: string): Player => ({
  id,
  name,
  points: 0,
  totalBumps: 0,
  uniquePeopleBumped: 0,
  achievements: starterAchievements,
  dailyPoints: 0,
  location: { lat: 40.7758, lng: -73.9583 },
});

export default function HomePage() {
  const { user, setUser, isUserLoading } = useUser();
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>(seedActivityFeed);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [bumpConfirmed, setBumpConfirmed] = useState(false);

  const activePlayer = useMemo(() => {
    if (!user) return null;

    const existingPlayer = players.find((player) => player.id === user.id);
    if (existingPlayer) {
      return {
        ...existingPlayer,
        name: user.name,
      };
    }

    return toActivePlayer(user.id, user.name);
  }, [players, user]);

  useEffect(() => {
    if (!user) {
      setPlayers(mockPlayers);
      return;
    }

    setPlayers((existingPlayers) => {
      const withoutUserPlayer = existingPlayers.filter((player) => player.id !== user.id);
      return [toActivePlayer(user.id, user.name), ...withoutUserPlayer];
    });
  }, [user]);

  const nearest = useMemo(() => {
    if (!currentLocation || !activePlayer) return null;
    return findNearestPlayer(currentLocation, activePlayer.id, players);
  }, [activePlayer, currentLocation, players]);

  const showBumpAlert =
    Boolean(currentLocation) &&
    !isInSchoolQuietZone(currentLocation as Coordinates) &&
    Boolean(nearest?.player) &&
    Boolean(nearest && nearest.distance <= BUMP_RADIUS_METERS) &&
    !bumpConfirmed;

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError("");
      },
      (error) => {
        setLocationError(error.message);
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [user]);

  const handleBump = () => {
    if (!nearest || !currentLocation || !activePlayer) return;

    if (!arePlayersInBumpRange(currentLocation, nearest.player.location)) {
      return;
    }

    setPlayers((existingPlayers) =>
      existingPlayers.map((player) => {
        if (player.id === activePlayer.id) {
          return {
            ...player,
            name: user?.name ?? player.name,
            points: player.points + 10,
            totalBumps: player.totalBumps + 1,
            uniquePeopleBumped: player.uniquePeopleBumped + 1,
            dailyPoints: player.dailyPoints + 10,
          };
        }
        if (player.id === nearest.player.id) {
          return {
            ...player,
            points: player.points + 10,
            totalBumps: player.totalBumps + 1,
            dailyPoints: player.dailyPoints + 10,
          };
        }
        return player;
      }),
    );

    setActivityFeed((events) => [
      {
        id: crypto.randomUUID(),
        message: `${activePlayer.name} bumped ${nearest.player.name}`,
        timestamp: "just now",
      },
      ...events,
    ]);

    setBumpConfirmed(true);
  };

  if (isUserLoading) {
    return null;
  }

  if (!user) {
    return <CreateProfile onCreate={setUser} />;
  }

  if (!activePlayer) {
    return null;
  }

  return (
    <div className="stack">
      {locationError ? (
        <Card>
          <h2>Location issue</h2>
          <p className="muted">{locationError}</p>
        </Card>
      ) : null}

      {showBumpAlert && nearest ? (
        <BumpAlert nearbyPlayerName={nearest.player.name} onConfirm={handleBump} />
      ) : null}

      <Radar currentLocation={currentLocation} currentPlayerId={activePlayer.id} players={players} />
      <PlayerStats player={activePlayer} />
      <ActivityFeed events={activityFeed} />
    </div>
  );
}
