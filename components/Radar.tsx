"use client";

import { useMemo } from "react";
import { BUMP_RADIUS_METERS, Player, findNearestPlayer, isInSchoolQuietZone } from "@/lib/gameLogic";
import type { Coordinates } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

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
        title: "School Mode active",
        detail: "Bumps are paused while inside the school quiet zone.",
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
      title: "Someone nearby 👀",
      detail: `${nearest.player.name} is about ${Math.round(nearest.distance)} meters away.`,
      nearbyPlayerName: nearest.player.name,
    };
  }, [currentLocation, currentPlayerId, players]);

  return (
    <Card>
      <h2>Radar</h2>
      <div className="radar-shell" aria-hidden="true">
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-ring ring-3" />
        <div className="radar-pulse" />
        <div className={`radar-center-dot ${radarState.nearbyPlayerName ? "active" : ""}`.trim()} />
        {radarState.nearbyPlayerName ? <div className="radar-target-dot" /> : null}
      </div>
      <p className="radar-title">{radarState.title}</p>
      <p className="muted">{radarState.detail}</p>
      {radarState.nearbyPlayerName ? <Badge>Bump candidate detected</Badge> : null}
    </Card>
  );
}
