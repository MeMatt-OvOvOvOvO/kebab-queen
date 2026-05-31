"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { HappyHoursResponse } from "@/types/HappyHour.type";

export const useHappyHours = () => {
  return useQuery<HappyHoursResponse>({
    queryKey: [{ resource: "happy-hours", scope: "list" }],
    queryFn: async () => {
      const { data } = await apiClient.get<HappyHoursResponse>("/happy-hours");
      return data;
    },
    refetchInterval: 60_000,
  });
};
