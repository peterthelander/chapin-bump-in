import { ActivityEvent } from "@/lib/gameLogic";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

type ActivityFeedProps = {
  events: ActivityEvent[];
};

export function ActivityFeed({ events }: ActivityFeedProps) {
  const hasEvents = events.length > 0;

  return (
    <Card>
      <h2>Activity Feed</h2>
      {!hasEvents ? <p className="muted">No activity yet — go find someone to bump!</p> : null}
      {hasEvents ? (
        <ul className="activity-list">
          {events.map((event) => {
            const actorName = event.message.split(" ")[0] ?? "Player";

            return (
              <li key={event.id} className="activity-item">
                <Avatar name={actorName} seed={actorName} size="sm" />
                <div className="activity-copy">
                  <p className="activity-message">
                    <span className="activity-name">{actorName}</span>{" "}
                    {event.message.slice(actorName.length).trim()}
                  </p>
                  <p className="muted activity-time">{event.timestamp}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </Card>
  );
}
