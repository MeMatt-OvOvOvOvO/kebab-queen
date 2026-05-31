"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { User } from "@/types/User.type";

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: [{ resource: "user", scope: "me" }],
    queryFn: async () => {
      const { data } = await apiClient.get<User>("/user/me");
      return data;
    },
  });
};
