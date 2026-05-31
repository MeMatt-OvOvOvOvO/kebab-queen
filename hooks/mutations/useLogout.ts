"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [{ resource: "auth", scope: "logout" }],
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
