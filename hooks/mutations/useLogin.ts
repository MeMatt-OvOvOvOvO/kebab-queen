"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { User } from "@/types/User.type";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [{ resource: "auth", scope: "login" }],
    mutationFn: async (phone: string) => {
      const { data } = await apiClient.post<User>("/auth/login", { phone });
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData([{ resource: "user", scope: "me" }], {
        ...user,
        loyalty: { balance: 0, tier: 1 },
      });
    },
  });
};
