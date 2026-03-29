"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type BumpAlertProps = {
  nearbyPlayerName: string;
  onConfirm: () => void;
};

export function BumpAlert({ nearbyPlayerName, onConfirm }: BumpAlertProps) {
  return (
    <Card className="bump-alert">
      <h2>Chapin Bump Alert! 👋</h2>
      <p className="muted">
        <strong>{nearbyPlayerName}</strong> is in range. Ready to bump in for points?
      </p>
      <Button className="large-button" onClick={onConfirm}>
        BUMP IN NOW
      </Button>
    </Card>
  );
}
