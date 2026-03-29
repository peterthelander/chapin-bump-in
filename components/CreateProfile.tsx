"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { User } from "@/lib/types";
import { createUserProfile } from "@/lib/userStorage";

type CreateProfileProps = {
  onCreate: (user: User) => void;
};

export function CreateProfile({ onCreate }: CreateProfileProps) {
  const [name, setName] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    onCreate(createUserProfile(trimmedName));
  };

  return (
    <div className="create-profile-screen">
      <Card className="create-profile-card">
        <h2>Create Profile</h2>
        <p className="muted">Enter your name to start playing Chapin Bump In.</p>
        <form className="create-profile-form" onSubmit={handleSubmit}>
          <input
            className="profile-name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoFocus
            maxLength={40}
            aria-label="Name"
          />
          <Button className="large-button" type="submit" disabled={!name.trim()}>
            Start Playing
          </Button>
        </form>
      </Card>
    </div>
  );
}
