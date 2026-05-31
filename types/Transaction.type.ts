import { TransactionTypeEnum } from "./TransactionType.enum";

export type Transaction = {
  id: string;
  userId: string;
  points: number;
  type: TransactionTypeEnum;
  description: string;
  createdAt: string;
};

export type TransactionsPage = {
  total: number;
  page: number;
  limit: number;
  items: Transaction[];
};
