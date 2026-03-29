"use client";

import { FormEvent, useMemo, useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockPlayers } from "@/lib/gameLogic";
import { updateStoredUserName } from "@/lib/userStorage";

const profileTemplate = mockPlayers[0];

export default function ProfilePage() {
  const { user, setUser, isUserLoading } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const profilePlayer = useMemo(() => {
    if (!user) return null;

    return {
      ...profileTemplate,
      id: user.id,
      name: user.name,
    };
  }, [user]);

  const startEditing = () => {
    if (!user) {
      return;
    }

    setNameInput(user.name);
    setIsEditingName(true);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !nameInput.trim()) {
      return;
    }

    setUser(updateStoredUserName(user, nameInput));
    setIsEditingName(false);
  };

  if (isUserLoading) {
    return null;
  }

  if (!user || !profilePlayer) {
    return (
      <Card>
        <h2>No profile found</h2>
        <p className="muted">Go to Home to create your player profile.</p>
      </Card>
    );
  }

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
        <div className="profile-actions">
          <h3>Profile</h3>
          <Button variant="ghost" onClick={startEditing}>Edit Name</Button>
        </div>

        {isEditingName ? (
          <form onSubmit={handleSave} className="create-profile-form">
            <input
              className="profile-name-input"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Your name"
              maxLength={40}
              autoFocus
            />
            <Button className="large-button" type="submit" disabled={!nameInput.trim()}>
              Save Name
            </Button>
          </form>
        ) : null}
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
