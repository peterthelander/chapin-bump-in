import { Player } from "@/lib/gameLogic";

type PlayerStatsProps = {
  player: Player;
};

export function PlayerStats({ player }: PlayerStatsProps) {
  return (
    <section className="card">
      <h2>Player Stats</h2>
      <ul className="list">
        <li>
          <strong>Points</strong>
          <p className="muted">{player.points}</p>
        </li>
        <li>
          <strong>Total bumps</strong>
          <p className="muted">{player.totalBumps}</p>
        </li>
        <li>
          <strong>Different people bumped</strong>
          <p className="muted">{player.uniquePeopleBumped}</p>
        </li>
      </ul>
    </section>
  );
}
