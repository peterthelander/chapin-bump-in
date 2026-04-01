"use client";

import { useMemo } from "react";
import { useUser } from "@/components/UserProvider";
import { Card } from "@/components/ui/Card";

const medalClassByRank = ["rank-gold", "rank-silver", "rank-bronze"];

export default function LeaderboardPage() {
  const { user, isUserLoading } = useUser();

  const ranking = useMemo(() => {
    if (!user) {
      return [];
    }

    return [
      {
        id: user.id,
        name: user.name,
        dailyPoints: user.points,
      },
    ];
  }, [user]);

  if (isUserLoading) {
    return null;
  }

  return (
    <Card>
      <h2>Daily Leaderboard</h2>
      {ranking.length === 0 ? <p className="muted">No players yet</p> : null}
      {ranking.length > 0 ? (
        <ol className="leaderboard-list">
          {ranking.map((player, index) => (
            <li
              key={player.id}
              className={`leaderboard-row ${index < 3 ? medalClassByRank[index] : ""}`.trim()}
            >
              <span className="rank-circle">#{index + 1}</span>
              <span className="leader-name">{player.name}</span>
              <span className="leader-points">{player.dailyPoints} pts</span>
            </li>
          ))}
        </ol>
      ) : null}
    </Card>
  );
}
