"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import apiClient from "@/lib/apiClient";
import type { User } from "@/types/User.type";

type GlobalState = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const GlobalStateContext = createContext<GlobalState>({
  user: null,
  setUser: () => {},
  isLoading: false,
});

export const useGlobalState = () => useContext(GlobalStateContext);

const hasSessionCookie = () =>
  typeof document !== "undefined" &&
  document.cookie.split(";").some((c) => c.trim().startsWith("kq_has_session="));

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasSessionCookie()) {
      setIsLoading(false);
      return;
    }

    apiClient
      .get<User>("/user/me")
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <GlobalStateContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </GlobalStateContext.Provider>
  );
}
