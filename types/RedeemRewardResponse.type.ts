import { Transaction } from "./Transaction.type";

export type RedeemRewardResponse = {
  transaction: Transaction;
  reward: string;
  spent: number;
};
