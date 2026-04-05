import type { User } from "@/lib/types";

export const USER_STORAGE_KEY = "chapin_user";

const generateAvatarSeed = (): string =>
  Math.random().toString(36).slice(2, 10);

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as Partial<User>;

    if (
      typeof parsedUser.id !== "string" ||
      typeof parsedUser.name !== "string" ||
      typeof parsedUser.avatarSeed !== "string" ||
      typeof parsedUser.createdAt !== "number" ||
      typeof parsedUser.points !== "number" ||
      typeof parsedUser.totalBumps !== "number" ||
      typeof parsedUser.uniquePeople !== "number" ||
      !Array.isArray(parsedUser.achievements)
    ) {
      return null;
    }

    return {
      id: parsedUser.id,
      name: parsedUser.name,
      avatarSeed: parsedUser.avatarSeed,
      createdAt: parsedUser.createdAt,
      points: parsedUser.points,
      totalBumps: parsedUser.totalBumps,
      uniquePeople: parsedUser.uniquePeople,
      achievements: parsedUser.achievements.filter(
        (achievement): achievement is string => typeof achievement === "string",
      ),
    };
  } catch {
    return null;
  }
};

export const saveStoredUser = (user: User): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const createUserProfile = (name: string, avatarSeed: string): User => ({
  id: String(Date.now()),
  name: name.trim(),
  avatarSeed: avatarSeed.trim() || generateAvatarSeed(),
  createdAt: Date.now(),
  points: 0,
  totalBumps: 0,
  uniquePeople: 0,
  achievements: [],
});

export const updateStoredUserName = (user: User, name: string): User => {
  const updatedUser = {
    ...user,
    name: name.trim(),
  };

  saveStoredUser(updatedUser);
  return updatedUser;
};

export const updateStoredUserAvatar = (user: User, seed: string): User => {
  const updatedUser = {
    ...user,
    avatarSeed: seed.trim() || generateAvatarSeed(),
  };

  saveStoredUser(updatedUser);
  return updatedUser;
};
