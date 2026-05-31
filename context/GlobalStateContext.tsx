"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { User } from "@/types/User.type";

const USER_KEY = [{ resource: "user", scope: "me" }] as const;

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
  const queryClient = useQueryClient();

  const { data: user = null, isLoading } = useQuery<User | null>({
    queryKey: USER_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<User>("/user/me");
      return data;
    },
    enabled: hasSessionCookie(),
    staleTime: 30_000,
  });

  function setUser(u: User | null) {
    queryClient.setQueryData(USER_KEY, u);
  }

  return (
    <GlobalStateContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </GlobalStateContext.Provider>
  );
}
