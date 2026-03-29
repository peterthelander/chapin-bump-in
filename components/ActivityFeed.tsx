import { ActivityEvent } from "@/lib/gameLogic";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

type ActivityFeedProps = {
  events: ActivityEvent[];
};

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card>
      <h2>Activity Feed</h2>
      <ul className="activity-list">
        {events.map((event) => {
          const actorName = event.message.split(" ")[0] ?? "Player";

          return (
            <li key={event.id} className="activity-item">
              <Avatar name={actorName} size="sm" />
              <div>
                <p className="activity-message">{event.message}</p>
                <p className="muted activity-time">{event.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
