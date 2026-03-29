"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/lib/types";
import { USER_STORAGE_KEY, getStoredUser, saveStoredUser } from "@/lib/userStorage";

type UserContextValue = {
  user: User | null;
  setUser: (nextUser: User | null) => void;
  isUserLoading: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    setUserState(getStoredUser());
    setIsUserLoading(false);
  }, []);

  const setUser = (nextUser: User | null) => {
    setUserState(nextUser);

    if (!nextUser) {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      return;
    }

    saveStoredUser(nextUser);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      isUserLoading,
    }),
    [isUserLoading, user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};
