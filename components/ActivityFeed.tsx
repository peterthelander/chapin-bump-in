import { ActivityEvent } from "@/lib/gameLogic";

type ActivityFeedProps = {
  events: ActivityEvent[];
};

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <section className="card">
      <h2>Activity Feed</h2>
      <ul className="list">
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.message}</strong>
            <p className="muted">{event.timestamp}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
