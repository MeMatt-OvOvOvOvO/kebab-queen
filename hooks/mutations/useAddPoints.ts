"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { AddPointsResponse } from "@/types/AddPointsResponse.type";

export function useAddPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [{ resource: "transactions", scope: "add" }],
    mutationFn: async ({
      userId,
      points,
      description,
    }: {
      userId: string;
      points: number;
      description?: string;
    }) => {
      const { data } = await apiClient.post<AddPointsResponse>("/transactions", {
        userId,
        points,
        description,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [{ resource: "user" }] });
      queryClient.invalidateQueries({ queryKey: [{ resource: "transactions" }] });
    },
  });
}
