"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { RedeemRewardResponse } from "@/types/RedeemRewardResponse.type";

export const useRedeemReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [{ resource: "rewards", scope: "redeem" }],
    mutationFn: async (rewardId: string) => {
      const { data } = await apiClient.post<RedeemRewardResponse>(
        "/rewards/redeem",
        {
          rewardId,
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [{ resource: "user" }] });
      queryClient.invalidateQueries({
        queryKey: [{ resource: "transactions" }],
      });
    },
  });
};
