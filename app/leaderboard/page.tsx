import { mockPlayers } from "@/lib/gameLogic";

export default function LeaderboardPage() {
  const ranking = [...mockPlayers].sort((a, b) => b.dailyPoints - a.dailyPoints);

  return (
    <section className="card">
      <h2>Daily Leaderboard</h2>
      <ol className="list">
        {ranking.map((player) => (
          <li key={player.id} className="leaderboard-row">
            <span>{player.name}</span>
            <span>{player.dailyPoints} pts</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
