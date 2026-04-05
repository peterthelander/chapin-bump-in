"use client";

import { useMemo, useState } from "react";
import type { User } from "@/lib/types";
import { updateStoredUserAvatar } from "@/lib/userStorage";

type AvatarPickerProps = {
  user: User;
  onComplete: () => void;
  onUserUpdate?: (user: User) => void;
};

const PRESET_COUNT = 5;

const buildRandomSeed = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getAvatarUrl = (seed: string): string =>
  `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

export function AvatarPicker({ user, onComplete, onUserUpdate }: AvatarPickerProps) {
  const [selectedSeed, setSelectedSeed] = useState(user.avatarSeed);

  const presetSeeds = useMemo(
    () =>
      Array.from({ length: PRESET_COUNT }, (_, index) =>
        `${user.id}-${index + 1}`,
      ),
    [user.id],
  );

  const handleConfirm = () => {
    const updatedUser = updateStoredUserAvatar(user, selectedSeed);
    onUserUpdate?.(updatedUser);
    onComplete();
  };

  return (
    <section className="rounded-3xl border border-green-100 bg-white/95 p-4 shadow-lg sm:p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-green-900">Choose Your Avatar</h3>

        <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-green-200 bg-green-50">
          <img
            src={getAvatarUrl(selectedSeed)}
            alt="Selected avatar preview"
            className="h-full w-full object-cover"
          />
        </div>

        <button
          type="button"
          className="w-full rounded-2xl border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-800 transition-transform duration-200 hover:scale-105"
          onClick={() => setSelectedSeed(buildRandomSeed())}
        >
          Randomize
        </button>

        <div className="grid grid-cols-5 gap-2 overflow-x-auto pb-1">
          {presetSeeds.map((seed) => {
            const isSelected = selectedSeed === seed;
            return (
              <button
                key={seed}
                type="button"
                onClick={() => setSelectedSeed(seed)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 transition-transform duration-200 hover:scale-105 ${
                  isSelected ? "border-green-500" : "border-green-100"
                }`}
                aria-label={`Select preset avatar ${seed}`}
              >
                <img
                  src={getAvatarUrl(seed)}
                  alt="Preset avatar"
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="w-full rounded-2xl bg-green-500 px-4 py-3 font-bold text-white transition-transform duration-200 hover:scale-105"
        >
          Confirm
        </button>
      </div>
    </section>
  );
}
