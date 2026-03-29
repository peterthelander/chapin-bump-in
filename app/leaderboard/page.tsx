import { Card } from "@/components/ui/Card";
import { mockPlayers } from "@/lib/gameLogic";

const medalClassByRank = ["rank-gold", "rank-silver", "rank-bronze"];

export default function LeaderboardPage() {
  const ranking = [...mockPlayers].sort((a, b) => b.dailyPoints - a.dailyPoints);

  return (
    <Card>
      <h2>Daily Leaderboard</h2>
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
    </Card>
  );
}
