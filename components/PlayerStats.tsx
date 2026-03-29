import { Player } from "@/lib/gameLogic";
import { Card } from "@/components/ui/Card";

const statsConfig = [
  { key: "points", label: "Points", icon: "⭐" },
  { key: "totalBumps", label: "Total Bumps", icon: "🤝" },
  { key: "uniquePeopleBumped", label: "People Met", icon: "👥" },
] as const;

type PlayerStatsProps = {
  player: Player;
};

export function PlayerStats({ player }: PlayerStatsProps) {
  return (
    <Card>
      <h2>Player Stats</h2>
      <ul className="stats-grid">
        {statsConfig.map((stat) => (
          <li key={stat.key} className="stat-item">
            <p className="stat-label">
              <span>{stat.icon}</span>
              {stat.label}
            </p>
            <p className="stat-value">{player[stat.key]}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
