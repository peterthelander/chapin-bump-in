import { mockPlayers } from "@/lib/gameLogic";

const profilePlayer = mockPlayers[0];

export default function ProfilePage() {
  return (
    <section className="card">
      <h2>Player Profile</h2>
      <h3>{profilePlayer.name}</h3>
      <ul className="list">
        <li>
          <strong>Total points</strong>
          <p className="muted">{profilePlayer.points}</p>
        </li>
        <li>
          <strong>Total bumps</strong>
          <p className="muted">{profilePlayer.totalBumps}</p>
        </li>
        <li>
          <strong>Different people bumped</strong>
          <p className="muted">{profilePlayer.uniquePeopleBumped}</p>
        </li>
      </ul>

      <h3>Achievements</h3>
      <ul className="list">
        {profilePlayer.achievements.map((achievement) => (
          <li key={achievement}>
            <span className="badge">{achievement}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
