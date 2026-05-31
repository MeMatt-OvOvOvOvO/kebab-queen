"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { Product } from "@/types/Product.type";

export const useProducts = (tags: string[] = []) => {
  return useQuery<Product[]>({
    queryKey: [{ resource: "products", scope: "list", data: { tags } }],
    queryFn: async () => {
      const { data } = await apiClient.get<Product[]>("/products", {
        params: { tag: tags },
      });
      return data;
    },
  });
};
