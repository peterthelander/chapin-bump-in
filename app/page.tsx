"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { BumpAlert } from "@/components/BumpAlert";
import { PlayerStats } from "@/components/PlayerStats";
import { Radar } from "@/components/Radar";
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

const activePlayerId = "alex";

export default function HomePage() {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>(seedActivityFeed);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [bumpConfirmed, setBumpConfirmed] = useState(false);

  const activePlayer = useMemo(
    () => players.find((player) => player.id === activePlayerId) ?? players[0],
    [players],
  );

  const nearest = useMemo(() => {
    if (!currentLocation) return null;
    return findNearestPlayer(currentLocation, activePlayer.id, players);
  }, [activePlayer.id, currentLocation, players]);

  const showBumpAlert =
    Boolean(currentLocation) &&
    !isInSchoolQuietZone(currentLocation as Coordinates) &&
    Boolean(nearest?.player) &&
    Boolean(nearest && nearest.distance <= BUMP_RADIUS_METERS) &&
    !bumpConfirmed;

  useEffect(() => {
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
  }, []);

  const handleBump = () => {
    if (!nearest || !currentLocation) return;

    if (!arePlayersInBumpRange(currentLocation, nearest.player.location)) {
      return;
    }

    setPlayers((existingPlayers) =>
      existingPlayers.map((player) => {
        if (player.id === activePlayer.id) {
          return {
            ...player,
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

  return (
    <div className="stack">
      {locationError ? (
        <section className="card">
          <h2>Location issue</h2>
          <p className="muted">{locationError}</p>
        </section>
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
