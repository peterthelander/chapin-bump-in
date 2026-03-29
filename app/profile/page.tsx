import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { mockPlayers } from "@/lib/gameLogic";

const profilePlayer = mockPlayers[0];

export default function ProfilePage() {
  return (
    <div className="stack">
      <Card className="profile-header-card">
        <Avatar name={profilePlayer.name} size="lg" />
        <div>
          <h2>{profilePlayer.name}</h2>
          <p className="muted">Chapin community player</p>
        </div>
      </Card>

      <Card>
        <h3>Stats</h3>
        <ul className="stats-grid">
          <li className="stat-item">
            <p className="stat-label">⭐ Total points</p>
            <p className="stat-value">{profilePlayer.points}</p>
          </li>
          <li className="stat-item">
            <p className="stat-label">🤝 Total bumps</p>
            <p className="stat-value">{profilePlayer.totalBumps}</p>
          </li>
          <li className="stat-item">
            <p className="stat-label">👥 People met</p>
            <p className="stat-value">{profilePlayer.uniquePeopleBumped}</p>
          </li>
        </ul>
      </Card>

      <Card>
        <h3>Achievements</h3>
        <ul className="achievement-list">
          {profilePlayer.achievements.map((achievement) => (
            <li key={achievement}>
              <Badge>🏅 {achievement}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
