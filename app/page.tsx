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
} from "@/lib/gameLogic";

const toActivePlayer = (user: { id: string; name: string; points: number; totalBumps: number; uniquePeople: number; achievements: string[] }): Player => ({
  id: user.id,
  name: user.name,
  points: user.points,
  totalBumps: user.totalBumps,
  uniquePeople: user.uniquePeople,
  achievements: user.achievements,
  dailyPoints: user.points,
  location: { lat: 40.7758, lng: -73.9583 },
});

export default function HomePage() {
  const { user, setUser, isUserLoading } = useUser();
  const [players, setPlayers] = useState<Player[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [bumpConfirmed, setBumpConfirmed] = useState(false);

  const activePlayer = useMemo(() => {
    if (!user) return null;
    return toActivePlayer(user);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setPlayers([]);
      return;
    }

    setPlayers((existingPlayers) => {
      const withoutUserPlayer = existingPlayers.filter((player) => player.id !== user.id);
      return [toActivePlayer(user), ...withoutUserPlayer];
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
    if (!nearest || !currentLocation || !activePlayer || !user) return;

    if (!arePlayersInBumpRange(currentLocation, nearest.player.location)) {
      return;
    }

    const updatedUser = {
      ...user,
      points: user.points + 10,
      totalBumps: user.totalBumps + 1,
      uniquePeople: user.uniquePeople + 1,
    };
    setUser(updatedUser);

    setPlayers((existingPlayers) =>
      existingPlayers.map((player) => {
        if (player.id === activePlayer.id) {
          return {
            ...player,
            name: updatedUser.name,
            points: updatedUser.points,
            totalBumps: updatedUser.totalBumps,
            uniquePeople: updatedUser.uniquePeople,
            dailyPoints: updatedUser.points,
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
