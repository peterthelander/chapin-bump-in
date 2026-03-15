"use client";

type BumpAlertProps = {
  nearbyPlayerName: string;
  onConfirm: () => void;
};

export function BumpAlert({ nearbyPlayerName, onConfirm }: BumpAlertProps) {
  return (
    <section className="card">
      <h2>Chapin Bump Alert! Someone nearby.</h2>
      <p className="muted">{nearbyPlayerName} is in range. Ready to bump?</p>
      <button type="button" className="large-button" onClick={onConfirm}>
        BUMP IN NOW
      </button>
    </section>
  );
}
