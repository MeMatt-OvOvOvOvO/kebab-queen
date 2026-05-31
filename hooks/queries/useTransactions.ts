"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { TransactionsPage } from "@/types/Transaction.type";

export const useTransactions = (page = 1, limit = 20) => {
  return useQuery<TransactionsPage>({
    queryKey: [
      { resource: "transactions", scope: "list", data: { page, limit } },
    ],
    queryFn: async () => {
      const { data } = await apiClient.get<TransactionsPage>(
        "/user/transactions",
        {
          params: { page, limit },
        },
      );
      return data;
    },
  });
};
