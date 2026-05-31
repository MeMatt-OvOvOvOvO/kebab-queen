import { TransactionsPage } from "./Transaction.type";

export type AddPointsResponse = {
  transaction: TransactionsPage;
  multiplier: number;
  earned: number;
};
