"use client";

import { useMemo } from "react";
import { BUMP_RADIUS_METERS, Coordinates, Player, findNearestPlayer, isInSchoolQuietZone } from "@/lib/gameLogic";

type RadarProps = {
  currentLocation: Coordinates | null;
  currentPlayerId: string;
  players: Player[];
};

export function Radar({ currentLocation, currentPlayerId, players }: RadarProps) {
  const radarState = useMemo(() => {
    if (!currentLocation) {
      return {
        title: "Enable location to start radar",
        detail: "We use your browser geolocation to detect nearby players.",
        nearbyPlayerName: null as string | null,
      };
    }

    if (isInSchoolQuietZone(currentLocation)) {
      return {
        title: "School Mode: Bumps are paused while on campus.",
        detail: "You are inside the school quiet zone.",
        nearbyPlayerName: null as string | null,
      };
    }

    const nearest = findNearestPlayer(currentLocation, currentPlayerId, players);

    if (!nearest || nearest.distance > BUMP_RADIUS_METERS) {
      return {
        title: "No players nearby",
        detail: "Keep moving. Radar checks for players in a 150 meter radius.",
        nearbyPlayerName: null as string | null,
      };
    }

    return {
      title: "Someone nearby…",
      detail: `${nearest.player.name} is about ${Math.round(nearest.distance)} meters away.`,
      nearbyPlayerName: nearest.player.name,
    };
  }, [currentLocation, currentPlayerId, players]);

  return (
    <section className="card">
      <h2>Radar</h2>
      <p>
        <strong>{radarState.title}</strong>
      </p>
      <p className="muted">{radarState.detail}</p>
      {radarState.nearbyPlayerName ? <span className="badge">Bump candidate detected</span> : null}
    </section>
  );
}
