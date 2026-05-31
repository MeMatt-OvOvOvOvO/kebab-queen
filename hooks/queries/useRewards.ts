"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { Reward } from "@/types/Reward.type";

export const useRewards = () => {
  return useQuery<Reward[]>({
    queryKey: [{ resource: "rewards", scope: "list" }],
    queryFn: async () => {
      const { data } = await apiClient.get<Reward[]>("/rewards");
      return data;
    },
  });
};
